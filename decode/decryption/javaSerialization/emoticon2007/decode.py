from json import JSONEncoder
class MyCustomEncoder(JSONEncoder):
      def default(self,o):
             return o.__dict__

import javaobj
import json
j = javaobj.JavaObjectUnmarshaller(open('341', 'rb')).readObject()
data=json.dumps(j, cls=MyCustomEncoder)
print(data)