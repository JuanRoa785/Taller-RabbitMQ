import pika
from fastapi import APIRouter, Request
import json

router = APIRouter()

#Conexion a RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

#Creación de cola temporal especifica para cada cliente
result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

def updateBindings(temas_suscritos):
    aux = ['Deportes', 'Entretenimiento', 'Tecnologia']
    for tema in aux:
        if tema not in temas_suscritos:
            #Eliminamos los bindings
            channel.queue_unbind(exchange='amq.fanout', queue=queue_name, routing_key=tema.lower())
            channel.queue_unbind(exchange='amq.direct', queue=queue_name, routing_key=tema.lower())
            channel.queue_unbind(exchange='amq.topic', queue=queue_name, routing_key=tema.lower())
        else:
            #Creamos los bindings
            channel.queue_unbind(exchange='amq.fanout', queue=queue_name, routing_key=tema.lower())
            channel.queue_bind(exchange='amq.direct', queue=queue_name, routing_key=tema.lower())
            channel.queue_bind(exchange='amq.topic', queue=queue_name, routing_key=tema.lower())

@router.post("/getMessages")
async def getMessages(request: Request):
   temas_suscritos = await request.json()
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