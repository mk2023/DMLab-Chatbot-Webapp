from flask import Flask, request, jsonify, render_template
import json
from pathlib import Path

import os, fnmatch
import openai
from retrieve import retrieve
from prompt import *
from utils import *

app = Flask(__name__)

_tempdir = tempfile.gettempdir()



#Environment Variables
app.config['OPENAI_KEY'] = os.environ.get('OPENAI_KEY')
app.config['TURNS'] = int(os.environ.get('TURNS'))

##app.config['WARMUP'] = os.environ.get('WARMUP')

app.config['TEMPERATURE'] = float(os.environ.get('TEMPERATURE'))
app.config['MAX_TOKENS'] = int(os.environ.get('MAX_TOKENS'))
app.config['TOP_P'] = float(os.environ.get('TOP_P'))
app.config['FREQUENCY_PENALTY'] = float(os.environ.get('FREQUENCY_PENALTY'))
app.config['PRESENCE_PENALTY'] = float(os.environ.get('PRESENCE_PENALTY'))


print(f"TURNS: {app.config['TURNS']}\n"\
#f"WARMUP: {app.config['WARMUP']}\n"\
f"TEMPERATURE: {app.config['TEMPERATURE']}\n"\
f"MAX_TOKENS: {app.config['MAX_TOKENS']}\n"\
f"TOP_P: {app.config['TOP_P']}\n"\
f"FREQUENCY_PENALTY: {app.config['FREQUENCY_PENALTY']}\n"\
f"PRESENCE_PENALTY: {app.config['PRESENCE_PENALTY']}\n")

@app.route('/chat', methods=['POST'])
def skye_chat():

    openai.api_key = app.config['OPENAI_KEY']
    body = json.loads(request.get_data())

    text = body['user_input']
    name = body['user_id']
    model_name = body['ai_name']
    id_model_name = body['id_ai_name']
    warmup = body['warmup']
    
    text_temp = text
    text_create = prompt_redesign(text_temp, name, app.config['TURNS'])

    #prompt_text = app.config['WARMUP']+text_create
    prompt_text = warmup+text_create
    #text create = past conversations

    # openai 대답호출
    response = openai.Completion.create(
        engine=model_name,
        prompt=prompt_text,
        temperature=app.config['TEMPERATURE'],
        max_tokens=app.config['MAX_TOKENS'],
        top_p=app.config['TOP_P'],
        frequency_penalty=app.config['FREQUENCY_PENALTY'],
        presence_penalty=app.config['PRESENCE_PENALTY'],
        stop=["Human:", "Skye:"]
    )

    res = response['choices'][0]['text'].replace("\n","")
    retrieve(name, text_temp, res)

    res_send = {
        "skye_says": response['choices'][0]['text'].replace("\n",""),
        "id_model_name": id_model_name
    }
    print(f"{warmup}")
    print(f"[CHAT][{name}][{get_now_time()}]:: user : {text}")
    print(f'[CHAT][{name}][{get_now_time()}]:: skye : {res_send["skye_says"]}')
    

    return jsonify(res_send)

@app.route('/chatting')
def chatting():
    return render_template('chat_room.html')

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080, debug=True)