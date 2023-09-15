from flask import Flask
from dotenv import load_dotenv
import os
import boto3
load_dotenv()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, Hatim!</p>"

@app.route("/runpod-request")
def runpodApi():
    ENDPOINT = os.getenv("AWS_ENDPOINT")
    runtime = boto3.client('runtime.sagemaker')
    response = runtime.invoke_endpoint(EndpointName = ENDPOINT, ContentType="applaction")
    input = "what is Python?"
    print("Response from runpod= ",response)
    return response


def Ved():
    import asyncio
    import websockets
    import requests

    # WebSocket server
    async def websocket_server(websocket, path):
        print("Client connected")

        try:
            while True:
                await websocket.recv()
                # Implement your report refresh logic here
                refresh_power_bi_report()
                print("Report refreshed")
                await asyncio.sleep(3)  # Wait for 3 seconds before refreshing again
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")

    # Function to refresh the Power BI report
    def refresh_power_bi_report():
        # Make an HTTP POST request to refresh the Power BI report
        report_id = "your_report_id"
        access_token = "your_access_token"  # You should obtain a valid access token
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        url = f"https://api.powerbi.com/v1.0/myorg/groups/{your_group_id}/reports/{report_id}/refreshes"
        response = requests.post(url, headers=headers)

        if response.status_code == 202:
            print("Report refresh request accepted")
        else:
            print("Error refreshing report:", response.text)

    # Start the WebSocket server
    start_server = websockets.serve(websocket_server, "localhost", 8765)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    app.run(debug=True, port=5000)