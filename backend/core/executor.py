import os
import subprocess
import tempfile
import shutil
import base64

def run_python_code(code: str):
    """Run Python code safely in a subprocess and return output + optional base64 image"""
    tmp_dir = tempfile.mkdtemp()
    code_file = os.path.join(tmp_dir, "script.py")
    image_file = os.path.join(tmp_dir, "output.png")

    with open(code_file, "w", encoding="utf-8") as f:
        f.write(code)

    try:
        result = subprocess.run(
            ["python3", code_file],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=tmp_dir,
        )
        output = result.stdout
        error = result.stderr

        run_image_base64 = None
        if os.path.exists(image_file):
            with open(image_file, "rb") as img_f:
                run_image_base64 = base64.b64encode(img_f.read()).decode("utf-8")

        return {
            "output": output.strip(),
            "error": error.strip() if error else None,
            "image": run_image_base64,
        }

    except subprocess.TimeoutExpired:
        return {"output": "", "error": "Execution timed out", "image": None}
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
