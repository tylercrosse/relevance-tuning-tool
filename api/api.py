from flask import Flask, request

from search import _search

app = Flask(__name__)

@app.route('/ping')
def ping():
    return 'pong'

@app.route('/search', methods=['POST'])
def search_route():
    body = request.get_json() or {}
    return _search(body)

if __name__ == '__main__':
    app.run(host='localhost', port=5001)