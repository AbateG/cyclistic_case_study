# 🚲 Cyclistic Odyssey: A Tale of Two Riders

This is more than just a data analysis—it's a story. The story of 3 million bike rides, a city's heartbeat, and a mission to understand the soul of a bike-share program. We set out to answer a simple question: "What truly separates a casual rider from a member?" What we found was a revelation.

---

## 💡 The Revelation

Members are the city's diligent commuters, clocking in with purpose. Casuals are the free-spirited explorers, chasing sunsets and serendipity. This project didn't just quantify the difference; it celebrated it, turning raw data into a narrative of human behavior.

We discovered that by strategically inviting casual riders to join the "member family," Cyclistic can unlock a treasure trove of opportunity—specifically, an additional **$2.8 million in annual revenue**. This isn't just about profit; it's about making a city more vibrant, connected, and joyful, one pedal stroke at a time.

---

## 🗺️ The Journey: Your Guide to the Project

### Prerequisites
* Python 3.8+
* R 4.0+
* A spirit of curiosity!

### Installation & Setup
1. **Clone this repo**: `git clone [your-repo-url]`
2. **Create virtual environment** (recommended):
   ```bash
   python -m venv .venv
   # On Windows: .venv\Scripts\activate
   # On macOS/Linux: source .venv/bin/activate
   ```
3. **Install dependencies**: `pip install -r requirements.txt`
4. **For R components**: `install.packages(c("tidyverse", "ggplot2", "lubridate"))`

### Usage Examples

**Run the main analysis**:
```bash
python src/analysis.py
```

**Launch the interactive dashboard**:
```bash
streamlit run app.py
```

**View the unified HTML dashboard**:
Open `dashboard/unified_dashboard.html` in your web browser for a comprehensive view of all visualizations, reports, and insights.

**Start the API server**:
```bash
python run_api.py
```

**Run automated reporting**:
```bash
python scripts/run_automated_reporting.py
```

### Project Structure

```
cyclistic_case_study/
├── data/                    # Data files
│   ├── raw/                # Original data (gitignored)
│   ├── processed/          # Cleaned/processed data
│   └── external/           # External datasets
├── src/                    # Source code (Python/R modules)
├── scripts/                # Executable scripts
├── dashboard/              # Web dashboard files
│   └── assets/            # CSS/JS assets
├── models/                 # Trained ML models
├── outputs/                # Generated visualizations/reports
├── tests/                  # Unit tests
├── docs/                   # Documentation
├── notebooks/              # Jupyter notebooks
└── reports/                # Final reports
```

---

## 📜 The Soul of the Project

This analysis is a manifesto—a testament to the idea that the greatest power of data lies in its humanity. Every ride is a chapter, and every chart is a portrait of people and their purpose.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- How to report bugs
- How to suggest features
- How to submit pull requests
- Code style guidelines

---

## 📄 License

Licensed under the [MIT License](LICENSE.md).

---

## ✨ Crafted With Wonder

* **Data**: From the incredible team at Motivate International Inc. (Divvy).
* **Tools**: Python, R, and a whole lot of passion.
