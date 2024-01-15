//!importar librerias
const express = require("express");//? importar el servidor 
const session = require('express-session');//? importar ajustes para la sesion
// const cors = require("cors") //+ para trabajar con los cords
//!ajustes del servidor 
const app = express()
// app.use(cors()); //+ aplicar cord a express
app.use(express.json());//? para sopertar json
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
//! Colocar las rutas depsues del midelware para que funcione la sesion
app.use("/",require("./router/app"))

module.exports = app//? exporta las modulos