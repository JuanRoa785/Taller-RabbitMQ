from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from consumer import router as consumer_router
from publisher import router as publisher_router
import uvicorn


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Incluir routers -> Acceso a los endpoints de consumer y publisher
app.include_router(consumer_router, prefix="/consumer")
app.include_router(publisher_router, prefix="/publisher")

#EndPoint Para consumir mensajes:

if __name__ == "__main__":
    uvicorn.run("main:app")