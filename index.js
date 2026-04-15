// v2 - with logging
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
          const timestamp = Date.now().toString();
          const sign = crypto.createHash('sha256')
            .update(appSecret + nonce + timestamp)
            .digest('hex');

      const url = `${GOODWE_BASE}${path}`;
          const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                            'Content-Type': 'application/json',
                            appKey,
                            nonce,
                            sign,
                            timestamp
                  },
                  body: JSON.stringify(body)
          });

      const text = await response.text();
          try {
                  res.json(JSON.parse(text));
          } catch (e) {
                  res.status(response.status).send(text);
          }
    } catch (err) {
          res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GoodWe proxy running on port ${PORT}`);
});
