const net = require("net");
const SERVER_PATH = "server_socket";

const client = new net.Socket();

// data = {
//   "name": "floor",
//   "params": [1.5],
// }

// data = {
//   "name": "nroot",
//   "params": [2, 4],
// }

// data = {
//   "name": "reverse",
//   "params": ["hello"],
// }

// data = {
//   "name": "validAnagram",
//   "params": ["hello", "olleh"],
// }

data = {
  "name": "sort",
  "params": ["orange","apple"],
}

// サーバーと接続
client.connect(SERVER_PATH, () => {
  console.log("サーバーに接続しました。");

  // サーバーにリクエストを送信
  const request = JSON.stringify(data);
  client.write(request);
  console.log("リクエスト:", data);
});

// サーバーからレスポンスを受信
client.on("data", (data) => {
  console.log("レスポンス:", data.toString());

  // レスポンス受信後、ソケットを閉じる
  client.end();
});

// エラー処理
client.on("error", (err) => {
  console.error("エラー:", err.message);
});

// 接続終了時の処理
client.on("close", () => {
  console.log("接続を閉じました。");
});