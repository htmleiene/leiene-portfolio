from flask import Flask, render_template, request, send_file
import pandas as pd
import os
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Sua página de upload já pronta

@app.route('/conciliar', methods=['POST'])
def conciliar():
    file1 = request.files['planilha1']
    file2 = request.files['planilha2']
    chave = request.form.get('coluna-chave')  # Ex: "CNPJ" ou "ID"

    df1 = pd.read_excel(file1)
    df2 = pd.read_excel(file2)

    # Conciliação por chave
    merged = df1.merge(df2, on=chave, how='outer', indicator=True)

    # Se quiser destacar apenas os divergentes:
    divergencias = merged[merged['_merge'] != 'both']

    # Gera planilha com divergências
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        divergencias.to_excel(writer, index=False, sheet_name='Divergências')
    output.seek(0)

    return send_file(output,
                     download_name='relatorio_conciliacao.xlsx',
                     as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
