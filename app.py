from flask import Flask
from dotenv import load_dotenv
import os
import runpod
load_dotenv()

# runpod.api_key = os.getenv("RUNPOD_API")
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, Hatim!</p>"

@app.route("/runpod-request")
def runpodApi():
    input = "what is Python?"
    endpoint = runpod.Endpoint(os.getenv("RUNPOD_ENDPOINT"))
    response = endpoint.run_sync({"your_model_input_key": input})
    print("Response from runpod= ",response)
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)