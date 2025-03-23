document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("vistaPublicador").addEventListener("click", function () {
        window.location.href = "/publicador";
    });
});

//Mostrar los temas desde un arreglo:
document.addEventListener("DOMContentLoaded", function () {
    // Lista de temas
    const temas = ["Deportes", "Entretenimiento", "Tecnologia"];
    
    const contenedorTemas = document.getElementById("contenedorTemas");

    // Creamos dos filas (de 3 temas cada una)
    for (let i = 0; i < temas.length; i += 3) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.style.width = "90%";
        row.style.margin = "0 auto";

        // Generar 3 columnas por fila
        for (let j = i; j < i + 3 && j < temas.length; j++) {
            const col = document.createElement("div");
            col.classList.add("form-check", "col", "d-flex", "justify-content-center");

            // Crear input checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("form-check-input");
            checkbox.id = `${temas[j]}`;
            checkbox.name = `temas`;
            checkbox.value = `${temas[j]}`;

            // Crear label
            const label = document.createElement("label");
            label.classList.add("form-check-label");
            label.htmlFor = checkbox.id;
            label.textContent = temas[j];

            // Añadir al contenedor de columna
            col.appendChild(checkbox);
            col.appendChild(label);

            // Añadir la columna a la fila
            row.appendChild(col);
        }

        // Añadir la fila al contenedor principal
        contenedorTemas.appendChild(row);
    }
});

let temasSuscritos = [];

function actualizarTemasSuscritos() {
    temasSuscritos = []; //vacía el arreglo siempre

    // Selecciona todos los checkboxes dentro del contenedor
    const checkboxes = document.querySelectorAll("#contenedorTemas input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const tema = checkbox.value.toString() ; 
            if (tema) {
                temasSuscritos.push(tema.trim());
            }
        }
    });

    //console.log("Temas suscritos:", temasSuscritos);
}

//Añadimos el event listener a cada uno de los checkboxes delos temas
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("#contenedorTemas input[type='checkbox']");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", actualizarTemasSuscritos);
    });
});

//Clase para almacenar los mensajes recibidos:
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
        hour12: false
    });
}

let mensajePorDefecto = new Mensaje("N.A", UTCZonaHoraria(), "N.A", "N.A", "N.A");

//Arreglo que carga los mensajes guardados en el localStorage
let mensajesGuardados = localStorage.getItem("mensajesRecibidos");
if (mensajesGuardados) {
    mensajesRecibidos = JSON.parse(mensajesGuardados);
} else {
    mensajesRecibidos = [mensajePorDefecto];
}

// Contenedor donde se mostrarán los mensajes
let contenedorMensajes = document.querySelector(".contenedorMensajes");

function mostrarMensaje(mensaje){
    let divMensaje = document.createElement("div");
    divMensaje.classList.add("mensajePublicado");

    divMensaje.innerHTML = `
        
        <div class="row">
            <p class="col">Publisher: ${mensaje.autor}</p>
            <p class="col">Date: ${mensaje.fecha}</p>
        </div>
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

if (mensajesRecibidos.length != 1) {
    //Eliminar el mensaje por default para que no se muestre en pantalla
    mensajesRecibidos = mensajesRecibidos.filter((i) => i.exchange !== "N.A");
}

//Muestra los mensajes en su respectivo contenedor
mensajesRecibidos.forEach(mensaje => {
    mostrarMensaje(mensaje);
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reiniciarMensajes").addEventListener("click", function () {
        localStorage.removeItem("mensajesRecibidos");
        window.location.reload();
    });
});

//Se llamará cada dos segundos la función consumirMensajes
const intervalID = setInterval(consumirMensajes, 3000); 

//Función para recibir y mostrar los nuevos mensajes de rabbitMQ
async function consumirMensajes() {
    try {
        const respuesta = await fetch("http://" + window.API_URL + "/consumer/getMessages", {
            method: "POST",
            body: JSON.stringify(temasSuscritos),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        })

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert("Error al consumir mensajes:\n\n " + JSON.stringify(errorData, null, 2));
            return false
        }

        const data = await respuesta.json(); 
        if (data != null){
            //console.log("Mensajes recibidos:", data.mensajes);
            data.mensajes.forEach(mensaje => {

                let nuevoMensaje = new Mensaje(
                    mensaje.autor,
                    mensaje.fecha, 
                    mensaje.routing_key, 
                    mensaje.exchange, 
                    mensaje.mensaje
                );

                if (mensajesRecibidos.length == 1) {
                    contenedorMensajes.removeChild(contenedorMensajes.firstElementChild);
                }
                mensajesRecibidos.push(nuevoMensaje);
                localStorage.setItem("mensajesRecibidos", JSON.stringify(mensajesRecibidos));
                mostrarMensaje(nuevoMensaje);
            });
        }
        return true;

    } catch (error) {
        alert("Error al consumir mensajes: " + error.message);
        return false;
    }
}