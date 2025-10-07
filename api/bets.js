const fs = require('fs');
const path = require('path');

// File to store bets
const DATA_FILE = path.resolve('./bets.json');

// Load existing data or initialize an empty array
let bets = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    bets = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load bets:', err);
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return all bets
    res.status(200).json(bets);
  } else if (req.method === 'POST') {
    let body;
    try {
      body = JSON.parse(req.body); // Ensure the request body is parsed
    } catch (err) {
      console.error('Failed to parse JSON body:', err);
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    const { name, choice, amount } = body;
    if (!name || !choice || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid data:', body);
      return res.status(400).json({ error: 'Invalid data' });
    }

    const newBet = { name, choice, amount };
    bets.push(newBet);

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(bets, null, 2));
    } catch (err) {
      console.error('Failed to write to file:', err);
      return res.status(500).json({ error: 'Failed to save bet' });
    }

    res.status(201).json(newBet);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}