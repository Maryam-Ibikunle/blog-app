from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, String, Integer, ForeignKey

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, index=True, primary_key=True)
    f_name = Column(String)
    l_name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    posts = relationship("Posts", back_populates="author")
    comments = relationship("Comments", back_populates="users")

class Posts(Base):
    __tablename__ = "posts"
    id = Column(Integer, index=True, primary_key=True)
    title = Column(String)
    content = Column(String)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("Users", back_populates="posts")
    comments = relationship("Comments", back_populates="posts")

class Comments(Base):
    __tablename__ = "comments"
    id = Column(Integer, index=True, primary_key=True)
    content = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    users = relationship("Users", back_populates="comments")
    posts = relationship("Posts", back_populates="comments")