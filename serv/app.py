from flask import Flask,jsonify
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sqlite3

import os
load_dotenv()

app = Flask(__name__)
def get_db_connection():
    conn = sqlite3.connect('data_KRA.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/home2")
def hello_world():
    response = {"message": "failed"}
    return jsonify(response)

@app.route("/chartdata")
def chartdata():
    conn = sqlite3.connect('data_KRA.sqlite')
    cursor = conn.cursor()
    table_name = 'Product_Holding'
    cursor.execute(f'PRAGMA table_info({table_name})')
    column_info = cursor.fetchall()
    column_names = [column[1] for column in column_info if column[1] != 'Cust_ID']
    query = f'SELECT * FROM {table_name}'
    cursor.execute(query)
    rows = cursor.fetchall()
    # Close the database connection
    conn.close()
    sums = [sum(row[i] for row in rows) for i in range(1, len(rows[0]))]
    print(column_names)
    print(sums)
    return {"labels": column_names, "series": sums}


@app.route("/dashh",methods=['GET'])
def dash():
    print("dashboard called!!")
    conn = sqlite3.connect('data_KRA.sqlite')  # Replace 'your_database.db' with your database file name
    cursor = conn.cursor()
    cursor.execute('SELECT Emp_ID FROM Employees')
    employee_ids = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT Name FROM Employees')
    employee_name = [row[0] for row in cursor.fetchall()]
    conn.close()
    print(employee_ids)
    print(employee_name)
    response_data = {
        'empid': employee_ids,
        'empname': employee_name
    }
    return jsonify({"response": response_data})

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