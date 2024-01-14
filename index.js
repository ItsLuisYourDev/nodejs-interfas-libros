const app = require("./app.js")
const axios = require('axios');
const servidor = "http://127.0.0.1"
const port = "3000"
// const apiLoggin = 'http://127.0.0.1:3001'
const apiLoggin = 'http://192.168.0.104:3001'
// const apiBook = 'http://127.0.0.1:3002'
const apiBook = 'http://192.168.0.105:3002'
const axiosConfig = {
  timeout: 1000, // Tiempo límite en milisegundos (ajústalo según tus necesidades)
};

//! Ruta para mostrar el formulario de inicio de sesión
app.post('/register', (req, res) => {
  console.log("entro al registro")
  const { user, pass } = req.body;
  const api = `${apiLoggin}/db`
  axios.post(api, { user: user, pass: pass })
    .then(response => {
      //! valida la seccion
      console.log(response.data)
      if (response.data.exists === true) {
        console.log("el usuario existe")
        res.json({ exists: true })
      } else {
        res.json({ success: true })
      }
    })
    .catch(error => {
      console.error(error);
    });


})
app.get('/login', (req, res) => {

  if (!req.session.usuario) {
    res.render('login.ejs');

  } else {
    res.redirect("/");
  }
});
app.get('/salir', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar la sesión:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.redirect("/");
    }
  });
});

//! Endpoint para el formulario de inicio de sesións
app.post('/login', (req, res) => {
  //! optencion de los datos del cliente
  const { user, pass } = req.body;
  //! Realizar una solicitud POST
  const api = `${apiLoggin}/db/login`
  axios.post(api, { user: user, pass: pass },axiosConfig)
    .then(response => {
      //! valida la seccion
      if (response.data.success === true) {
        //! guarda el usuario
        const usuario = {
          user: user,
          id: response.data.datos.id,
          libros: response.data.datos.libros
        };
        //! Almacenar el usuario en la sesión
        req.session.usuario = usuario;
        res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
      }
    })
    .catch(error => {
      // console.error(error);
      res.json({ success: false })
      console.log("Error de Conexion con el servido")
    });

});

//! Endpoint para la página principal
app.get('/', (req, res) => {
  console.log("entro")
  // Verificar si el usuario está autenticado
  if (req.session.usuario) {
    const usuario = req.session.usuario;
    const apiMiBook = `${apiBook}/db/filter`
    const api = `${apiLoggin}/db/book/${req.session.usuario.id}`
    axios.get(api)
      .then(response => {
        // Maneja la respuesta exitosa
        axios.post(apiMiBook, { libros: response.data },axiosConfig)
          .then(response => {
            const datos = {
              user: usuario.user,
              libros: response.data,
            }
            res.render('index.ejs', datos)
          })
          .catch(error => {
            console.log("El servidor no responde")
            // console.error(error);
            // Renderiza el index.ejs incluso si la API de guardar libros falla
            const datos = {
              user: usuario.user,
              libros: [],
            };
            res.render('index.ejs', datos);
          });
      })
      .catch(error => {
        // Maneja el error en la solicitud
        console.error('Error en la solicitud:', error.message);
      });
  } else {
    //!redirige en caso de no iniciar seccion
    res.redirect('/login')
  }
});

app.get("/store", (req, res) => {
  if (req.session.usuario) {
    // Realiza la solicitud GET utilizando Axios
    const usuario = req.session.usuario;
    const api = `${apiBook}/db`
    axios.get(api,axiosConfig)
      .then(response => {
        // Maneja la respuesta exitosa
        const data = {
          libros: response.data,
          usuario: usuario.id,
          user: usuario.user
        };
        res.render("store/index.ejs", data)
      })
      .catch(error => {
        // Maneja el error en la solicitud
        console.error('Error en la solicitud:', error.message);
        const data = {
          libros: [],
          usuario: usuario.id,
          user: usuario.user
        };
        res.render("store/index.ejs", data)
      });
  } else {
    res.redirect('/login')
  }
})

app.post("/store", (req, res) => {
  const { userId, bookId } = req.body
  const api = `${apiLoggin}/db/addBook/${userId}`
  axios.put(api, { userId: userId, book: bookId })
    .then(response => {
      if (response.data.success === true) {
        res.json({ exists: true })
      } {
        res.json({ exists: false })
        console.log("El libro existia")
      }
    })
    .catch(error => {
      console.error(error);
    });
})

app.get("/view", (req, res) => {
  if (req.session.usuario) {
    const usuario = req.session.usuario;
    const id = req.query.v
    // const apiViewText = `http://127.0.0.1:3002/db/view/${id}`
    const api = `${apiBook}/db/view/${id}`
    axios.get(api)
      .then(response => {
        // Maneja la respuesta exitosa
        res.render("view.ejs", { data: response.data, user: usuario.user })
      })
      .catch(error => {
        // Maneja el error en la solicitud
        console.error('Error en la solicitud:', error.message);
      });
  } else {
    res.redirect("/login")
  }
})

// ! inicia el servidor
app.listen(app.get("port"), () => {
  console.log(`server on port ${servidor}:${port}`)
})  