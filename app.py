from flask import Flask, render_template, request
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import os
import requests

# ------------------- Environment Variables -------------------
FLASK_ENV = os.environ.get("FLASK_ENV", "production")
SESSION_SECRET = os.environ.get("SESSION_SECRET", "fallback_secret")
MODEL_URL = os.environ.get("MODEL_URL", "https://huggingface.co/your_model_repo/resolve/main/ipc_recommender.pkl")
MODEL_PATH = os.environ.get("MODEL_PATH", "ipc_recommender.pkl")

# ------------------- Flask App -------------------
app = Flask(__name__)
app.secret_key = SESSION_SECRET

# ------------------- Ensure Model Exists -------------------
if not os.path.exists(MODEL_PATH):
    print("Downloading model...")
    r = requests.get(MODEL_URL, stream=True)
    r.raise_for_status()
    with open(MODEL_PATH, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
    print("Model downloaded successfully.")

# ------------------- Load Model -------------------
with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

df = data['df']
df = df[df['embedding'].apply(lambda x: x is not None)]
emb_matrix = np.vstack(df['embedding'].values)

# Load sentence-transformer model
MODEL_CACHE_DIR = "./bert_model_cache"
model_name = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(model_name, cache_folder=MODEL_CACHE_DIR)

# ------------------- Helper Functions -------------------
def get_embedding(text):
    return model.encode(text)

def recommend(query, top_n=5):
    q_emb = get_embedding(query).reshape(1, -1)
    scores = cosine_similarity(q_emb, emb_matrix).flatten()
    top_idx = scores.argsort()[::-1][:top_n]
    results = []
    for i in top_idx:
        row = df.iloc[i].to_dict()
        results.append({
            "Section": row.get("Section", "N/A"),
            "Chapter": row.get("Chapter", "N/A"),
            "Description": row.get("Description", "No description available"),
            "score": float(scores[i])
        })
    return results

# ------------------- Routes -------------------
@app.route("/", methods=["GET", "POST"])
def home():
    recommendations = None
    query = request.form.get("query")
    if query:
        recommendations = recommend(query, top_n=5)
        return render_template("results.html", query=query, recommendations=recommendations)
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/browse")
def browse():
    chapters = {}
    for idx, row in df.iterrows():
        chapter_name = row.get('Chapter', 'Unknown Chapter')
        chapters.setdefault(chapter_name, []).append(row)
    unique_chapters = sorted(chapters.keys())
    return render_template("browse.html", chapters=chapters, unique_chapters=unique_chapters)

@app.route("/section/<section_id>")
def section_detail(section_id):
    section = df[df['Section'] == section_id].to_dict(orient='records')
    section = section[0] if section else None
    related = []
    if section:
        related = [
            s for s in df[df['Chapter'] == section.get("Chapter", "")].to_dict(orient='records')
            if s['Section'] != section_id
        ][:3]
    return render_template("section_detail.html", section=section, related=related)

# ------------------- Run App -------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(FLASK_ENV == "development"))
