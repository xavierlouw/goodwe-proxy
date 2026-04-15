// v3 - correct Token header format
const express = require('express');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const GOODWE_BASE = 'https://hk-gateway.semsportal.com';

app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
});

app.post('/proxy', async (req, res) => {
      try {
              const { path, body, appKey, appSecret } = req.body;

        const nonce = Math.floor(10000 + Math.random() * 89999).toString();
              const timestamp = Math.floor(Date.now() / 1000).toString();
              const sign = crypto.createHash('sha256')
                .update(appSecret + nonce + timestamp)
                .digest('hex');

        const token = JSON.stringify({ appKey, nonce, timestamp, sign });

        const url = `${GOODWE_BASE}${path}`;

        console.log('>>> PROXY REQUEST url:', url);
              console.log('>>> PROXY REQUEST body:', JSON.stringify(body));
              console.log('>>> PROXY TOKEN:', token);

        const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                              'Content-Type': 'application/json',
                              'Token': token
                  },
                  body: JSON.stringify(body)
        });

        const text = await response.text();
              console.log('<<< GOODWE STATUS:', response.status);
              console.log('<<< GOODWE BODY:', text.substring(0, 500));

        try {
                  res.json(JSON.parse(text));
        } catch (e) {
                  res.status(response.status).send(text);
        }
      } catch (err) {
              console.error('PROXY ERROR:', err.message);
              res.status(500).json({ error: err.message });
      }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`GoodWe proxy running on port ${PORT}`);
});
