using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo {Title = "Backend C# API", Description="Documentation for the Backend with C#", Version="v1"});
});

builder.Services.AddSingleton<RabbitMqConsumerServiceAsync>();

var app = builder.Build();
app.UseCors("AllowAll");

var rabbitService = app.Services.GetRequiredService<RabbitMqConsumerServiceAsync>();
await rabbitService.InitializeAsync();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(
        c => {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend C# API V1");
        }
    );
}

app.PublisherEndpoints();
app.ConsumerEndpoints();

app.Run();
