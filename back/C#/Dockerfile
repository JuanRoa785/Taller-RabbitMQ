# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de proyecto y restaurar dependencias
COPY *.csproj ./
RUN dotnet restore

# Copiar el resto del código
COPY . ./

# Publicar la aplicación en modo release
RUN dotnet publish -c Release -o out

#-------------------------------------------------------

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Establecer directorio de trabajo
WORKDIR /app

# Copiar desde la etapa de build
COPY --from=build /app/out ./

# Exponer el puerto (ajusta según tu app)
EXPOSE 5040

# Variable de entorno opcional para RabbitMQ (puede sobreescribirse)
ENV RABBIT_URL=taller_rabbitmq

# Comando para ejecutar la app
ENTRYPOINT ["dotnet", "C#.dll"]
