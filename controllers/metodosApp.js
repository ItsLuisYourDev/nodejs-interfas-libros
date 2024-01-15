const metodosApp = {}
const apiLoggin = 'http://127.0.0.1:3001'
// const apiLoggin = 'http://192.168.0.104:3001'
const apiBook = 'http://127.0.0.1:3002'
// const apiBook = 'http://192.168.0.105:3002'
const axios = require('axios');
const axiosConfig = {
    timeout: 1000, // Tiempo límite en milisegundos (ajústalo según tus necesidades)
};

//! Formulario loggin
metodosApp.formLoggin = (req, res) => {
    if (!req.session.usuario) {
        res.render('login.ejs');
    } else {
        res.redirect("/");
    }
};

//! Endpoint para el formulario de inicio de sesións
metodosApp.validateLoggin = (req, res) => {
    console.log("entro a loggin")
    const { user, pass } = req.body;
    const api = `${apiLoggin}/db/login`
    axios.post(api, { user: user, pass: pass }, axiosConfig)
        .then(response => {
            if (response.data.success === true) {
                const usuario = {
                    user: user,
                    id: response.data.datos.id,
                    libros: response.data.datos.libros
                };
                req.session.usuario = usuario;
                res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
            }
        })
        .catch(error => {
            res.json({ success: false })
            console.log("Error de Conexion con el servido")
        });
};

//! metodo para cerrar sesion
metodosApp.salir = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect("/");
        }
    });
};

//! Ruta para mostrar el formulario de inicio de sesión
metodosApp.register = (req, res) => {
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
};

//! mostrar los libros
metodosApp.getStore = (req, res) => {
    if (req.session.usuario) {
        const usuario = req.session.usuario;
        const api = `${apiBook}/db`
        axios.get(api, axiosConfig)
            .then(response => {
                const data = {
                    libros: response.data,
                    usuario: usuario.id,
                    user: usuario.user
                };
                res.render("store/index.ejs", data)
            })
            .catch(error => {
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
}
//! adquirir los libros
metodosApp.postStore = (req, res) => {
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
}

//! leer un libro
metodosApp.view = (req, res) => {
    if (req.session.usuario) {
        const usuario = req.session.usuario;
        const id = req.query.v
        const api = `${apiBook}/db/view/${id}`
        axios.get(api)
            .then(response => {
                res.render("view.ejs", { data: response.data, user: usuario.user })
            })
            .catch(error => {
                console.error('Error en la solicitud:', error.message);
            });
    } else {
        res.redirect("/login")
    }
}

module.exports = metodosApp;
