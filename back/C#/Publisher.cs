using System.Text;
using System.Text.Json;
using RabbitMQ.Client;

public static class Publisher {
    public static void PublisherEndpoints(this WebApplication app){

        app.MapPost("publisher/publishMessage", async (Message mensaje) => {
            //Conexion a RabbitMQ

            //Consumir de la variable de entorno
            var RABBIT_URL = Environment.GetEnvironmentVariable("RABBIT_URL") ?? "localhost";
            
            var factory = new ConnectionFactory { HostName = RABBIT_URL };
            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            //Convertir el mensaje en bytes
            string mensajeAsString = JsonSerializer.Serialize(mensaje);
            byte[] mensajeAsBytes = Encoding.UTF8.GetBytes(mensajeAsString);

            //Publicar el mensaje
            await channel.BasicPublishAsync(
                exchange: "amq."+ mensaje.exchange.ToLower(), 
                routingKey: mensaje.routing_key.ToLower(), 
                body: mensajeAsBytes
            );

            //Cerrar la conexión
            await channel.CloseAsync();
            await connection.CloseAsync();
        });
    }   
}