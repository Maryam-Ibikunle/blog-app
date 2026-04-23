from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserCreate, UserLogin, Token, PostCreate, PostUpdate, CommentCreate
from jose import jwt, JWTError
from models import Users, Posts, Comments
from database import AsyncSessionLocal
from passwords import hash_password, verify_password
from jwt import create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI()
security = HTTPBearer()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@app.post("/signup", tags=["signup"])
async def create_user(user: UserCreate, db:AsyncSession=Depends(get_db)):
    new_user = Users(f_name=user.f_name,l_name=user.l_name, email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.post("/login", response_model=Token, tags=["login"])
async def login(user: UserLogin, db:AsyncSession=Depends(get_db)):
    result = await db.execute(select(Users).where(Users.email==user.email))
    db_user = result.scalar_one_or_none()
    if not db_user or not verify_password(user.password,db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    token = create_access_token({"sub":str(db_user.id)})
    return{"access_token":token, "token_type":"bearer"}

async def get_current_user(token=Security(security), db:AsyncSession=Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPBearer(status_code=401, detail="Invalid token")
        result = await db.execute(select(Users).where(Users.id ==int(user_id)))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="User not found")

@app.post("/posts", tags=["posts"])
async def create_post(post: PostCreate, db:AsyncSession=Depends(get_db), current_user:Users=Depends(get_current_user)):
    result = await db.execute(select(Posts).where(Posts.content == post.content))
    existing_post = result.scalar_one_or_none()
    if existing_post:
        if current_user.id != existing_post.author_id:
            raise HTTPException(status_code=403, detail="Content already exists")
    new_post = Posts(title=post.title, content=post.content, author_id=current_user.id)
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post

@app.put("/posts/{id}", tags=["edits"])
async def edit_post(id:int, post: PostUpdate, db:AsyncSession=Depends(get_db), current_user:Users=Depends(get_current_user)):
    result = await db.execute(select(Posts).where(Posts.id == id))
    db_post = result.scalar_one_or_none()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    db_post.title = post.title
    db_post.content = post.content
    await db.commit()
    await db.refresh(db_post)
    return db_post

@app.delete("/posts/{id}", tags=["delete"])
async def delete_post(id: int, db:AsyncSession=Depends(get_db), current_user:Users=Depends(get_current_user)):
    result = await db.execute(select(Posts).where(Posts.id == id))
    db_post = result.scalar_one_or_none()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    await db.delete(db_post)
    await db.commit()
    return {"message":"Post deleted successfully"}

@app.get("/posts", tags=["posts"])
async def get_posts(author_id: int|None=None, keyword:str|None=None, db:AsyncSession=Depends(get_db)):
    query = select(Posts).options(selectinload(Posts.comments))
    if author_id is not None:
        query = query.where(Posts.author_id == author_id)
    if keyword is not None:
        query = query.where(or_(
            Posts.title.ilike(f"%{keyword}%"),
            Posts.content.ilike(f"%{keyword}%")
        ))
    result = await db.execute(query)
    return result.scalars().all()

@app.post("/posts/{post_id}/comments", tags=["comment"])
async def make_comment(post_id:int, comment: CommentCreate, db:AsyncSession=Depends(get_db), current_user:Users=Depends(get_current_user)):
    result = await db.execute(select(Posts).where(Posts.id == post_id))
    post = result.scalar_one_or_none()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    new_comment = Comments(content=comment.content, user_id=current_user.id, post_id=post.id)
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    return new_comment

@app.get("/users")
async def get_users(db:AsyncSession=Depends(get_db)):
    result = await db.execute(select(Users))
    return result.scalars().all()
