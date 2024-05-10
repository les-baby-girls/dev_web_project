from flask import Flask, request, jsonify, render_template_string
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# Configuration du répertoire où les images seront stockées
app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Assurer que le dossier de téléchargement existe
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """ Vérifier si le fichier a une des extensions autorisées """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def init_db():
    """ Initialiser la base de données et créer les tables si elles n'existent pas """
    try:
        conn = mysql.connector.connect(user='root', password='my-secret-pw', host='localhost')
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS images")
        cursor.execute("USE images")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                post_id VARCHAR(36) PRIMARY KEY,
                titre VARCHAR(255),
                description TEXT,
                image VARCHAR(255),
                date DATE
            )
        """)
        conn.commit()
    except Error as e:
        print(f"Erreur lors de l'initialisation de la base de données : {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_db_connection():
    """ Obtenir une connexion à la base de données """
    try:
        return mysql.connector.connect(user='root', password='my-secret-pw', host='localhost', database='images')
    except Error as e:
        print(f"Erreur de connexion à MySQL : {e}")
        return None

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    """ Gérer le téléchargement d'un fichier """
    if request.method == 'POST' and 'photo' in request.files:
        file = request.files['photo']
        if file.filename == '':
            return jsonify(message="Aucun fichier sélectionné"), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            url = f"/{file_path}"
            current_date = datetime.now().strftime('%Y-%m-%d')
            post_id = str(uuid.uuid4())
            conn = get_db_connection()
            if conn:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO posts (post_id, titre, description, image, date) VALUES (%s, %s, %s, %s, %s)",
                               (post_id, request.form['titre'], request.form['description'], url, current_date))
                conn.commit()
                cursor.close()
                conn.close()
                return jsonify({'message': 'Image téléchargée avec succès', 'url': url, 'post_id': post_id})
            else:
                return jsonify({'message': 'Échec de la connexion à la base de données'})
        else:
            return jsonify({'message': 'Type de fichier invalide'}), 400

    # Formulaire HTML pour le téléchargement d'une image
    return render_template_string('''
        <!doctype html>
        <title>Télécharger un nouveau fichier</title>
        <h1>Télécharger une nouvelle image</h1>
        <form method="post" enctype="multipart/form-data" id="uploadForm">
          <input type="file" name="photo">
          <input type="text" name="titre" placeholder="Titre">
          <input type="text" name="description" placeholder="Description">
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
                        document.getElementById('uploadForm').reset();  // Réinitialiser les champs du formulaire après le téléchargement réussi
                    }
                })
                .catch(error => alert('Erreur lors du téléchargement de l'image : ' + error));
            };
        </script>
    ''')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
