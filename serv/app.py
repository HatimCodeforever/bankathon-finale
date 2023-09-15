from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import sqlite3

import os
load_dotenv()

app = Flask(__name__)

def get_db_connection(): #Getting the Database
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

def db_to_csv:
    import sqlite3
    import csv

    # Connect to the SQLite database
    conn = sqlite3.connect('/content/data_KRA.sqlite')  # Replace with the path to your SQLite database file
    cursor = conn.cursor()

    # Get the list of table names in the database
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_names = cursor.fetchall()

    # Close the database connection
    conn.close()

    # Iterate through each table and export to a CSV file
    for table_name in table_names:
        table_name = table_name[0]  # Extract the table name from the tuple
        
        # Connect to the SQLite database again
        conn = sqlite3.connect('/content/data_KRA.sqlite')
        cursor = conn.cursor()
        
        # Query data from the table
        cursor.execute(f'SELECT * FROM {table_name}')
        
        # Fetch all the rows
        rows = cursor.fetchall()
        
        # Get the column names from the table
        cursor.execute(f'PRAGMA table_info({table_name})')
        column_names = [column[1] for column in cursor.fetchall()]
        
        # Close the database connection
        conn.close()
        
        # Create a CSV file and write data
        csv_file = f'{table_name}.csv'
        with open(csv_file, 'w', newline='') as file:
            writer = csv.writer(file)
            
            # Write the column headers
            writer.writerow(column_names)
            
            # Write the data rows
            writer.writerows(rows)
        
        print(f'{csv_file} has been created.')


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