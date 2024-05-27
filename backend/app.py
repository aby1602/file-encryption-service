from flask import Flask, request, send_file
import os
from encryption import encrypt_file, decrypt_file
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
ENCRYPTED_FOLDER = 'encrypted'
DECRYPTED_FOLDER = 'decrypted'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)
os.makedirs(DECRYPTED_FOLDER, exist_ok=True)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client['file_encryption_db']
files_collection = db['files']

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    key = encrypt_file(filepath, ENCRYPTED_FOLDER)
    file_data = {'filename': filename, 'key': key}
    files_collection.insert_one(file_data)
    
    return {'key': key, 'filename': filename}, 200

@app.route('/download/<file_id>', methods=['POST'])
def download_file(file_id):
    data = request.get_json()
    file_record = files_collection.find_one({'_id': ObjectId(file_id)})
    
    if not file_record:
        return 'File not found', 404
    
    key = file_record['key']
    encrypted_filepath = os.path.join(ENCRYPTED_FOLDER, file_record['filename'])
    decrypted_filepath = os.path.join(DECRYPTED_FOLDER, file_record['filename'])
    
    decrypt_file(encrypted_filepath, decrypted_filepath, key)
    return send_file(decrypted_filepath, as_attachment=True), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
