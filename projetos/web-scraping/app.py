from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# Rota para realizar o scraping
@app.route('/scrape', methods=['POST'])
def scrape():
    # Receber a URL do frontend
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"success": False, "message": "URL não fornecida"}), 400

    # Realizar o scraping da página
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extrair informações (como título e descrição de exemplo)
        results = []
        for item in soup.find_all('h2'):  # Exemplo: buscar todos os h2
            title = item.text.strip()
            description = item.find_next('p').text.strip() if item.find_next('p') else "Sem descrição"
            results.append({"title": title, "description": description})

        return jsonify({"success": True, "results": results})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
