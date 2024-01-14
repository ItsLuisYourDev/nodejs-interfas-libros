const express = require("express");
const session = require('express-session');
// const cors = require("cors")
// const sqlite3 = require('sqlite3');
const app = express()
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set("port", 3000)
app.use(express.static("./public"))
// Configurar express-session
app.use(
  session({
    secret: 'miSecreto', // Cambia esto con una clave segura
    resave: false,
    saveUninitialized: true,
  })
);
module.exports = app
