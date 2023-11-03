from fastapi import FastAPI

app = FastAPI()


@app.get("/board")
async def get_board():
    return {"board": "board"}
