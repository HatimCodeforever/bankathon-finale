from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import sqlite3

import os
load_dotenv()

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('data_KRA.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def hello_world():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Assuming you have a table named 'your_table_name' with a column 'id'
    cursor.execute("SELECT * FROM CUSTOMERS WHERE Cust_ID = 0")
    record = cursor.fetchone()
    conn.close()
    print(record['name'])
    return "<p>Hello, Hatim!</p>"

# @app.route("/aws-request")
# def runpodApi():
    # ENDPOINT = os.getenv("AWS_ENDPOINT")
    # runtime = boto3.client('runtime.sagemaker')
    # response = runtime.invoke_endpoint(EndpointName = ENDPOINT, ContentType="applaction")
    # input = "what is Python?"
    # print("Response from runpod= ",response)
    # return response


if __name__ == "__main__":
    app.run(debug=True, port=5000)