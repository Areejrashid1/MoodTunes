from fastapi import FastAPI,Depends
from database import session,engine
from sqlalchemy.orm import Session
import model
import schemas
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model.Base.metadata.create_all(bind=engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
    
@app.get('/')
def greet():
    return {'message':"Welcome to the page"}


# CRUD OPERATIONS
#1.Songs
@app.get("/songs")
def get_songs(db: Session = Depends(get_db)):
    songs = db.query(model.Song).all()

    return [
        {
            "song_id": song.song_id,
            "title": song.title,
            "artist": song.artist,
            "genre": song.genre,
            "mood": song.mood,
            "energy_level": song.energy_level,
            "duration_seconds": song.duration_seconds,
            "audio_url": song.audio_url,
            "cover_url": song.cover_url,
            "created_at": (
                song.created_at.isoformat()
                if song.created_at is not None
                else None
            ),
        }
        for song in songs
    ]

@app.get("/songs/{mood}")
def mood_songs(mood:str,db :Session =Depends(get_db)):
    mood_songs= db.query(model.Song).filter(model.Song.mood == mood).first()
    if mood_songs:
        return mood_songs
    return "Song not found"

@app.get("/songs/{song_id}")
def get_song_by_id(song_id:int, db: Session=Depends(get_db)):
    song = db.query(model.Song).filter(model.Song.song_id== song_id)
    if song:
        return song
    return "Song not found"

@app.post("/songs")
def add_new_song(song: schemas.SongCreate, db:Session=Depends(get_db)):
    db.add(model.Song(**song.model_dump()))
    db.commit()
    return song


# UPDATE SONG
@app.put("/songs/{song_id}")
def update_song(
    song_id: int,
    new_song: schemas.SongUpdate,
    db: Session = Depends(get_db)
):
    song = db.query(model.Song).filter(
        model.Song.song_id == song_id
    ).first()

    if song:
        song.title = new_song.title
        song.artist = new_song.artist
        song.genre = new_song.genre
        song.mood = new_song.mood
        song.energy_level = new_song.energy_level
        song.duration_seconds = new_song.duration_seconds
        song.audio_url = new_song.audio_url
        song.cover_url = new_song.cover_url

        db.commit()
        return song

    return "Song not found"


# DELETE SONG
@app.delete("/songs/{song_id}")
def delete_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(model.Song).filter(
        model.Song.song_id == song_id
    ).first()

    if song:
        db.delete(song)
        db.commit()
        return "Song deleted successfully"

    return "Song not found"

    
#Users
@app.get("/users")
def get_all_users(db :Session = Depends(get_db)):
    users = db.query(model.User).all()
    return users

@app.get("/users/{user_id}")
def get_user_withId(user_id:int, db: Session= Depends(get_db)):
    user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if user:
        return user
    return "User not found"

@app.post("/users")
def post_new_user(user:schemas.UserCreate,db:Session = Depends(get_db)):
    db.add(model.User(**user.model_dump()))
    db.commit()
    return user

@app.put("/users")
def update_user(user_id:int, new_user:schemas.UserUpdate,db:Session = Depends(get_db)):
    user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if user:
        user.username = new_user.username
        user.email =new_user.email
        db.commit()
        return user
    else:
        return "User not found"

@app.delete("/users/{user_id}")
def delete_user(user_id:int,db:Session =Depends(get_db)):
    user = db.query(model.User).filter(model.User.user_id == user_id).first()
    if user:
        db.query(model.MoodLog).filter(
                                    model.MoodLog.user_id == user_id
                                ).delete(synchronize_session=False)

        db.query(model.Favorite).filter(
                                     model.Favorite.user_id == user_id
                                ).delete(synchronize_session=False)

        db.delete(user)
        db.commit()
    else:
        return "User not found"

#moods
@app.get('/mood_logs')
def get_all_moods(db:Session = Depends(get_db)):
    mood = db.query(model.MoodLog).all()
    return mood


@app.get("/moods/history/{user_id}")
def get_mood_history(user_id: int, db: Session = Depends(get_db)):
    history = ( db.query(model.MoodLog).filter(model.MoodLog.user_id == user_id).order_by(model.MoodLog.logged_at.desc()).all()
    )
    return history

@app.get("/moods/{mood_log_id}")
def get_mood_by_id(mood_log_id:int, db: Session= Depends(get_db)):
    mood = db.query(model.MoodLog).filter(model.MoodLog.mood_log_id == mood_log_id)
    return mood

@app.post('/moods')
def post_mood(mood:schemas.MoodLogCreate,db: Session= Depends(get_db)):
    db.add(model.MoodLog(**mood.model.dump()))
    db.commit()
    return mood


# UPDATE MOOD LOG
@app.put("/moods/{mood_log_id}")
def update_mood(
    mood_log_id: int,
    new_mood: schemas.MoodLogUpdate,
    db: Session = Depends(get_db)
):
    mood = db.query(model.MoodLog).filter(
        model.MoodLog.mood_log_id == mood_log_id
    ).first()

    if mood:
        mood.mood = new_mood.mood
        mood.energy_level = new_mood.energy_level

        db.commit()
        return mood

    return "Mood log not found"


# DELETE MOOD LOG
@app.delete("/moods/{mood_log_id}")
def delete_mood(mood_log_id: int, db: Session = Depends(get_db)):
    mood = db.query(model.MoodLog).filter(
        model.MoodLog.mood_log_id == mood_log_id
    ).first()

    if mood:
        db.delete(mood)
        db.commit()
        return "Mood log deleted successfully"

    return "Mood log not found"


#Favourites
@app.get("/favorites")
def get_all_fav(db:Session =Depends(get_db)):
    fav = db.query(model.Favorite).all()
    return fav

@app.get("favorites/{user_id}")
def get_fav_by_id(user_id:int, db:Session =Depends(get_db)):
    fav= db.query(model.Favorite).filter(model.Favorite.user_id == user_id)
    return fav

@app.post("favourites")
def add_fav(fav:schemas.FavoriteCreate, db:Session =Depends(get_db)):
    db.add(model.Favorite(**fav.model_dump()))
    db.commit()
    return fav


# DELETE FAVORITE
@app.delete("/favorites/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: Session = Depends(get_db)
):
    fav = db.query(model.Favorite).filter(
        model.Favorite.favorite_id == favorite_id
    ).first()

    if fav:
        db.delete(fav)
        db.commit()
        return "Favorite deleted successfully"

    return "Favorite not found"
