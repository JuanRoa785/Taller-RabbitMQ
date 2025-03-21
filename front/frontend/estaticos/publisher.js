//Event Listener para la redirección
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vistaSuscriptor").addEventListener("click", function () {
        window.location.href = "/suscriptor";
    });
});

//Verificando que las variables de entorno funcionen
//console.log(window.API_URL);
//console.log(window.PUBLISHER);

//Clase para almacenar los mensajes publicados:
let Mensaje = class {
    constructor(autor = window.PUBLISHER, fecha, routing_key, exchange, mensaje){
        this.autor = autor
        this.fecha = fecha;
        this.routing_key = routing_key;
        this.exchange = exchange;
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

let mensajePorDefecto = new Mensaje(window.PUBLISHER, UTCZonaHoraria(), "N.A", "N.A", "N.A");

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
        <p class="col">Date: ${mensaje.fecha}</p>
        <div class="row">
            <p class="col">Routing Key: ${mensaje.routing_key}</p>
            <p class="col">Exchange Type: ${mensaje.exchange}</p>
        </div>

        <p>Message:</p>
        <textarea readonly class="form-control" rows="2" >${mensaje.mensaje}</textarea>
    `;
    //Agrega el mensaje como el primer hijo del contenedor:
    contenedorMensajes.prepend(divMensaje); 
}

if (mensajesPublicados.length != 1) {
    //Eliminar el mensaje por default para que no se muestre en pantalla
    mensajesPublicados = mensajesPublicados.filter((i) => i.exchange !== "N.A");
}

//Muestra los mensajes en su respectivo contenedor
mensajesPublicados.forEach(mensaje => {
    mostrarMensaje(mensaje);
});

//Función para enviar el mensaje consumiendo la API
async function mensajeEnviado(nuevoMensaje) {
    try {
        const respuesta = await fetch("http://" + window.API_URL + "/publisher/publishMessage", {
            method: "POST",
            body: JSON.stringify(nuevoMensaje),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert("Error al enviar mensaje:\n\n " + JSON.stringify(errorData, null, 2));
            return false
        }

        return true;

    } catch (error) {
        alert("Error al enviar mensaje: " + error.message);
        return false;
    }
}


//Event Listener para publicar los mensajes:
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("publicarMensaje").addEventListener("click", async function () {
        let nuevoMensaje = new Mensaje(
            window.PUBLISHER,
            UTCZonaHoraria(), 
            document.getElementById("selectRK").value, 
            document.getElementById("selectExchange").value, 
            document.getElementById("areaMensaje").value
        );

        const envioExitoso = await mensajeEnviado(nuevoMensaje);
        if (!envioExitoso) {
            return;
        }

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
    document.getElementById("selectRK").value = "Deportes";
    document.getElementById("selectExchange").value = "Fanout";
    document.getElementById("areaMensaje").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reiniciarMensajes").addEventListener("click", function () {
        localStorage.removeItem("mensajesPublicados");
        window.location.reload();
    });
});