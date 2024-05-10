from flask import Flask, request, jsonify, render_template_string
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import mysql.connector
from mysql.connector import Error

import uuid

app = Flask(__name__)

# Configure the directory where images will be stored
app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """Check if the file has one of the allowed extensions"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def init_db():
    """Initialize the database and create tables if they don't exist"""
    try:
        conn = mysql.connector.connect(user='root', password='my-secret-pw', host='localhost')
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS images")
        cursor.execute("USE images")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                post_id VARCHAR(32) PRIMARY KEY,
                titre VARCHAR(255),
                description TEXT,
                image VARCHAR(255),
                date DATE
            )
        """)
        conn.commit()
    except Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_db_connection():
    """Get a connection to the database"""
    try:
        return mysql.connector.connect(user='root', password='my-secret-pw', host='localhost', database='images')
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    """Handle the upload of a file"""
    if request.method == 'POST' and 'photo' in request.files:
        file = request.files['photo']
        if file.filename == '':
            return jsonify(message="No selected file"), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            url = f"/{file_path}"
            current_date = datetime.now().strftime('%Y-%m-%d')
            conn = get_db_connection()
            if conn:
                cursor = conn.cursor()
                id = uuid.uuid4()
                cursor.execute("INSERT INTO posts (titre, description, image, date) VALUES (%s, %s, %s, %s, %s)",
                               (id, request.form['titre'], request.form['description'], url, current_date))
                conn.commit()
                generated_id = cursor.lastrowid  # Retrieve the auto-generated ID
                cursor.close()
                conn.close()
                return jsonify({'message': 'Image uploaded successfully', 'url': url, 'post_id': generated_id})
            else:
                return jsonify({'message': 'Failed to connect to database'})
        else:
            return jsonify({'message': 'Invalid file type'}), 400

    # HTML form for uploading an image
    return render_template_string('''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new Image</h1>
        <form method="post" enctype="multipart/form-data" id="uploadForm">
          <input type="file" name="photo">
          <input type="text" name="titre" placeholder="Title">
          <input type="text" name="description" placeholder="Description">
          <input type="submit" value="Upload">
        </form>
        <script>
            document.getElementById('uploadForm').onsubmit = function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch('/upload', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.message === 'Image uploaded successfully') {
                        document.getElementById('uploadForm').reset();  // Reset the form fields after successful upload
                    }
                })
                .catch(error => alert('Error uploading image: ' + error));
            };
        </script>
    ''')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
