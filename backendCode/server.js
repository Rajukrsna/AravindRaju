const express = require('express');
const bodyParser = require('body-parser');
const Convex = require('@convex-dev/convex');
const convex = new Convex({
  url: 'YOUR_CONVEX_BACKEND_URL',
});

const app = express();
app.use(bodyParser.json());
app.post('/register', async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    await convex.query('users').insert({ name, email, phoneNumber });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const user = await convex.query('users').findOne({ email });
    if (!user || user.phoneNumber !== phoneNumber) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
