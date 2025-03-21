import pika
from models import Message
from fastapi import APIRouter

router = APIRouter()

#Conexión a RabbitMQ
def getConnectionInfo():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    return connection, connection.channel()

#EndPoint Para publicar mensajes:
@router.post("/publishMessage")
async def publishMessage(message: Message):
    connection, channel = getConnectionInfo()
    channel.basic_publish(
        exchange = 'amq.' + message.exchange.lower(),
        routing_key = message.routing_key.lower(),
        body = message.model_dump_json())
    channel.close()
    connection.close()
    return message