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
load_dotenv()

openai_api_key=os.getenv('OPENAI_API_KEY')
template = """Question: {question}

Answer: Let's think step by step."""
path_RM = './DATA/RM_KRAs.csv'
path_c = './DATA/Customers.csv'
path_c_e = './DATA/Customers_Employees.csv'
path_persona = './DATA/Persona.csv'
path_product_holding = './DATA/Product_Holding.csv'
path_contact = './DATA/contacthistory.csv'

def predict(path_RM, path_c, path_c_e, path_persona, path_product_holding ,path_contact, template):
  RM_KRAs = pd.read_csv(path_RM)
  customers = pd.read_csv(path_c)
  customers_employees = pd.read_csv(path_c_e)
  persona = pd.read_csv(path_persona)
  product_holding = pd.read_csv(path_product_holding)
  contacthistory = pd.read_csv(path_contact)
  template = template
  prompt_template = PromptTemplate.from_template(template, input_variables = ['context'])
  customers.drop('Address', inplace=True, axis=1)
  customers_employees.rename(columns={'RM': 'Employee_ID'}, inplace=True)
  my_df1 = customers_employees.merge(customers, on='Cust_ID', how='inner')
  product_summary_df = product_holding.copy()

  product_summary_df['Product'] = product_summary_df.drop(columns=['Cust_ID']).apply(
      lambda row: ', '.join([col.replace('_', ' ') for col in row.index if row[col] == 1]), axis=1)

  product_summary_df.drop(columns=[col for col in product_summary_df.columns if col != 'Product'], inplace=True)

  product_summary_df['Product'].replace('', np.nan, inplace=True)
  product_summary_df['Cust_ID'] = product_holding['Cust_ID']

  my_df2 = my_df1.merge(product_summary_df, on='Cust_ID', how='inner')
  my_df3 = my_df2.merge(persona, on='Cust_ID', how='inner')

  my_df1_csv = my_df1.to_csv('merged.csv', index = True)

  loader = CSVLoader('/content/merged.csv', encoding="utf-8", csv_args={'delimiter': ',', 'quotechar': '"'})
  data = loader.load()

  llm = ChatOpenAI(temperature=0.7, openai_api_key = openai_api_key, model_name='gpt-3.5-turbo')
  chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt_template)

  text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

  chunks = text_splitter.split_documents(data)

  embeddings = OpenAIEmbeddings(openai_api_key = openai_api_key)
  vector_db1 = FAISS.from_documents(chunks[:5000], embedding = embeddings)
  vector_db2 = FAISS.from_documents(chunks[5000:], embedding = embeddings)

  query = 'Tell me which employee is the best. Consider Account balance and rating.'
  docs1 = vector_db1.similarity_search(query)
  docs2= vector_db2.similarity_search(query)
  final_docs = np.concatenate([docs1, docs2], axis=0)
  return chain.run(input_documents= final_docs, question=query)

@cl.on_chat_start
def main():
    # Instantiate the chain for that user session
    prompt = PromptTemplate(template=template, input_variables=["question"])
    llm_chain = LLMChain(prompt=prompt, llm=OpenAI(temperature=0,openai_api_key=os.getenv('OPENAI_API_KEY')), verbose=True)
    # llm_chain = predict(path_RM, path_c, path_c_e, path_persona, path_product_holding, path_contact, template=template)

    # Store the chain in the user session
    cl.user_session.set("llm_chain", llm_chain)


@cl.on_message
async def main(message: str):
    # Retrieve the chain from the user session
    llm_chain = cl.user_session.get("llm_chain")  # type: LLMChain

    # Call the chain asynchronously
    res = await llm_chain.acall(message, callbacks=[cl.AsyncLangchainCallbackHandler()])

    # Do any post processing here

    # "res" is a Dict. For this chain, we get the response by reading the "text" key.
    # This varies from chain to chain, you should check which key to read.
    await cl.Message(content=res["text"]).send()


