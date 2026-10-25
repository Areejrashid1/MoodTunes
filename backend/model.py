
from datetime import datetime

from sqlalchemy import (Column,Integer,String,DateTime,ForeignKey,UniqueConstraint)
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Song(Base):
    __tablename__ = "songs"

    song_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    artist = Column(String(200), nullable=False)
    genre = Column(String(100), nullable=False)
    mood = Column(String(50), nullable=False)
    energy_level = Column(Integer, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    audio_url = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MoodLog(Base):
    __tablename__ = "mood_logs"

    mood_log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column( Integer,ForeignKey("users.user_id"),nullable=False,)
    mood = Column(String(50), nullable=False)
    energy_level = Column(Integer, nullable=False)
    logged_at = Column(DateTime, default=datetime.utcnow)


class Favorite(Base):
    __tablename__ = "favorites"
    favorite_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("users.user_id"),nullable=False,)
    song_id = Column(
        Integer,
        ForeignKey("songs.song_id"),
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "song_id",
            name="unique_user_song_favorite",
        ),
    )
