# ModelAtlas 🌍
*A comprehensive knowledge base of statistical & mathematical models with formulas, code, and interactive demos.*

---

## Introduction

**ModelAtlas** is an open-source knowledge base of statistical and mathematical models, designed for students, researchers, and competition participants.  
It provides **formulas, Python code snippets, application notes, and interactive demos** for better understanding and quick reference.

---

## Features

- Systematic categories: regression, time series, clustering, evaluation, simulation, Bayesian models, and more  
- Mathematical formulas rendered with LaTeX/KaTeX  
- Python code snippets ready to run  
- Interactive visual demos (e.g., linear regression fitting, AHP weights, SIR epidemic simulation)  
- Model search and filtering  
- Future support: one-click LaTeX export for **mathematical modeling competitions (CUMCM/MCM)** papers  

---

## Project Structure
```
ModelAtlas/
├── frontend/          # Next.js frontend (React + Tailwind)
├── backend/           # FastAPI backend (Python 3.13)
├── data/              # JSON model dataset
├── docker-compose.yml # Optional: one-click startup
└── README.md
```

---

## Getting Started

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Open: [http://127.0.0.1:8000/models](http://127.0.0.1:8000/models)

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open: [http://localhost:3000](http://localhost:3000)

---

## Example Models
- Linear Regression  
- Logistic Regression  
- Analytic Hierarchy Process (AHP)  
- TOPSIS  
- SIR Epidemic Model  

---

## Deployment
- Frontend → [Vercel](https://vercel.com/)  
- Backend → [Render](https://render.com/) / [Fly.io](https://fly.io/) / Docker  

---

## Roadmap
- [ ] Add more models (50+ common and advanced methods)  
- [ ] LaTeX export for modeling paper sections  
- [ ] User accounts (favorites, notes, contributions)  
- [ ] Advanced interactive demos (e.g., TOPSIS visualization, LP feasible region)  

---

## Contributing
Contributions are welcome! Add new models, improve code, or create interactive demos.

---

## License
MIT License © 2025 ModelAtlas Contributors
