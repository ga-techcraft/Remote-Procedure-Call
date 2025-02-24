import socket
import os
import json
import math

class RPCHandler:    
    def __init__(self):
       self.rpcMap = {
          "floor": self.floor, 
          "nroot": self.nroot, 
          "reverse": self.reverse, 
          "validAnagram": self.validAnagram, 
          "sort": self.sort, 
       }

    def handle_request(self, parsed_request): 
       method_name = parsed_request["name"]
       params = parsed_request["params"]

       method = self.rpcMap[method_name]
       result = method(params)
       return result

    def floor(self, params):
       return int(math.floor(params[0]))

    def nroot(self, params):
       return params[1] ** (1 / params[0])

    def reverse(self, params):
       return params[0][::-1]
    
    def validAnagram(self, params):
       return sorted(params[0]) == sorted(params[1])

    def sort(self, params):
       print(params)
       return sorted(params)

class DataHandler:
   @staticmethod
   # レスポンスデータの例
   # {
   #    "result": 1,
   #    "error_message": "エラーが発生しました。"
   # }
   def make_data(result="", error_message=""):
      response = {
         "result": result,
         "error_message": error_message,
      }

      return json.dumps(response).encode("utf-8")
   
   # リクエストデータの例
   #  {
   #     "name": "method_name",
   #     "params": [1, 1],
   #  }
   @staticmethod
   def parse_data(request):
    decoded_request = request.decode("utf-8")
    dict_request = json.loads(decoded_request)
   
    return dict_request
   

class TCPServer:
   def __init__(self, server_address, rpc_handler):
      self.server_address = server_address
      self.rpc_handler = rpc_handler

   def run(self):
      try:
         os.unlink(self.server_address)
      except FileNotFoundError:
         pass
      
      try:
          self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
          self.sock.bind(self.server_address)
          self.sock.listen(5)

          print("TCPサーバー起動")

          while True:
            connect, _ = self.sock.accept()
            print("クライアントと接続しました。")

            request = connect.recv(4096)
            print(f"リクエスト: {request}を受信しました。")
            parsed_request = DataHandler.parse_data(request)
            result = self.rpc_handler.handle_request(parsed_request)
            response = DataHandler.make_data(result=result)
            connect.sendall(response)
            print(f"レスポンス: {response}を送信しました。")
            connect.close()
            print("接続を解除しました。")

      except KeyboardInterrupt as e:
         print(e)
      except Exception as e:
          print(e)
      finally:
          self.sock.close()
          print("UDP 接続を閉じました。")

if __name__ == "__main__":
   server_address = "server_socket"
   rpc_handler = RPCHandler()
   udp_server = TCPServer(server_address, rpc_handler)
   udp_server.run()