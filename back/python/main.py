from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn
import pika

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

app.mount("/estaticos", StaticFiles(directory="../../front/frontend/estaticos"), name="static")
template = Jinja2Templates(directory="../../front/frontend")

class Message(BaseModel):
    autor: str
    fecha: str 
    routing_key: str
    exchange: str
    mensaje: str

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='deportes', durable=True)
channel.queue_declare(queue='entretenimiento', durable=True)
channel.queue_declare(queue='tecnologia', durable=True)

@app.get("/")
def root():
    return RedirectResponse(url="/publicador")

@app.get("/publicador")
def read_root(req: Request):
    return template.TemplateResponse(
        name="publisher.html",
        context={"request":req}
    )

@app.get("/suscriptor")
def read_root(req: Request):
    return template.TemplateResponse(
        name="subscriber.html",
        context={"request":req}
    )

@app.post("/publishMessage")
async def publishMessage(message: Message):
    return message


if __name__ == "__main__":
    uvicorn.run("main:app")