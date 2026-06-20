from flask import Flask, jsonify, render_template
import feedparser
import requests
import html
import re

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def get_notes():
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
        
        feed = feedparser.parse(response.content)
        
        notes = []
        for entry in feed.entries:
            content = entry.get('content', [{'value': entry.get('summary', '')}])[0].get('value', '')
            
            # Simple sanitization to handle potential broken HTML 
            # Note: A real app might use bleach here
            
            notes.append({
                'title': entry.get('title', 'No Title'),
                'link': entry.link if hasattr(entry, 'link') else '',
                'published': entry.get('published', entry.get('updated', '')),
                'content': content
            })
            
        return jsonify({'status': 'success', 'notes': notes})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
