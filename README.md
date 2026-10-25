
# 🎧 MoodTunes

**MoodTunes** is a mood-based music discovery dashboard that helps users discover songs based on how they feel. It combines mood selection, music recommendations, search, genre filtering, mood history, and favorites in a fun, modern interface.

## ✨ Features

- 🎭 **Mood Selection** — Choose a mood to explore music that matches your feelings.
- 🎵 **Song Recommendations** — Fetch songs from the backend API.
- 🔎 **Search** — Search for songs by title or artist.
- 🎼 **Genre Filtering** — Filter songs by music genre.
- ⚡ **Energy Control** — Adjust your preferred energy level.
- 📊 **Mood History** — View moods logged during the current frontend session.
- 💗 **Favorites** — Mark songs as favorites during the current session.
- 🌙 **Modern UI/UX** — Dark theme with purple, pink, and lilac gradients.
- 📱 **Responsive Design** — Adaptable layout for different screen sizes.
- 🔗 **API Integration** — React frontend connected to a FastAPI backend.

## 🧰 Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- FastAPI
- SQLAlchemy
- Python

### Database
- PostgreSQL
- Psycopg2

## 📁 Project Structure

```text
MoodTunes/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── model.py
│   └── schemas.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   ├── package.json
│   └── ...
└── README.md
```

*Your actual folder structure may vary.*

## ⚙️ Prerequisites

Before running the project, ensure you have installed:

- Python 3.10+
- Node.js and npm
- PostgreSQL
- Git (optional)

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd MoodTunes
```

If you already have the project locally, open your terminal in the project directory.

### 2. Configure PostgreSQL

Create a PostgreSQL database for MoodTunes.

Configure the database connection in `backend/database.py` using your database credentials.

A SQLAlchemy connection URL follows this format:

```text
postgresql+psycopg2://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

**Security:** Do not commit database passwords, API keys, or `.env` files to GitHub. Use environment variables for credentials.

### 3. Set Up the Backend

Open a terminal in the backend directory:

```bash
cd backend
```

Activate your Python virtual environment if you have one.

For Windows PowerShell, if your virtual environment is in the project root:

```powershell
..\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

- **API:** http://127.0.0.1:8000
- **API Documentation:** http://127.0.0.1:8000/docs
- **Songs Endpoint:** http://127.0.0.1:8000/songs

### 4. Set Up the Frontend

Open a second terminal in the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173

## 🔌 Frontend–Backend Integration

The React frontend fetches song data from the FastAPI backend through `api.js`.

Example:

```javascript
const API_URL = "http://127.0.0.1:8000";

export async function getSongs() {
  const response = await fetch(`${API_URL}/songs`);

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.json();
}
```

### Verify the Connection

1. Start the FastAPI backend.
2. Open `http://127.0.0.1:8000/docs`.
3. Test the `GET /songs` endpoint.
4. Confirm that the endpoint returns a JSON list of songs.
5. Start the React frontend.
6. Verify that songs appear in the dashboard.

If a CORS error occurs, configure FastAPI's CORS middleware to allow the frontend's origin.

## 🎮 How to Use MoodTunes

1. Open the dashboard in your browser.
2. Select your current mood.
3. Adjust the energy level.
4. Choose a genre to refine your recommendations.
5. Search and browse available songs.
6. Explore the mood-history and favorites sections.

## 📌 Current Implementation Status

| Feature | Status |
|---|---|
| React frontend | Implemented |
| FastAPI backend | Implemented |
| PostgreSQL integration | Configured |
| Fetch songs from API | Connected |
| Mood selection UI | Implemented |
| Search and genre filters | Frontend functionality |
| Persistent mood history | Pending API integration |
| Persistent favorites | Pending API integration |
| Real audio playback | Depends on playback implementation and valid audio URLs |

*Status reflects the current known implementation and should be updated as additional features are tested.*

## 🛠️ Troubleshooting

### Songs Are Not Displayed
- Ensure FastAPI is running.
- Visit `http://127.0.0.1:8000/songs`.
- Check the browser's Developer Tools under **Console** and **Network**.
- Verify the API URL in `api.js`.
- Check the backend terminal for database errors.

### CORS Errors
- Verify the frontend URL configured in FastAPI.
- Restart the backend after changing CORS settings.

### Database Connection Errors
- Confirm PostgreSQL is running.
- Check the database name, username, password, host, and port.
- Ensure the PostgreSQL driver is installed in the active virtual environment.

## 🔮 Future Enhancements

- 💾 Persist mood history in PostgreSQL.
- 💗 Implement database-backed favorites.
- 👤 Add user authentication and personalized recommendations.
- 🎧 Implement real audio playback.
- 🧠 Develop smarter mood-based recommendation logic.
- 🧪 Add automated backend and frontend tests.
- ☁️ Deploy the application online.

## 🔒 Security

- Never upload database credentials or API keys to GitHub.
- Use environment variables for sensitive configuration.
- Review CORS settings and database permissions before deployment.
- Add authentication before exposing user-specific endpoints publicly.

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project for reuse.

---

**Made with 🎧 and a little mood magic.**
