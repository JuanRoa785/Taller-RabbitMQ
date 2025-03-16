//Event Listener para la redirección
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vistaSuscriptor").addEventListener("click", function () {
        window.location.href = "/suscriptor";
    });
});

console.log(window.API_URL);

//Clase para almacenar los mensajes publicados:
let Mensaje = class {
    constructor(fecha, tema, redireccionamiento, mensaje){
        this.fecha = fecha;
        this.tema = tema;
        this.redireccionamiento = redireccionamiento;
        this.mensaje = mensaje;
    }
}

//Devuelve la fecha actual en formato UTC teniendo en cuenta la zona horaria
function UTCZonaHoraria(zona="America/Bogota") {
    let fecha = new Date();

    return fecha.toLocaleString("es-GB", {
        timeZone: zona,
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    });
}

let mensajePorDefecto = new Mensaje(UTCZonaHoraria(), "N.A", "N.A", "N.A");

//Arreglo que carga los mensajes guardados en el localStorage
let mensajesGuardados = localStorage.getItem("mensajesPublicados");
if (mensajesGuardados) {
    mensajesPublicados = JSON.parse(mensajesGuardados);
} else {
    mensajesPublicados = [mensajePorDefecto];
}

// Contenedor donde se mostrarán los mensajes
let contenedorMensajes = document.querySelector(".contenedorMensajes");

function mostrarMensaje(mensaje){
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
    //Agrega el mensaje como el primer hijo del contenedor:
    contenedorMensajes.prepend(divMensaje); 
}

if (mensajesPublicados.length != 1) {
    //Eliminar el mensaje por default para que no se muestre en pantalla
    mensajesPublicados = mensajesPublicados.filter((i) => i.tema !== "N.A");
}

//Muestra los mensajes en su respectivo contenedor
mensajesPublicados.forEach(mensaje => {
    mostrarMensaje(mensaje);
});

//Event Listener para publicar los mensajes:
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("publicarMensaje").addEventListener("click", function () {
        let nuevoMensaje = new Mensaje(
            UTCZonaHoraria(), 
            document.getElementById("selectTema").value, 
            document.getElementById("selectRedirect").value, 
            document.getElementById("areaMensaje").value
        );

        //Se envia a rabbitMQ, si es exitoso:
        if (mensajesPublicados.length == 1) {
            contenedorMensajes.removeChild(contenedorMensajes.firstElementChild);
        }
        mensajesPublicados.push(nuevoMensaje);
        localStorage.setItem("mensajesPublicados", JSON.stringify(mensajesPublicados));
        mostrarMensaje(nuevoMensaje);
        reiniciarFormulario();
    });
});

function reiniciarFormulario() {
    document.getElementById("selectTema").value = "Tema 1";
    document.getElementById("selectRedirect").value = "Opcion 1";
    document.getElementById("areaMensaje").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reiniciarMensajes").addEventListener("click", function () {
        localStorage.removeItem("mensajesPublicados");
        window.location.reload();
    });
});