from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    id: int
    f_name:str
    l_name:str
    email:EmailStr
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type: str

class PostCreate(BaseModel):
    id:int
    title:str
    content:str
    author_id:int

class PostUpdate(BaseModel):
    title:str
    content:str

class CommentCreate(BaseModel):
    id: int
    content: str
    user_id: int
    post_id:int