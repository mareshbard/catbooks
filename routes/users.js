var express = require("express");
var router = express.Router();
const User = require("../models/User"); // Certifique-se de que o caminho está correto
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Rota para registro de usuários
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    // Criar um novo usuário
    user = new User({ name, email, password });

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Salvar o usuário no banco de dados
    await user.save();

    // Gerar um token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

// Rota para login de usuários
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    // Gerar um token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

module.exports = router;
