from pydantic import BaseModel

class Message(BaseModel):
    autor: str
    fecha: str 
    routing_key: str
    exchange: str
    mensaje: str