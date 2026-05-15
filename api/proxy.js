// api/proxy.js
export default async function handler(req, res) {
  // Set CORS headers (opsional, karena frontend dan API satu domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ganti dengan URL Google Apps Script Anda
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbx9dIBo8LWYGGI1hmlaIvuEUegfXKpW9nNHcMaaiS5BEGhTT0jFOUQ94tnu-xfmuhfNHQ/exec';

  try {
    if (req.method === 'GET') {
      // Untuk mengambil data: forward dengan action dari query
      const { action } = req.query;
      if (!action) {
        return res.status(400).json({ error: 'Missing action parameter' });
      }
      const gasResponse = await fetch(`${GAS_URL}?action=${action}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await gasResponse.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Untuk menyimpan data: forward body ke GAS (doPost)
      const gasResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      const data = await gasResponse.json();
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
