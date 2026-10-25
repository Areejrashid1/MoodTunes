from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url ="postgresql+psycopg2://postgres:PASSWORD.@localhost:5432/postgres"
engine = create_engine(db_url)
session = sessionmaker(autoflush=False, autocommit= False, bind = engine)