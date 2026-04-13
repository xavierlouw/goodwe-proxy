const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const GOODWE_BASE = 'https://hk-gateway.semsportal.com';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
  });

  app.post('/proxy', async (req, res) => {
    try {
        const { path, body, headers } = req.body;
            const url = `${GOODWE_BASE}${path}`;
                const response = await fetch(url, {
                      method: 'POST',
                            headers: {
                                    'Content-Type': 'application/json',
                                            ...headers
                                                  },
                                                        body: JSON.stringify(body)
                                                            });
                                                                const data = await response.json();
                                                                    res.json(data);
                                                                      } catch (err) {
                                                                          res.status(500).json({ error: err.message });
                                                                            }
                                                                            });

                                                                            const PORT = process.env.PORT || 3000;
                                                                            app.listen(PORT, () => {
                                                                              console.log(`GoodWe proxy running on port ${PORT}`);
                                                                              });
