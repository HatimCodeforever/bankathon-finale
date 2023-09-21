from flask import Flask,jsonify,request
from dotenv import load_dotenv
import sqlite3
import csv
import os
load_dotenv()

app = Flask(__name__)

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
    return {"labels": column_names, "series": sums}


@app.route("/dashh",methods=['GET'])
def dash():
    conn = sqlite3.connect('data_KRA.sqlite')  # Replace 'your_database.db' with your database file name
    cursor = conn.cursor()
    cursor.execute('SELECT Emp_ID FROM Employees')
    employee_ids = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT Name FROM Employees')
    employee_name = [row[0] for row in cursor.fetchall()]
    conn.close()
    response_data = {
        'empid': employee_ids,
        'empname': employee_name
    }
    return jsonify({"response": response_data})

def db_to_csv():
    conn = sqlite3.connect('/content/data_KRA.sqlite')  # Replace with the path to your SQLite database file
    cursor = conn.cursor()
    # Get the list of table names in the database
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_names = cursor.fetchall()

    # Close the database connection
    conn.close()
    for table_name in table_names:
        table_name = table_name[0]
        conn = sqlite3.connect('/content/data_KRA.sqlite')
        cursor = conn.cursor()
        
        # Query data from the table
        cursor.execute(f'SELECT * FROM {table_name}')
        
        # Fetch all the rows
        rows = cursor.fetchall()
        cursor.execute(f'PRAGMA table_info({table_name})')
        column_names = [column[1] for column in cursor.fetchall()]
        conn.close()
        csv_file = f'{table_name}.csv'
        with open(csv_file, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(column_names)
            writer.writerows(rows)
        
        print(f'{csv_file} has been created.')

@app.route('/get_employee_data', methods=['POST'])
def get_employee_data():
    data = request.get_json()  # Parse JSON data from the request body
    emp_id = data.get('empid')
    print("empid  :----- ",emp_id)
    if not emp_id:
        return jsonify({'error': 'empid parameter is missing'}), 400
    try:
        conn = sqlite3.connect('data_KRA.sqlite')
        cursor = conn.cursor()
        cursor.execute('SELECT TARGET,JAN_COMPLETION_PCT, FEB_COMPLETION_PCT, MAR_COMPLETION_PCT, APR_COMPLETION_PCT, MAR_COMPLETION_PCT, MAY_COMPLETION_PCT, JUN_COMPLETION_PCT, JUL_COMPLETION_PCT, AUG_COMPLETION_PCT, SEP_COMPLETION_PCT, OCT_COMPLETION_PCT, NOV_COMPLETION_PCT, DEC_COMPLETION_PCT FROM RM_KRAs WHERE Employee_ID = ?', (emp_id,))
        rows = cursor.fetchall()
        if not rows:
            return jsonify({'error': 'No data found for the specified empid'}), 404

        r1 = list(rows[0])
        r2 = list(rows[1])
        r3 = list(rows[2])
        r4 = list(rows[3])
        r5 = list(rows[4])
        s1= r1.pop(0)
        s2= r2.pop(0)
        s3= r3.pop(0)
        s4= r4.pop(0)
        s5= r5.pop(0)

        conn.close()

        return {"r1": r1,"r2": r2,"r3": r3,"r4": r4,"r5": r5,"s1": s1,"s2": s2,"s3": s3,"s4": s4,"s5": s5}

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/answer', methods=['POST'])
def answer_query():
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        print("user Query:- ",user_query)
        response_data = {'answer': "I am a chatbot so pls ask me somthing difficult!!"}
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == "__main__":
    app.run(debug=True, port=5000)