from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
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
    title:str
    content:str


class PostUpdate(BaseModel):
    title:str
    content:str

class CommentCreate(BaseModel):
    content: str
    post_id:int



class UserOut(BaseModel):
    id: int
    f_name: str
    l_name: str
    class Config:
        from_attributes = True

class CommentOut(BaseModel):
    id: int
    content: str
    user: UserOut
    class Config:
        from_attributes = True

class PostOut(BaseModel):
    id: int
    title: str
    content: str
    comments: list[CommentOut]
    author: UserOut
    class Config:
        from_attributes = True

