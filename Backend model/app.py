from flask import Flask, jsonify


app = Flask(__name__)


@app.route('/predict/<symbol>', methods=['GET'])
def predict_stock(symbol):

    result = {
        "stock_name": "RELIANCE.BO",
        "today_price": {
            "open_price": 2500.45,
            "close_price": 2600.23
        }
    }

    print(result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
