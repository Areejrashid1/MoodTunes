
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional

class SongResponse(BaseModel):
    song_id: int
    title: str
    artist: str
    genre: str
    mood: str
    energy_level: Optional[int] = None
    duration_seconds: int
    audio_url: Optional[str] = None
    cover_url: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
# ---------- USERS ----------

class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    email: EmailStr


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None


class UserResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- SONGS ----------

class SongCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    artist: str = Field(min_length=1, max_length=200)
    genre: str = Field(min_length=1, max_length=100)
    mood: str = Field(min_length=1, max_length=50)
    energy_level: int = Field(ge=1, le=10)
    duration_seconds: int = Field(gt=0)
    audio_url: str | None = None
    cover_url: str | None = None


class SongUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    artist: str | None = Field(default=None, max_length=200)
    genre: str | None = Field(default=None, max_length=100)
    mood: str | None = Field(default=None, max_length=50)
    energy_level: int | None = Field(default=None, ge=1, le=10)
    duration_seconds: int | None = Field(default=None, gt=0)
    audio_url: str | None = None
    cover_url: str | None = None


class SongResponse(BaseModel):
    song_id: int
    title: str
    artist: str
    genre: str
    mood: str
    energy_level: int
    duration_seconds: int
    audio_url: str | None
    cover_url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- MOOD LOGS ----------

class MoodLogCreate(BaseModel):
    user_id: int
    mood: str = Field(min_length=1, max_length=50)
    energy_level: int = Field(ge=1, le=10)


class MoodLogUpdate(BaseModel):
    mood: str | None = Field(default=None, max_length=50)
    energy_level: int | None = Field(default=None, ge=1, le=10)


class MoodLogResponse(BaseModel):
    mood_log_id: int
    user_id: int
    mood: str
    energy_level: int
    logged_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- FAVORITES ----------

class FavoriteCreate(BaseModel):
    user_id: int
    song_id: int


class FavoriteResponse(BaseModel):
    favorite_id: int
    user_id: int
    song_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
