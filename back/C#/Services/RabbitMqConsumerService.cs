using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

public class RabbitMqConsumerServiceAsync
{
    private IConnection connection;
    private IChannel channel;
    private string queueName;

    // Método de inicialización async que se llama manualmente en Program.cs
    public async Task InitializeAsync()
    {
        //Consumir de la variable de entorno
        var RABBIT_URL = Environment.GetEnvironmentVariable("RABBIT_URL") ?? "localhost";
        
        var factory = new ConnectionFactory { HostName = RABBIT_URL };
        connection = await factory.CreateConnectionAsync();
        channel = await connection.CreateChannelAsync();

        var result = await channel.QueueDeclareAsync(queue: "", durable: false, exclusive: true, autoDelete: true);
        queueName = result.QueueName;

        await channel.QueueBindAsync(queue: queueName, exchange: "amq.fanout", routingKey: "");
    }

    public async Task UpdateBindingsAsync(string[] temasSuscritos)
    {
        string[] aux = { "Deportes", "Entretenimiento", "Tecnologia" };
        foreach (string tema in aux)
        {
            if (!temasSuscritos.Contains(tema, StringComparer.OrdinalIgnoreCase))
            {
                await channel.QueueUnbindAsync(queue: queueName, exchange: "amq.direct", routingKey: tema.ToLower());
                await channel.QueueUnbindAsync(queue: queueName, exchange: "amq.topic", routingKey: tema.ToLower());
            }
            else
            {
                await channel.QueueBindAsync(queue: queueName, exchange: "amq.direct", routingKey: tema.ToLower());
                await channel.QueueBindAsync(queue: queueName, exchange: "amq.topic", routingKey: tema.ToLower());
            }
        }
    }

    public async Task<List<Message>> GetMessagesAsync()
    {
        List<Message> mensajes = new();
        BasicGetResult result;

        do
        {
            result = await channel.BasicGetAsync(queueName, autoAck: true);
            if (result != null)
            {
                byte[] body = result.Body.ToArray();
                string jsonString = Encoding.UTF8.GetString(body);

                try
                {
                    Message? mensaje = JsonSerializer.Deserialize<Message>(jsonString);
                    if (mensaje != null)
                    {
                        mensajes.Add(mensaje);
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error al deserializar: {ex.Message}");
                }
            }
        } while (result != null);

        return mensajes;
    }
}
