import jwt
from typing import List, Dict
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from pydantic import BaseModel
from tortoise import fields
from tortoise.contrib.fastapi import register_tortoise
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model


JWT_SECRET = "myjwtsecret"

app = FastAPI()


class Task(BaseModel):
    id: str
    content: str


class Column(BaseModel):
    id: str
    title: str
    taskIds: List[str]


class Board(BaseModel):
    tasks: Dict[str, Task]
    columns: Dict[str, Column]
    columnOrder: List[str]


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(50, unique=True)
    password = fields.CharField(250)
    board = fields.JSONField(default='{"tasks": {}, "columns": {}, "columnOrder": []}')

    def verify_password(self, password):
        return bcrypt.verify(password, self.password)


user_pydantic = pydantic_model_creator(User, name="User")
user_in_pydantic = pydantic_model_creator(
    User, name="UserIn", exclude_readonly=True, exclude=("board",)
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = await User.get(id=payload.get("id"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        ) from exc
    return await user_pydantic.from_tortoise_orm(user)


@app.get("/board")
async def get_board(user: user_pydantic = Depends(get_current_user)):
    user = await User.get(id=user.id)
    return {"board": user.board}


@app.post("/board")
async def create_board(board: Board, user: user_pydantic = Depends(get_current_user)):
    user = await User.get(id=user.id)
    user.board = board.dict()
    await user.save()
    return {"status": "success"}


# @app.get("/users", response_model=List[user_pydantic])
# async def get_users():
#     return await user_pydantic.from_queryset(User.all())


@app.post("/register")
async def create_user(user_in: user_in_pydantic):
    user_obj = User(username=user_in.username, password=bcrypt.hash(user_in.password))
    await user_obj.save()
    user_obj_py = await user_pydantic.from_tortoise_orm(user_obj)
    token = jwt.encode(user_obj_py.dict(), JWT_SECRET)
    return {"access_token": token, "token_type": "bearer"}


async def authenticate_user(username: str, password: str):
    user = await User.get(username=username)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user


@app.post("/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    user_obj = await user_pydantic.from_tortoise_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return {"access_token": token, "token_type": "bearer"}


register_tortoise(
    app,
    db_url="postgres://postgres:postgres@localhost:5432/postgres",
    modules={"models": ["main"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
