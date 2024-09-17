var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("cadastro", { title: "Express" });
});

router.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;
    const db = req.db;

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) throw err;

        const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, hash], (err, result) => {
            if (err) {
                console.error(err);
                res.send('Erro ao cadastrar!');
            } else {
                res.send('Cadastro realizado com sucesso!');
            }
        });
    });
});

module.exports = router;
