
public static class Consumer
{
    public static void ConsumerEndpoints(this WebApplication app)
    {
        app.MapPost("consumer/getMessages", async (RabbitMqConsumerServiceAsync rabbitService, string[] temasSuscritos) =>
        {
            await rabbitService.UpdateBindingsAsync(temasSuscritos);
            var mensajes = await rabbitService.GetMessagesAsync();
            return Results.Json(new { mensajes });
        });
    }
}