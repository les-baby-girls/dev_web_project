from flask import Flask
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',  # Ensure this is the correct host address
            port=3306,         # Ensure this is the correct port
            database='sys',  # Replace with your database name
            user='root',  # Replace with your username
            password='my-secret-pw'  # Replace with your password
        )
        return connection
    except Error as e:
        print("Erreur lors de la connexion à MySQL:", e)
        return None

@app.route('/')
def index():
    conn = get_db_connection()
    print(conn)
    if conn is not None and conn.is_connected():
        return "Connecté à MySQL!"
    else:
        return "Échec de la connexion à MySQL."

if __name__ == '__main__':
    app.run(debug=True)
