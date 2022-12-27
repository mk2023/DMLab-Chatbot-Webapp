import json
import os
import tempfile

# temporal directory
_tempdir = tempfile.gettempdir()+'/'

def prompt_redesign(text_temp, name, term):
    filename = _tempdir+'data_' + name + '.json'
    print(filename)
    if os.path.exists(filename):
        with open(filename, 'r') as json_file:
            json_data = json.load(json_file)
        tr = len(json_data)
        i = 1
        text_history = str()
        while True:

            if int(term) == -1:
                if i <= tr:
                    text_history += 'Human:' + json_data[str(i)][0] + '\nSkye:' + json_data[str(i)][1] + '\n'
                    text = text_history + 'Human:' + text_temp + '\nSkye:'
                    i += 1
                else:
                    break
            elif tr >= int(term) > 0:
                if i <= tr - int(term):
                    text_history += 'Human:' + json_data[str(i)][0] + '\nSkye:' + json_data[str(i)][1] + '\n'
                    text = text_history + 'Human:' + text_temp + '\nSkye:'
                    i += 1
                else:
                    break
            else:
                text = '\nHuman:' + text_temp + '\nSkye:'
                break
        return text
    else:
        text = '\nHuman:' + text_temp + '\nSkye:'

        return text

def custom_prompt_redesign(text_temp, name, term, bot_name):
    filename = _tempdir+'data_' + name + '.json'
    print(filename)
    if os.path.exists(filename):
        with open(filename, 'r') as json_file:
            json_data = json.load(json_file)
        tr = len(json_data)
        i = 1
        text_history = str()
        while True:

            if int(term) == -1:
                if i <= tr:
                    text_history += 'Human:' + json_data[str(i)][0] + f"\n{bot_name}:" + json_data[str(i)][1] + '\n'
                    text = text_history + 'Human:' + text_temp + f"\n{bot_name}:"
                    i += 1
                else:
                    break
            elif tr >= int(term) > 0:
                if i <= tr - int(term):
                    text_history += 'Human:' + json_data[str(i)][0] + f"\n{bot_name}:" + json_data[str(i)][1] + '\n'
                    text = text_history + 'Human:' + text_temp + f"\n{bot_name}:"
                    i += 1
                else:
                    break
            else:
                text = '\nHuman:' + text_temp + f"\n{bot_name}:"
                break
        return text
    else:
        text = '\nHuman:' + text_temp + f"\n{bot_name}:"

        return text