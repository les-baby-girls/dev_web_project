from flask import Flask, request, jsonify, render_template_string, abort
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return "Hello, World!"

app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def init_db():
    conn = mysql.connector.connect(user='root', password='my-secret-pw', host='localhost')
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS images")
    cursor.execute("USE images")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            post_id VARCHAR(36) PRIMARY KEY,
            author_id VARCHAR(32),
            titre VARCHAR(255),
            description TEXT,
            image VARCHAR(255),
            date DATE
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def get_db_connection():
    try:
        return mysql.connector.connect(user='root', password='my-secret-pw', host='localhost', database='images')
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def post_exists(post_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM posts WHERE post_id = %s", (post_id,))
        exists = cursor.fetchone() is not None
        cursor.close()
        conn.close()
        return exists
    return False

@app.route('/get/post/<post_id>', methods=['GET'])
def get_post(post_id):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM posts WHERE post_id = %s", (post_id,))
        post = cursor.fetchone()
        cursor.close()
        conn.close()
        if post:
            return {
            "post": post,
            "result": "SUCCESS"
            }

        return jsonify({"result": "ERROR", "message": "Post not found"})
    return jsonify({"result": "ERROR", "message": "Failed to connect to the database"})

@app.route('/get/posts', methods=['GET'])
def get_posts():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM posts")
        post = cursor.fetchall()
        cursor.close()
        conn.close()
        if post:
            return {
            "posts": post,
            "result": "SUCCESS"
            }

        return jsonify({"result": "ERROR", "message": "Post not found"})
    return jsonify({"result": "ERROR", "message": "Failed to connect to the database"})

#edit post


#delete post 
@app.route('/delete/post/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    print(post_id)
    conn = get_db_connection()
    if conn:
        
        if post_exists(post_id):
            cursor = conn.cursor(dictionary=True)   
            
            cursor.execute("DELETE FROM images.posts WHERE post_id = %s",(post_id,))

            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({
                "result": "SUCCESS"
            })
        conn.close()
        return jsonify({"result": "ERROR", "message": "Post not found"})
    return jsonify({"result": "ERROR", "message": "Failed to connect to the database"})


@app.route('/edit/post/<post_id>', methods=['PUT'])
def edit_post(post_id):
    try:
        titre = request.get_json()['titre']
        description = request.get_json()['description']
    except:
        return jsonify({"result": "ERROR", "message": "Invalid json format"})
    
    conn = get_db_connection()
    if conn: 
        if post_exists(post_id):
            cursor = conn.cursor(dictionary=True)    

            post = get_post(post_id)
            
            
            if not titre:
                description = post['post']['titre']
            if not description:
                description = post['post']['description']
            cursor.execute("UPDATE images.posts SET titre = %s, description = %s WHERE post_id = %s", (titre, description, post_id))

            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"result": "SUCCESS"})
        conn.close()
        return jsonify({"result": "ERROR", "message": "Post not found"})
    return jsonify({"result": "ERROR", "message": "Failed to connect to the database"})



@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        file = request.files['photo']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify(message="Aucun fichier sélectionné ou type de fichier invalide"), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        url = f"/{file_path}"
        current_date = datetime.now().strftime('%Y-%m-%d')
        post_id = str(uuid.uuid4())
        while post_exists(post_id):
            post_id = str(uuid.uuid4())

        author_id = request.form.get('author_id')
        if not author_id:
            abort(400, description="Author ID is required")

        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO posts (post_id, author_id, titre, description, image, date) VALUES (%s, %s, %s, %s, %s, %s)",
                           (post_id, author_id, request.form['titre'], request.form['description'], url, current_date))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Image téléchargée avec succès', 'url': url, 'post_id': post_id})
        return jsonify({'message': 'Échec de la connexion à la base de données'})

    return render_template_string('''
        <!doctype html>
        <title>Télécharger un nouveau fichier</title>
        <h1>Télécharger une nouvelle image</h1>
        <form method="post" enctype="multipart/form-data" id="uploadForm">
          <input type="file" name="photo">
          <input type="text" name="author_id" placeholder="Author ID" required>
          <input type="text" name="titre" placeholder="Titre" required>
          <input type="text" name="description" placeholder="Description" required>
          <input type="submit" value="Télécharger">
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
                    if (data.message === 'Image téléchargée avec succès') {
                        document.getElementById('uploadForm').reset();
                    }
                })
                .catch(error => alert('Erreur lors du téléchargement de l'image : ' + error));
            };
        </script>
    ''')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)

