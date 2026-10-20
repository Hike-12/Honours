# GlycoStrat AI: CDC Diabetes Risk Prediction & Explainability Dashboard

An end-to-end Healthcare AI/ML Clinical Decision Support prototype built on the official **CDC Diabetes Health Indicators Dataset (UCI Machine Learning Repository ID: 891, N = 253,680 patients, 21 clinical/behavioral/demographic indicators)**.

Developed for the **BE (AI&DS) Healthcare AI/ML Mini Project** (Suggested Topic 1: *Disease Risk Prediction Dashboard*, mapped to Experiments 1, 2, 6, and 8 and Course Outcomes CO1 to CO6).

---

## Key Highlights & Engineering Architecture

1. **Real UCI Dataset Pipeline (`N = 253,680` records)**:
   - Programmatically fetches and caches the official **CDC BRFSS Diabetes Health Indicators Dataset (`id=891`)** via `ucimlrepo` into `backend/data/cdc_diabetes_health_indicators.csv`.
   - Performs automated Exploratory Data Analysis (EDA) across age brackets, WHO clinical BMI tiers, comorbidity relative risk multipliers, and socioeconomic income gradients.
2. **Multi-Model Training & Clinical Screening Calibration**:
   - Benchmarks **Histogram-Based Gradient Boosted Decision Trees (`HistGradientBoostingClassifier`, Primary Model: ROC-AUC = `0.8271`, Brier Score = `0.0974`)**, **Random Forest (`ROC-AUC = 0.8231`)**, and **Standardized Logistic Regression (`ROC-AUC = 0.8192`)** on a stratified 80/20 split (`202,944` train / `50,736` held-out test records).
   - Calibrates a sensitivity-aware **Clinical Screening Cut-Point ($\tau = 0.28$)** to address the `6.18 : 1` class imbalance (`13.93%` positive), boosting screening Recall/Sensitivity from `31.54%` (at $\tau = 0.50$) to **`51.79%`** (maximizing F1-Score at `0.4590` with `91.9%` Negative Predictive Value).
3. **Real-Time Counterfactual Explainable AI (Local & Global XAI)**:
   - **Local Patient Attribution**: Executes a vectorized 23-row counterfactual ablation per patient in `< 3ms` to compute the exact percentage-point risk contribution ($\Delta P_i$) of each of the 21 indicators relative to healthy clinical reference values.
   - **Counterfactual "What-If" Intervention Pathway**: Simulates the exact risk reduction achieved when modifiable lifestyle and clinical factors (`BMI`, `HighBP`, `HighChol`, `PhysActivity`, `Smoker`, `Fruits`, `Veggies`) are optimized.
4. **Clinical Telemetry UI (`React 18 + Tailwind CSS`)**:
   - Follows strict clinical interface guidelines (`DESIGN.md`): `64px` hero heading, `18px` subheading, `16px` navbar/button typography, `14px` badges, `rounded-md` (`6px`) maximum border radius, uniform 1.75px stroke SVG icons, and zero decorative gradients or glow effects.

---

## Repository Structure

```text
Honours/
├── AGENTS.md                        # Karpathy & Ponytail engineering guidelines
├── DESIGN.md                        # Clinical Telemetry UI & Typography design system
├── README.md                        # Project documentation & setup instructions
├── backend/
│   ├── data/
│   │   ├── cdc_diabetes_health_indicators.csv  # Cached 253,680-row UCI #891 dataset
│   │   └── uci_metadata.json                   # Official UCI repository metadata
│   ├── artifacts/
│   │   ├── diabetes_model_bundle.joblib        # Trained HistGBM & LogisticRegression bundle
│   │   └── dashboard_metadata.json             # Precomputed EDA & 50,736-test evaluation metrics
│   ├── train_and_eda.py             # UCI dataset fetcher, EDA calculator, ML trainer & figure generator
│   ├── main.py                      # FastAPI server (/api/health, /api/metadata, /api/presets, /api/predict)
│   ├── test_backend.py              # Assert-based self-check verifying data, models, XAI & validation
│   ├── generate_report.py           # Generates DOCX, HTML, and Markdown Project Reports (TNR 12pt Justified)
│   └── requirements.txt             # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main clinical telemetry application shell
│   │   ├── index.css                # Tailwind & custom range slider rules
│   │   └── components/
│   │       ├── Icons.jsx            # Uniform 1.75px stroke inline SVG icon library
│   │       ├── RiskWorkbench.jsx    # 21-indicator patient form, live risk gauge & What-If XAI
│   │       ├── PopulationEDA.jsx    # 253,680-record epidemiological visualizations & dictionary
│   │       └── ModelEvaluation.jsx  # Multi-model table, SVG ROC/PR curves, confusion matrix & CO/SDG mapping
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── docs/
    ├── Project_Report_CDC_Diabetes_Risk_Dashboard.docx  # MS Word Report (Times New Roman, 12pt, Justified, No Em Dashes)
    ├── Project_Report_CDC_Diabetes_Risk_Dashboard.html  # Print-to-PDF HTML Report
    ├── PROJECT_REPORT.md                                # Markdown Report
    └── figures/                                         # High-res EDA/ROC charts & live UI screenshots
```

---

## Quick Start Instructions

### 1. Backend Setup (FastAPI + Python ML)

```powershell
cd backend
pip install -r requirements.txt

# (Optional) Re-run dataset EDA, model training, and report figure generation
python train_and_eda.py

# Run assert-based verification suite
python test_backend.py

# Start FastAPI server on http://127.0.0.1:8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup (React + Vite + Tailwind CSS)

```powershell
cd frontend
npm install

# Start Vite development server on http://127.0.0.1:5173
npm run dev
```

Open **`http://127.0.0.1:5173`** in your browser to interact with the live application.

---

## Academic & Clinical Disclaimer

This application is an academic prototype developed for the BE (AI&DS) Healthcare AI/ML Mini Project and is **not** a substitute for professional medical advice, clinical diagnosis, or treatment.
