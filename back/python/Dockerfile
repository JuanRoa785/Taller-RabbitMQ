FROM python:3.10.16-slim

# Actualiza e instala bash y nano
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#Generamos la variable de entorno de la URL de RabbitMQ
ENV RABBIT_URL=taller_rabbitmq

#Definimos el directorio de la aplicaciøn
WORKDIR /home/python

#Copiamos e Instalamos las dependencias necesarias para correr el back
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copiamos el codigo fuente del backend
COPY . .

#Exponemos el puerto
EXPOSE 8000

#Se ejecutará por default el main.py
ENTRYPOINT ["python3", "main.py"]