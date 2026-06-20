# BigQuery Release Notes Web App

A modern, responsive web application built with Python Flask and vanilla web technologies to fetch and display the latest Google BigQuery release notes dynamically.

## 🌟 Features

- **Live Data:** Fetches the latest updates directly from the official [Google BigQuery XML Atom feed](https://docs.cloud.google.com/feeds/bigquery-release-notes.xml).
- **Asynchronous Refresh:** Click the refresh button to grab the newest notes without having to reload the page.
- **Sleek UI:** Features a dark-mode, glassmorphism design with responsive elements and smooth animations.
- **Tweet Integration:** Instantly share a specific update on Twitter with an auto-populated, truncated tweet containing the title and a link to the full note.

## 🛠️ Technology Stack

- **Backend:** Python 3, Flask, `feedparser`, `requests`
- **Frontend:** HTML5, CSS3 (Variables, Flexbox, Animations), Vanilla JavaScript (Fetch API, DOM manipulation)

## 📁 Project Structure

```
├── app.py                  # Main Flask application and API routing
├── requirements.txt        # Python dependencies
├── .gitignore              # Ignored files for Git
├── static/
│   ├── css/
│   │   └── style.css       # App styling (Dark mode, glassmorphism)
│   └── js/
│       └── script.js       # Client-side logic for fetching and rendering notes
└── templates/
    └── index.html          # Main HTML structure
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project running on your local machine.

### Prerequisites
- Python 3.8+ installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pieberrykinnie/peter-event-talks-app.git
   cd peter-event-talks-app
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

5. **View the app:**
   Open your web browser and navigate to `http://127.0.0.1:5000`

## 🤝 Contributing
Feel free to open an issue or submit a pull request if you have ideas on how to improve this project!
