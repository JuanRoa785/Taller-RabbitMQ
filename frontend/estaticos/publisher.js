//Event Listener para la redirección
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vistaSuscriptor").addEventListener("click", function () {
        window.location.href = "/suscriptor";
    });
});

//Clase para almacenar los mensajes publicados:
let Mensaje = class {
    constructor(fecha, tema, redireccionamiento, mensaje){
        this.fecha = fecha;
        this.tema = tema;
        this.redireccionamiento = redireccionamiento;
        this.mensaje = mensaje;
    }
}

let mensajePorDefecto = new Mensaje(new Date().toUTCString(), "N.A", "N.A", "N.A");

//Arreglo que contendrá los ultimos mensajes publicados:
mensajesPublicados = [mensajePorDefecto]

// Contenedor donde se agregarán los mensajes
let contenedorMensajes = document.querySelector(".contenedorMensajes");

function agregarMensaje(mensaje){
    let divMensaje = document.createElement("div");
    divMensaje.classList.add("mensajePublicado");

    divMensaje.innerHTML = `
        <p class="col">Fecha: ${mensaje.fecha}</p>
        <div class="row">
            <p class="col">Tema: ${mensaje.tema}</p>
            <p class="col">Redireccionamiento: ${mensaje.redireccionamiento}</p>
        </div>

        <p>Mensaje:</p>
        <textarea readonly class="form-control" rows="2" >${mensaje.mensaje}</textarea>
    `;
    contenedorMensajes.appendChild(divMensaje); 
}

mensajesPublicados.forEach(mensaje => {
    agregarMensaje(mensaje)
});

//Event Listener para publicar los mensajes:
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("publicarMensaje").addEventListener("click", function () {
        let nuevoMensaje = new Mensaje(
            new Date().toUTCString(), 
            document.getElementById("selectTema").value, 
            document.getElementById("selectRedirect").value, 
            document.getElementById("areaMensaje").value
        )
        
        //console.log(nuevoMensaje)

        //Se envia a rabbitMQ, si es exitoso:
        if (mensajesPublicados.length == 1) {
            contenedorMensajes.removeChild(contenedorMensajes.firstElementChild);
        }
        mensajesPublicados.push(nuevoMensaje)
        agregarMensaje(nuevoMensaje)
        reiniciarFormulario()
    });
});

function reiniciarFormulario() {
    document.getElementById("selectTema").value = "Tema 1"
    document.getElementById("selectRedirect").value = "Opcion 1"
    document.getElementById("areaMensaje").value = ""
}