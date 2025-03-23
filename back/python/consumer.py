import pika
from env import RABBIT_URL
from fastapi import APIRouter
from fastapi import Body
from typing import List
import json

router = APIRouter()

#Conexion a RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_URL))
channel = connection.channel()

#Creación de cola temporal especifica para cada cliente
result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

#Se especifica el binding de fanout para que siempre funcione sin importar qué
channel.queue_bind(exchange='amq.fanout', queue=queue_name)

def updateBindings(temas_suscritos):
    aux = ['Deportes', 'Entretenimiento', 'Tecnologia']
    for tema in aux:
        if tema not in temas_suscritos:
            #Eliminamos los bindings
            channel.queue_unbind(exchange='amq.direct', queue=queue_name, routing_key=tema.lower())
            channel.queue_unbind(exchange='amq.topic', queue=queue_name, routing_key=tema.lower())
        else:
            #Creamos los bindings
            channel.queue_bind(exchange='amq.direct', queue=queue_name, routing_key=tema.lower())
            channel.queue_bind(exchange='amq.topic', queue=queue_name, routing_key=tema.lower())

@router.post("/getMessages")
async def getMessages(temas_suscritos: List[str] = Body(...)):
   updateBindings(temas_suscritos) 
   
   mensajes = []

   while True:
    method_frame, header_frame, body = channel.basic_get(queue=queue_name, auto_ack=True)
    if method_frame:
        body_str = body.decode("utf-8")
        mensaje = json.loads(body_str)
        mensajes.append(mensaje)
    else:
        break  # No hay más mensajes en la cola

    return {"mensajes": mensajes}