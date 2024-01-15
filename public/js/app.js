const apiServer='http://127.0.0.1:3000'
// const apiServer='http://192.168.0.103:3000'
function enviarFormulario() {
    //! optener el usuario y contrasenia de el formulario html
    const user = document.getElementById('usuario');
    const pass = document.getElementById('contrasena');
    const datos = { user: user.value, pass: pass.value }

    //! ruta de la api de google
    const api = `${apiServer}/login`
    //!peticion reques de los datos mediante POST
    fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                console.log("error del servidor")
                alert("Error en el servidor")
            } else {
                console.log('Respuesta del servidor:', data);
                //! redirigie si es correcto
                window.location.href = '/';
            }
        })
        .catch(error => {
            //! error en la consulta de la api
            console.error('Error en la solicitud:', error);
        });
}

function view(user, book) {
    // Realizar la solicitud con fetch
    const id = book
    window.location.href = `/view?v=${id}`;
}
function register() {
    console.log("ehh")
    //! optener el usuario y contrasenia de el formulario html
    const user = document.getElementById('usuario');
    const pass = document.getElementById('contrasena');
    const datos = { user: user.value, pass: pass.value }
    const api = `${apiServer}/register`
    //!peticion reques de los datos mediante POST
    fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.exists === true) {
                alert("Usuario Existente")
            } else {
                alert("Usuario Registrado")
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
function buy(user, producto) {
    //! ruta de la api de google
    const api = `${apiServer}/store`
    const buy = {
        userId: user,
        bookId: producto
    }
    //!peticion reques de los datos mediante POST
    fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(buy),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if(data.exists===false){
                alert("Libro ya comprado")
            }else{
                alert("Compra exitosa")
            }
            //! redirigie si es correcto
            // window.location.href = '/';
        })
        .catch(error => {
            //! error en la consulta de la api
            console.error('Error en la solicitud:', error);
        });

}