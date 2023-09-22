from flask import Flask,jsonify,request
from dotenv import load_dotenv
import sqlite3
import csv
import os
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents.agent_types import AgentType
from langchain.chat_models import ChatOpenAI
from langchain.chains import create_sql_query_chain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document
from langchain.agents.agent_toolkits import create_retriever_tool


load_dotenv()

app = Flask(__name__)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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
    conn = sqlite3.connect('data_KRA.sqlite')
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

@app.route('/get_bar_chart')
def bar_chart():
    conn = sqlite3.connect('data_KRA.sqlite')
    cursor = conn.cursor()
    query = "SELECT DISTINCT Location_Type FROM Persona;"
    cursor.execute(query)
    unique_locations = [row[0] for row in cursor.fetchall()]
    print(unique_locations)
    return {"data": unique_locations}

@app.route('/answer', methods=['POST'])
def answer_query():
    try:
        data = request.get_json()
        user_query = data.get('query', '')
        print("user Query:- ",user_query)

        # response_data = {'answer': "The customers in the database are Customer 0 (42, Male), Customer 1 (44, Female), Customer 2 (47, Male), Customer 3 (59, Female), Customer 4 (49, Female), Customer 5 (37, Other), Customer 6 (69, Other), Customer 7 (54, Other), Customer 8 (62, Male), and Customer 9 (37, Other)."}

        response = question_answering_intermediate(user_query)
        print(response)
        response_data = {'answer': response}

        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)})

# BETTER NOT TO USE THIS
# def sql_query_generator(user_query):
#     sqlite_db_path = "data_KRA.sqlite"
#     db = SQLDatabase.from_uri(f"sqlite:///{sqlite_db_path}")
#     llm = ChatOpenAI(temperature=0)
#     chain = create_sql_query_chain(llm = llm, db = db)
#     response = chain.invoke({"question": user_query})
#     return response

def question_answering_basic(user_query):
    sqlite_db_path = "data_KRA.sqlite"
    db = SQLDatabase.from_uri(f"sqlite:///{sqlite_db_path}")
    llm = OpenAI(temperature=0)
    db_chain = SQLDatabaseChain.from_llm(
        llm= llm,
        db= db,
        verbose = True,
        use_query_checker = True
    )
    return db_chain.run(user_query)

def question_answering_intermediate(user_query):
    sqlite_db_path = "data_KRA.sqlite"
    db = SQLDatabase.from_uri(f"sqlite:///{sqlite_db_path}")
    llm = OpenAI(temperature=0)

    agent_executor = create_sql_agent(
        llm= llm,
        toolkit= SQLDatabaseToolkit(db=db, llm=OpenAI(temperature=0)),
        verbose= True,
        agent_type= AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    )
    return agent_executor.run(user_query)

def question_answering_advanced(user_query):
    few_shots = {
    'Who are the top k employees' : 'SELECT Employees.Name, RM_KRAs.Target_FY22_23_ABS, RM_KRAs.CURR_COMPLETION_ABS FROM Employees INNER JOIN RM_KRAs ON Employees.Emp_ID = RM_KRAs.Employee_ID ORDER BY RM_KRAs.Target_FY22_23_ABS DESC, RM_KRAs.CURR_COMPLETION_ABS DESC LIMIT k'
    }
    embeddings = OpenAIEmbeddings()
    few_shot_docs = [Document(page_content=question, metadata={'sql_query': few_shots[question]}) for question in few_shots.keys()]
    vector_db = FAISS.from_documents(few_shot_docs, embeddings)
    retriever = vector_db.as_retriever()

    # Creating custom tool for the agent
    tool_description = """This tool will help you understand similar examples to adapt them to the user question. Input to this tool should be the user question."""

    retriever_tool = create_retriever_tool(
        retriever,
        name='sql_get_similar_examples',
        description=tool_description
    )
    custom_tool_list = [retriever_tool]

    sqlite_db_path = "data_KRA.sqlite"
    db = SQLDatabase.from_uri(f"sqlite:///{sqlite_db_path}")
    llm = ChatOpenAI(temperature=0)

    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    custom_suffix = """
        I should first get the similar examples I know.
        I should first use the sql query provided in the example I know.
        If the answer is not correct, I can then look at the tables in the database to see what I can query.
        Then I should query the schema of the most relevant tables
"""
    agent = create_sql_agent(
        llm=llm,
        toolkit=toolkit,
        verbose=True,
        agent_type= AgentType.OPENAI_FUNCTIONS,
        extra_tools= custom_tool_list,
        suffix= custom_suffix
    )
    return agent.run(user_query)


if __name__ == "__main__":
    app.run(debug=True, port=5000)