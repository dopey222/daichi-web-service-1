// 必要なモジュールを読み込み
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

// .envファイルを読み込む
dotenv.config();

// Expressアプリ作成
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());               // ← 2. ここで使う

// JSONを受け取れるようにする設定
app.use(express.json());

// ルート（テスト用）
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ===== ここから新しく追加 =====

// POSTリクエスト：/api/ask
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body; // クライアントから送られてきたプロンプトを取得

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // 使用するモデル
        messages: [{ role: 'user', content: prompt }] // 質問内容
      },
      {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Referer':'https://daichi-frontend-1.vercel.app/', // あなたのアプリケーションのURL
            'X-Title': 'Daichi Web Service', // 任意のアプリ名（適当に決めてOK）
        }
      }
    );

    // OpenAIからの返答をクライアントに返す
    res.json(response.data);
  } catch (error) {
    console.error('=== OpenAI API error ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error Message:', error.message);
      res.status(500).json({ error: error.message });
    }
  }  
});

// ===== ここまで追加 =====

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
