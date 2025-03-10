from flask import Flask, request, jsonify
from pymongo import MongoClient
import fitz  # PyMuPDF
from docx import Document
import google.generativeai as genai
from bson import ObjectId  # ✅ Import ObjectId
import os
import json
import re
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# MongoDB Connection
MONGO_URI = "mongodb+srv://varnikasm:ikzPxFJOHhIuw8ch@cluster0.lig9v.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["test"]
collection = db["resumes"]

# Set Gemini API Key
GENAI_API_KEY = "AIzaSyBVqf4bm__g2DFrHhOt3G5sEQQ4-Z7lYwI"
genai.configure(api_key=GENAI_API_KEY)

def extract_text_from_pdf(file_path):
    """Extract text from PDF"""
    try:
        text = ""
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text("text") + "\n"
        return text.strip()
    except Exception as e:
        return f"Error extracting text from PDF: {e}"

def extract_text_from_docx(file_path):
    """Extract text from DOCX"""
    try:
        doc = Document(file_path)
        return "\n".join([para.text.strip() for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        return f"Error extracting text from DOCX: {e}"

def extract_keywords_with_gemini(text):
    """Use Gemini AI to extract structured information"""
    prompt = f"""
    Extract structured information from the following resume text:
    - Skills
    - Projects
    - Personal Interests
    - Organizations

    Resume Text:
    {text}

    Provide response strictly in JSON:
    {{
        "skills": ["Python", "Machine Learning"],
        "projects": ["Chatbot Development"],
        "personal_interests": ["Reading", "Hiking"],
        "organizations": ["Google", "Harvard University"]
    }}
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        raw_response = response.text
        json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
        return json.loads(json_match.group(0)) if json_match else None
    except Exception as e:
        return {"error": f"Gemini API call failed: {e}"}

def save_to_mongo(data, candidate_id):
    """Ensure only one resume record per candidate (overwrite if exists)"""
    try:
       

        # Add candidateId as a reference
        data["candidateId"] = candidate_id

        # ✅ Check if candidate already has a resume
        existing_resume = collection.find_one({"candidateId": candidate_id})

        if existing_resume:
            # ✅ Overwrite the existing resume instead of creating a new one
            collection.update_one({"candidateId": candidate_id}, {"$set": data})
            return {"message": "Resume updated successfully", "data": data}
        else:
            # ✅ Insert new resume if none exists
            inserted_doc = collection.insert_one(data)
            data["_id"] = str(inserted_doc.inserted_id)
            return {"message": "Resume saved successfully", "data": data}

    except Exception as e:
        return {"error": f"MongoDB Insert/Update Failed: {e}"}


@app.route("/upload", methods=["POST"])
def upload_resume():
    """API endpoint to upload a resume file"""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    candidate_id = request.form["candidateId"]
    file_ext = os.path.splitext(file.filename)[-1].lower()
    temp_path = f"temp{file_ext}"

    file.save(temp_path)

    if file_ext == ".pdf":
        resume_text = extract_text_from_pdf(temp_path)
    elif file_ext == ".docx":
        resume_text = extract_text_from_docx(temp_path)
    else:
        return jsonify({"error": "Unsupported file format"}), 400

    os.remove(temp_path)  # Delete temp file

    if not resume_text:
        return jsonify({"error": "Failed to extract text from resume"}), 400

    extracted_data = extract_keywords_with_gemini(resume_text)
    if not extracted_data:
        return jsonify({"error": "AI failed to extract structured data"}), 500

    return jsonify(save_to_mongo(extracted_data, candidate_id))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
