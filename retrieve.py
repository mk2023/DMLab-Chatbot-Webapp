import json
import os
import tempfile

# temporal directory
_tempdir = tempfile.gettempdir()+'/'

class retrieve:

    def __init__(self, name, text_temp, res, turns=None, a=None):
        self.name = name
        self.text_temp = text_temp
        self.res = res
        self.turns = 0
        self.a = {}
        self.turns += 1
        self.a[self.turns] = [self.text_temp, self.res]
        self.filename = _tempdir+'data_' + name + '.json'


        if os.path.exists(self.filename):
            with open(self.filename, 'r') as json_file:
                json_data = json.load(json_file)
            tur = len(json_data)

            json_data[tur + 1] = [self.text_temp, self.res]
            with open(self.filename, 'w') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=4)
        else:
            with open(self.filename, 'w') as f:
                json.dump(self.a, f, ensure_ascii=False, indent=4)
