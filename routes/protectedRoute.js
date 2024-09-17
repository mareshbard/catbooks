const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Rota protegida
router.get('/protected', auth, (req, res) => {
  res.send('Esta é uma rota protegida');
});

module.exports = router;
