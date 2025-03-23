import os

#Variable de entorno con la URL de rabbitMQ, por default será localhost
RABBIT_URL = os.getenv("RABBIT_URL", "localhost")