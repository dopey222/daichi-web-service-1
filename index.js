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

// CORS設定を強化
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSONを受け取れるようにする設定
app.use(express.json());

// ルート（テスト用）
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// POSTリクエスト：/api/ask
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Referer': 'https://daichi-frontend-1.vercel.app/',
          'X-Title': 'Daichi Web Service',
        }
      }
    );

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

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});