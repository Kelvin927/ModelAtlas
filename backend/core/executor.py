import os, subprocess, uuid, shutil, time, json
from fastapi import UploadFile
from typing import List, Optional
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

SESSION_TTL = 300  # seconds

async def run_python_code(
    code: str,
    files: Optional[List[UploadFile]] = None,
    required_columns: Optional[list] = None,
    column_map: Optional[str] = None,          # <--- NEW
):
    cleanup_old_sessions()

    session_id = str(uuid.uuid4())
    tmp_dir = os.path.join(OUTPUT_DIR, session_id)
    os.makedirs(tmp_dir, exist_ok=True)

    code_file = os.path.join(tmp_dir, "script.py")
    with open(code_file, "w", encoding="utf-8") as f:
        f.write(code)

    # Save first uploaded file as data.csv
    data_csv_path = os.path.join(tmp_dir, "data.csv")
    if files:
        for f in files:
            content = await f.read()
            if content and len(content) > 0:
                with open(data_csv_path, "wb") as out:
                    out.write(content)
                print(f"[executor] Saved {getattr(f, 'filename', 'unknown')} as {data_csv_path}")
                try:
                    f.file.seek(0)
                except Exception:
                    pass
                break
    else:
        print("[executor] No files provided to executor")

    # Parse column_map (JSON string like {"x":"lng","y":"lat"})
    mapping = {}
    if column_map:
        try:
            mapping = json.loads(column_map)
        except Exception:
            mapping = {}

    # Normalize CSV columns to canonical names
    if os.path.exists(data_csv_path):
        try:
            df_norm = pd.read_csv(data_csv_path)

            # 1) apply user-provided mapping (user -> canonical)
            # mapping: {"x":"lng"} means rename "lng" -> "x"
            if mapping:
                inverse = {v: k for k, v in mapping.items() if v in df_norm.columns}
                if inverse:
                    df_norm = df_norm.rename(columns=inverse)

            # 2) auto-alias mapping using required_columns aliases
            if required_columns:
                for col in required_columns:
                    canon = col.get("canonical") or col.get("name") or col.get("role")
                    if canon and canon not in df_norm.columns:
                        aliases = [a.lower() for a in col.get("aliases", [])]
                        hit = next((c for c in df_norm.columns if c.lower() in aliases), None)
                        if hit:
                            df_norm = df_norm.rename(columns={hit: canon})

                # dtype coercion
                for col in required_columns:
                    canon = col.get("canonical") or col.get("name") or col.get("role")
                    if col.get("dtype") == "number" and canon in df_norm.columns:
                        df_norm[canon] = pd.to_numeric(df_norm[canon], errors="coerce")

            df_norm.to_csv(data_csv_path, index=False)
        except Exception as e:
            return {"stdout":"", "stderr": f"Failed to normalize CSV: {e}", "images":[], "tables":[], "artifacts":[]}

    # Require data.csv if needed
    need_csv = bool(required_columns) or ("read_csv('data.csv')" in code or 'read_csv("data.csv")' in code)
    if need_csv and not os.path.exists(data_csv_path):
        return {
            "stdout": "",
            "stderr": "data.csv not found in the working directory. Upload a CSV file before running.",
            "images": [],
            "tables": [],
            "artifacts": [],
        }

    # Validate against canonical names
    if required_columns:
        canon_list = [{"name": c.get("canonical") or c.get("name") or c.get("role")} for c in required_columns]
        err = validate_csv(data_csv_path, canon_list)
        if err:
            return {"stdout":"", "stderr": err, "images": [], "tables": [], "artifacts": []}

    # Run
    try:
        print(f"[executor] Running script in {tmp_dir}")
        print(f"[executor] Directory contents before run: {os.listdir(tmp_dir)}")
        result = subprocess.run(
            ["python3", code_file],
            capture_output=True,
            text=True,
            timeout=15,
            cwd=tmp_dir,
        )
        print(f"[executor] Directory contents after run: {os.listdir(tmp_dir)}")
    except subprocess.TimeoutExpired:
        return {"stdout":"", "stderr":"Execution timeout", "images":[], "tables":[], "artifacts":[]}

    # Collect outputs
    artifacts, images, tables = [], [], []
    for fname in os.listdir(tmp_dir):
        fpath = os.path.join(tmp_dir, fname)
        if fname.endswith(".png"):
            images.append(f"/outputs/{session_id}/{fname}")
        elif fname.endswith(".csv"):
            try:
                df = pd.read_csv(fpath)
                tables.append({"name": fname, "preview": df.head(10).to_dict(orient="records")})
            except Exception as e:
                tables.append({"name": fname, "error": str(e)})
            artifacts.append(f"/outputs/{session_id}/{fname}")

    return {"stdout": result.stdout, "stderr": result.stderr, "images": images, "artifacts": artifacts, "tables": tables}

def cleanup_old_sessions():
    now = time.time()
    for session in os.listdir(OUTPUT_DIR):
        session_path = os.path.join(OUTPUT_DIR, session)
        if not os.path.isdir(session_path):
            continue
        try:
            mtime = os.path.getmtime(session_path)
            if now - mtime > SESSION_TTL:
                shutil.rmtree(session_path, ignore_errors=True)
        except Exception:
            pass

def validate_csv(file_path: str, required_columns: list):
    if not required_columns:
        return None
    try:
        df = pd.read_csv(file_path, nrows=5)
        df_cols = set(df.columns)
        req_cols = {c["name"] for c in required_columns}
        if not req_cols.issubset(df_cols):
            return f"CSV must contain columns {list(req_cols)}, but got {list(df_cols)}"
        return None
    except Exception as e:
        return f"Failed to read CSV: {str(e)}"
