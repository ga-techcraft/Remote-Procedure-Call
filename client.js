const net = require("net");

class Client {
  constructor (server_path) {
    this.server_path = server_path;
    this.sock = new net.Socket();
  }

  connect () {
    // サーバーと接続
    this.sock.connect(this.server_path, () => {
      console.log("サーバーに接続しました。");
      
      // サーバーからレスポンスを受信
      this.sock.on("data", (data) => {
        console.log("レスポンス:", data.toString());
        
      });
      
      // エラー処理
      this.sock.on("error", (err) => {
        console.error("エラー:", err.message);
      });
      
      // 接続終了時の処理
      this.sock.on("close", () => {
        console.log("接続を閉じました。");
      });
    });
  }

  send_request (data) {
    const request = JSON.stringify(data);
    this.sock.write(request);
    console.log("リクエスト:", data);
  }

  disconnect () {
    this.sock.end();
  }
};

class DataGenerator {
  constructor (method) {
   if (method === "floor") {
    return {
      "name": "floor",
      "params": [1,5]
    }
   } else if (method === "nroot") {
    return {
      "name": "nroot",
      "params": [2, 4]
    }
   } else if (method === "reverse") {
    return {
      "name": "reverse",
      "params": ["hello"]
    }
   } else if (method === "validAnagram") {
    return {
      "name": "validAnagram",
      "params": ["hello", "olleh"],
    }
   } else if (method === "sort") {
    return {
      "name": "sort",
      "params": ["orange","apple"],
    }
   }
  }
}

const SERVER_PATH = "server_socket";

const client = new Client(SERVER_PATH);
const data = new DataGenerator("floor")

client.connect();
client.send_request(data);
client.disconnect();