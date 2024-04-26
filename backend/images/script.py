from flask import Flask, jsonify, request

# Create a Flask application instance
app = Flask(__name__)

commentaries = [
    {'id': 1, 'author': 'John', 'comment': 'Great work!'},
    {'id': 2, 'author': 'Alice', 'comment': 'Awesome project!'},
    {'id': 3, 'author': 'Bob', 'comment': 'Keep it up!'}
]


# Define a route and its handler
@app.route('/', methods=['GET'])
def hello():
    return 'Hello, World!'

# Define a route and its handler
@app.route('/get_comment/<id>', methods=['GET'])
def get_commentary(id):
    commentary = commentaries.get(id)
    if commentary:
        return jsonify(commentary)
    else:
        return jsonify({'error': 'Commentary not found'}), 404

# Route to add a new comment
@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.json
    if 'author' in data and 'comment' in data:
        new_comment = {
            'id': len(commentaries) + 1,
            'author': data['author'],
            'comment': data['comment']
        }
        commentaries.append(new_comment)
        return jsonify({'message': 'Comment added successfully'}), 201
    else:
        return jsonify({'error': 'Author and comment are required fields'}), 400

# Route to delete a comment
@app.route('/delete_comment/<id>/<int:comment_id>', methods=['DELETE'])
def delete_comment(id,comment_id):
    for comment in commentaries:
        if comment['id'] == comment_id:
            commentaries.remove(comment)
            return jsonify({'message': 'Comment deleted successfully'}), 200
    return jsonify({'error': 'Comment not found'}), 404

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)