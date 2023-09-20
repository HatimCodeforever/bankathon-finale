from langchain import PromptTemplate, OpenAI, LLMChain
from dotenv import load_dotenv
import chainlit as cl
import os
import openai
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import DirectoryLoader
from langchain.document_loaders.csv_loader import CSVLoader
import pandas as pd
import numpy as np
import urllib.parse
load_dotenv()

openai_api_key=os.getenv('OPENAI_API_KEY')
template = """Question: {question}
Answer: Let's think step by step."""


@cl.on_chat_start
def main():
    # Instantiate the chain for that user session
    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=OpenAI(temperature=0,openai_api_key=os.getenv('OPENAI_API_KEY')), verbose=True)
    # Store the chain in the user session
    cl.user_session.set("llm_chain", llm_chain)


@cl.on_message
async def main(message: str):
    # Retrieve the chain from the user session
    llm_chain = cl.user_session.get("llm_chain")  # type: LLMChain

    # Call the chain asynchronously
    res = await llm_chain.acall(message, callbacks=[cl.AsyncLangchainCallbackHandler()])
 # Generate a Google Chart URL based on your data (you need to replace this with actual data and chart configuration)
    chart_data = [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 5],
        ['Sleep', 7]
    ]
    chart_url = generate_google_chart(chart_data)
    # Do any post processing here
    message_with_chart = f"{res['text']}\n\n![Google Chart]({chart_url})"

    # "res" is a Dict. For this chain, we get the response by reading the "text" key.
    # This varies from chain to chain, you should check which key to read.
    await cl.Message(content=message_with_chart).send()
    # await cl.Message(content=res["text"]).send()

def generate_google_chart(data):
    chart_data = urllib.parse.quote(str(data))
    chart_url = f"https://chart.googleapis.com/chart?cht=p3&chd=t:{chart_data}&chs=400x200&chl=Work|Eat|Commute|Watch%20TV|Sleep"
    return chart_url


