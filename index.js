const app = require("./app.js")
const axios = require('axios');
const servidor = "http://127.0.0.1"
const port = "3000"
const apiLoggin = 'http://127.0.0.1:3001'
// const apiLoggin = 'http://192.168.0.104:3001'
const apiBook = 'http://127.0.0.1:3002'
// const apiBook = 'http://192.168.0.105:3002'
const axiosConfig = {
  timeout: 1000, // Tiempo límite en milisegundos (ajústalo según tus necesidades)
};

//! Endpoint para la página principal
app.get('/', (req, res) => {
  if (req.session.usuario) {
    const usuario = req.session.usuario;
    const id = req.session.usuario.id;
    const api = `${apiLoggin}/db/book/${id}`;
    axios.get(api)
      .then(response => {
        const api = `${apiBook}/db/filter`;
        axios.post(api, { libros: response.data }, axiosConfig)
          .then(response => {
            const datos = {
              user: usuario.user,
              libros: response.data,
            }
            res.render('index.ejs', datos)
          })
          .catch(error => {
            console.log("El servidor no responde", error.message)
            const datos = {
              user: usuario.user,
              libros: [],
            };
            res.render('index.ejs', datos);
          });
      })
      .catch(error => {
        console.error('Error en la solicitud:', error.message);
      });
  } else {
    //!redirige en caso de no iniciar seccion
    renderLoginForm(res)
  }
});

function renderLoginForm(res) {
  res.render('login.ejs');
}

function redirectToHome(res) {
  res.redirect("/");
}
function httpPost(url, datosJson) {
  axios.post(url, datosJson, axiosConfig)
    .then(response => {
      const respons = {
        success: true,
        datos: response.data
      }
      return respons;
    })
    .catch(error => {
      console.log("El servidor no responde:", error.message)
      const respons = {
        success: true,
        datos: []
      }
      return respons;
    });
}

// ! inicia el servidor
app.listen(app.get("port"), () => {
  console.log(`server on port ${servidor}:${port}`)
})  