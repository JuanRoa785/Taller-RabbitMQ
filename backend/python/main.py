from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()

app.mount("/estaticos", StaticFiles(directory="../../frontend/estaticos"), name="static")

template = Jinja2Templates(directory="../../frontend")

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

if __name__ == "__main__":
    uvicorn.run("main:app")