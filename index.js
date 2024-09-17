require("dotenv").config(); // Carregar variáveis de ambiente

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const port = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

// Configurar view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configurar middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configurar rotas
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/sobre", require("./routes/sobre"));
app.use("/start", require("./routes/start"));
app.use("/detalhes", require("./routes/detalhes"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



console.log('Estado da conexão:', mongoose.connection.readyState);


const start = Date.now();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado ao MongoDB");
    console.log(`Tempo de conexão: ${Date.now() - start}ms`);
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB", err);
  });

module.exports = app;
