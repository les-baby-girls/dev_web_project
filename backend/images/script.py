from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)


def get_db_connection():
    try:
        conn = mysql.connector.connect(
            user='root',  # Replace with your username
            password='my-secret-pw',  # Replace with your password
            host='localhost',  # Ensure this is the correct host address
        )

        if conn is None:
            raise Error("Failed to connect to MySQL")

        cursor = conn.cursor()

        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS images")
        conn.commit()

        # Use the new database
        cursor.execute("USE images")
        conn.commit()

        # Create table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS images.posts (
                post_id VARCHAR(32) PRIMARY KEY,
                titre VARCHAR(255),
                description TEXT,
                image TEXT,
                date DATE
            )
        """)
        conn.commit()

        return conn
    
    except Exception as e:
        print("Erreur lors de la connexion à MySQL:", e)
        return None


@app.route('/', methods=['GET'])
def index():
    conn = get_db_connection()

    print(conn)
    if conn is not None and conn.is_connected():
        return "Connecté à MySQL!"
    else:
        return "Échec de la connexion à MySQL."


@app.route('/post/<string:post_id>', methods=['GET'])
def get_post_by_id(post_id):
    conn = get_db_connection()
    if conn is None:
        return  jsonify({"result": "FAILED"})

    cursor = conn.cursor()

    query = """
        SELECT * FROM images.posts
        WHERE post_id = '%s'
    """
    cursor.execute(query, (post_id,))
    result = cursor.fetchone()

    if result:
        
        return jsonify({"result": "FAILED"})
    else:
        return jsonify(result)

@app.route('/posts', methods=['GET'])
def get_posts():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"result": "FAILED"})

    cursor = conn.cursor()

    query = """
        SELECT * FROM images.posts
    """
    cursor.execute(query)
    result = cursor.fetchall()

    return jsonify({
        "result": "SUCCESS",
        "posts": result
    })


if __name__ == '__main__':
    app.run(debug=True)
