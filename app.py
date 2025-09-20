from flask import Flask, render_template, request
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import os

app = Flask(__name__)

# Path to local cache folder for BERT model
MODEL_CACHE_DIR = "./bert_model_cache"

# Load precomputed data (ensure embedding dimension matches your model)
with open("ipc_recommender.pkl", "rb") as f:
    data = pickle.load(f)

df = data['df']

# Some rows may have missing embeddings; filter them
df = df[df['embedding'].apply(lambda x: x is not None)]
emb_matrix = np.vstack(df['embedding'].values)

# Load sentence-transformer model
model_name = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(model_name, cache_folder=MODEL_CACHE_DIR)

# ------------------- Helper Functions -------------------

def get_embedding(text):
    """Return the embedding of the query text."""
    return model.encode(text)

def recommend(query, top_n=5):
    """Return top-N recommendations based on cosine similarity."""
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

# ------------------- Flask Routes -------------------

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
        chapter_name = row.get('Chapter', 'Unknown Chapter')  # Use .get to avoid KeyError
        chapters.setdefault(chapter_name, []).append(row)
        # Get unique chapters for dropdown
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
    app.run(debug=True, host="0.0.0.0", port=5000)
