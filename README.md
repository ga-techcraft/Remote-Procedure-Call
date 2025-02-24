# **RPC TCP サーバー & クライアント (Unix Domain Socket)**

## **目次**
- [概要](#概要)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
  - [1. Python サーバーの起動](#1-python-サーバーの起動)
  - [2. Node.js クライアントでリクエストを送信](#2-nodejs-クライアントでリクエストを送信)
    - [2.1 クライアントスクリプトの編集](#21-クライアントスクリプトの編集)
    - [2.2 クライアントを実行](#22-クライアントを実行)
- [RPC メソッド一覧](#rpc-メソッド一覧)
- [プロジェクトを通して学んだこと](#プロジェクトを通して学んだこと)
- [今後の改善点](#今後の改善)

## **概要**
このプロジェクトは、**Unix ドメインソケット (AF_UNIX)** を使用した **RPC（Remote Procedure Call）型の TCP サーバーとクライアント** です。  
サーバーは JSON 形式のリクエストを受け取り、指定されたメソッドを実行し、結果をレスポンスとしてクライアントに返します。

## **セットアップ**

### リポジトリのクローン
```sh
git clone https://github.com/your-repo/rpc-tcp-server.git
cd rpc-tcp-server
```

## **使い方**

### **1. Python サーバーの起動**
まず、Python で TCP サーバーを起動します。

```sh
python server.py
```
**出力例**
```
TCPサーバー起動
クライアントと接続しました。
リクエスト: b'{"name": "reverse", "params": ["hello"]}'を受信しました。
レスポンス: b'{"result": "olleh", "error_message": ""}'を送信しました。
接続を解除しました。
```

### **2. Node.js クライアントでリクエストを送信**
`client.js` のリクエストデータを変更し、リクエストを送信します。

#### **2.1 クライアントスクリプトの編集**
```javascript
const net = require("net");
const SERVER_PATH = "server_socket";

const client = new net.Socket();

data = {
  "name": "sort",
  "params": ["orange","apple"],
};

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
```

#### **2.2 クライアントを実行**
```sh
node client.js
```

**出力例**
```
サーバーに接続しました。
リクエスト: { name: 'sort', params: [ 'orange', 'apple' ] }
レスポンス: {"result":["apple","orange"],"error_message":""}
接続を閉じました。
```

## **RPC メソッド一覧**
サーバー (`server.py`) は以下の RPC メソッドを提供します。

| メソッド名        | 説明                                           | 例 |
|------------------|--------------------------------|----------------------|
| `floor`         | 小数を切り捨てて整数に変換        | `floor(1.5) -> 1`   |
| `nroot`         | `n` 乗根を計算 (`val2^(1/val1)`) | `nroot(2, 4) -> 2`  |
| `reverse`       | 文字列を逆順にする               | `reverse("hello") -> "olleh"` |
| `validAnagram`  | 2つの単語がアナグラムか判定       | `validAnagram("hello", "olleh") -> true` |
| `sort`          | 配列を昇順ソートする             | `sort(["orange","apple"]) -> ["apple", "orange"]` |

## **プロジェクトを通して学んだこと** ##
このプロジェクトを通じて、異なるプログラミング言語間でデータの送受信を実装することで、データは本質的に 0 と 1 の羅列であり、送受信のルールを統一すれば異なるソフトウェア間でも通信が可能であることを改めて実感しました。
また、今回は Unix ドメインソケット を利用したため、ネットワーク越しに異なるハードウェアで処理を実行したわけではありませんが、RPC を活用すれば異なるデバイス上の処理を遠隔で実行できることを学びました。

## **今後の改善** ##
今後の改善点として、引数の型チェックを導入し、不正なデータによるエラーを未然に防げるようにしたいです。
また、クライアントが複数のリクエストを同時に送信できるようにし、各リクエストに一意の ID を付与することで、レスポンス受信時にどのリクエストに対応するものかを判別できる仕組みを実装したいと考えています。
これにより、より堅牢で拡張性のあるRPCシステムを構築します。