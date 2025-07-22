################## try groq and assembly api
from flask import Flask, request, jsonify
from flask_cors import CORS
import assemblyai as aai
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# AssemblyAI setup
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
if not ASSEMBLYAI_API_KEY:
    raise RuntimeError("Missing AssemblyAI API key.")
aai.settings.api_key = ASSEMBLYAI_API_KEY

# Groq setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing Groq API key.")
groq_client = Groq(api_key=GROQ_API_KEY)

@app.route("/")
def home():
    return jsonify({"message": "ListenLearn backend running"})

@app.route("/transcribe", methods=["POST"])
def transcribe():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No audio file uploaded"}), 400

    # Save to temp
    temp = f"/tmp/{file.filename}"
    file.save(temp)

    # Use AssemblyAI SDK to transcribe
    config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.best)
    transcript = aai.Transcriber(config=config).transcribe(temp)

    if transcript.status == aai.TranscriptStatus.error:
        return jsonify({"error": transcript.error}), 500

    return jsonify({"text": transcript.text})

@app.route("/summarize", methods=["POST"])
def summarize():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Use Groq API to summarize
    response = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": f"Summarize the following podcast transcript:\n\n{text}"}],
        model="llama-3.3-70b-versatile",
    )

    summary = response.choices[0].message.content.strip()
    return jsonify({"summary": summary})

@app.route("/highlight", methods=["POST"])
def highlight():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Use Groq API to extract highlights
    response = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": f"Extract key highlights from the following podcast transcript:\n\n{text}"}],
        model="llama-3.3-70b-versatile",
    )

    highlights = response.choices[0].message.content.strip()
    return jsonify({"highlights": highlights})

@app.route("/flashcards", methods=["POST"])
def flashcards():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    prompt = (
    f"Generate 9 concise flashcard question and answer pairs based on the following podcast transcript. "
    f"Format response as JSON list with 'question' and 'answer' keys:\n\n{text}\n\n"
    f"Example:\n"
    f"[{{{{'question': 'Q1?', 'answer': 'A1'}}}}, ...]"
)


    response = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    content = response.choices[0].message.content.strip()

    try:
        # Sometimes the model might return JSON as a string - parse it
        import json
        flashcards = json.loads(content)
    except Exception:
        # If parsing fails, return raw content inside a single flashcard (fallback)
        flashcards = [{"question": "Flashcards generation error", "answer": content}]

    return jsonify({"flashcards": flashcards})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5001)), debug=True)
