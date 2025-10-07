const fs = require('fs');
const path = require('path');

// File to store bets
const DATA_FILE = path.join(__dirname, 'bets.json');

// Load existing data or initialize an empty array
let bets = [];
if (fs.existsSync(DATA_FILE)) {
  bets = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return all bets
    res.status(200).json(bets);
  } else if (req.method === 'POST') {
    // Add a new bet
    const { name, choice, amount } = req.body;
    if (!name || !choice || !amount) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const newBet = { name, choice, amount };
    bets.push(newBet);
    fs.writeFileSync(DATA_FILE, JSON.stringify(bets, null, 2));
    res.status(201).json(newBet);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}