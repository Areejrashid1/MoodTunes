
import { useState, useEffect } from "react";
import "./App.css";
import { getSongs } from "./api";

const moods = [
  { name: "Happy", emoji: "😊", color: "happy" },
  { name: "Sad", emoji: "🌧️", color: "sad" },
  { name: "Chill", emoji: "😌", color: "chill" },
  { name: "Energetic", emoji: "⚡", color: "energetic" },
  { name: "Focused", emoji: "🎯", color: "focused" },
  { name: "Romantic", emoji: "💗", color: "romantic" },
];

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [energy, setEnergy] = useState(60);
  const [genre, setGenre] = useState("All genres");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([
    { mood: "Happy", time: "Today, 10:24 AM", energy: 70 },
    { mood: "Chill", time: "Yesterday, 8:12 PM", energy: 30 },
    { mood: "Sad", time: "Oct 18, 2025", energy: 25 },
    { mood: "Energetic", time: "Oct 17, 2025", energy: 90 },
  ]);
  const [playingSong, setPlayingSong] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [notice, setNotice] = useState("");

  
useEffect(() => {
  async function loadSongs() {
    try {
      const data = await getSongs();

      const formattedSongs = data.map((song, index) => ({
        id: song.song_id,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        moods: [song.mood],
        emoji: ["🌅", "🌊", "🪩", "🌃", "✨", "🌹", "☁️", "🔥"][index % 8],
        cover: `cover-${["one", "two", "three", "four", "five", "six", "seven", "eight"][index % 8]}`,
        duration: `${Math.floor(song.duration_seconds / 60)}:${String(
          song.duration_seconds % 60
        ).padStart(2, "0")}`,
      }));

      setSongs(formattedSongs);
    } catch (err) {
      setError("Could not load songs from the backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadSongs();
}, []);



  const currentMood =
    moods.find((mood) => mood.name === selectedMood) || moods[0];

  const filteredSongs = songs.filter((song) => {
    const matchesMood =
      activePage === "Browse Songs" ||
      activePage === "Favorites" ||
      song.moods.includes(selectedMood);

    const matchesGenre =
      genre === "All genres" || song.genre === genre;

    const matchesSearch =
      `${song.title} ${song.artist} ${song.genre}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFavorites =
      activePage !== "Favorites" || favorites.includes(song.id);

    return (
      matchesMood &&
      matchesGenre &&
      matchesSearch &&
      matchesFavorites
    );
  });

  function logMood() {
    const now = new Date().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setHistory((previous) => [
      {
        mood: selectedMood,
        time: now,
        energy: Number(energy),
      },
      ...previous,
    ]);

    setNotice(`Your ${selectedMood.toLowerCase()} mood has been logged!`);
    setTimeout(() => setNotice(""), 3000);
  }

  function toggleFavorite(songId) {
    setFavorites((previous) =>
      previous.includes(songId)
        ? previous.filter((id) => id !== songId)
        : [...previous, songId]
    );
  }

  function selectPage(page) {
    setActivePage(page);
    setSearch("");
    setGenre("All genres");
  }

  function playSong(song) {
    setPlayingSong((previous) =>
      previous?.id === song.id ? null : song
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">♫</span>
          <div>
            <h2>Mood<span>Tunes</span></h2>
            <p>Your mood, your music</p>
          </div>
        </div>

        <nav className="navigation">
          {[
            { name: "Home", icon: "⌂" },
            { name: "Mood History", icon: "◷" },
            { name: "Browse Songs", icon: "♫" },
            { name: "Favorites", icon: "♡" },
          ].map((item) => (
            <button
              key={item.name}
              className={`nav-link ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => selectPage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-quote">
          <span>♫</span>
          <p>"Better days sound better."</p>
          <div className="wave-line">〰〰〰〰〰</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="welcome">
            <div className="sun-icon">☀️</div>
            <div>
              <h1>
                {activePage === "Home"
                  ? "Good morning!"
                  : activePage}
              </h1>
              <p>
                {activePage === "Home"
                  ? "How are you feeling today? Let's find your soundtrack."
                  : "Explore your music and mood journey."}
              </p>
            </div>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="⌕  Search songs, artists..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="profile-avatar">M</div>
        </header>

        {notice && <div className="notice">{notice}</div>}
        {loading && <p>Loading songs from the backend...</p>}
        {error && <p className="empty-state">{error}</p>}

        {activePage === "Home" && (
          <>
            <section className="mood-panel">
              <h3>Select your mood</h3>

              <div className="mood-grid">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    className={`mood-card ${mood.color} ${
                      selectedMood === mood.name ? "selected" : ""
                    }`}
                    onClick={() => setSelectedMood(mood.name)}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span>{mood.name}</span>
                  </button>
                ))}
              </div>

              <div className="mood-controls">
                <label className="energy-control">
                  <span>Energy level</span>
                  <div className="slider-row">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={energy}
                      onChange={(event) => setEnergy(event.target.value)}
                    />
                    <span className="energy-label">
                      {energy < 35
                        ? "Low"
                        : energy < 70
                        ? "Medium"
                        : "High"}
                    </span>
                  </div>
                </label>

                <label className="genre-control">
                  <span>Preferred genre</span>
                  <select
                    value={genre}
                    onChange={(event) => setGenre(event.target.value)}
                  >
                    {[
                      "All genres",
                      "Pop",
                      "R&B",
                      "Acoustic",
                      "Electronic",
                      "Ambient",
                      "Hip-Hop",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <button className="primary-button" onClick={logMood}>
                  ✨ Log Mood
                </button>
              </div>
            </section>

            <MoodSuggestions
              mood={currentMood}
              onSelectMood={setSelectedMood}
              songs={songs}
            />
          </>
        )}

        {activePage === "Mood History" && (
          <section className="content-panel">
            <div className="section-heading">
              <div>
                <h2>◷ Your mood journey</h2>
                <p>Look back at the moods you've logged.</p>
              </div>
              <span className="count-badge">
                {history.length} entries
              </span>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Mood</th>
                    <th>Energy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => {
                    const mood =
                      moods.find((item) => item.name === entry.mood) ||
                      moods[0];

                    return (
                      <tr key={`${entry.time}-${index}`}>
                        <td>{entry.time}</td>
                        <td>
                          <span className="table-mood">
                            {mood.emoji} {entry.mood}
                          </span>
                        </td>
                        <td>
                          <span className="energy-dot" />
                          {entry.energy}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(activePage === "Browse Songs" ||
          activePage === "Favorites") && (
          <section className="content-panel">
            <div className="section-heading">
              <div>
                <h2>
                  {activePage === "Favorites"
                    ? "♡ Your favorites"
                    : "♫ Discover music"}
                </h2>
                <p>
                  {activePage === "Favorites"
                    ? "Your personally saved tracks."
                    : "Find something that fits your vibe."}
                </p>
              </div>
              <select
                className="filter-select"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                {[
                  "All genres",
                  "Pop",
                  "R&B",
                  "Acoustic",
                  "Electronic",
                  "Ambient",
                  "Hip-Hop",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            {activePage === "Browse Songs" && (
              <div className="browse-moods">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    className={`filter-chip ${
                      selectedMood === mood.name ? "chip-active" : ""
                    }`}
                    onClick={() => setSelectedMood(mood.name)}
                  >
                    {mood.emoji} {mood.name}
                  </button>
                ))}
              </div>
            )}

            <div className="song-list">
              {filteredSongs.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  isPlaying={playingSong?.id === song.id}
                  isFavorite={favorites.includes(song.id)}
                  onPlay={() => playSong(song)}
                  onFavorite={() => toggleFavorite(song.id)}
                />
              ))}
            </div>

            {filteredSongs.length === 0 && (
              <p className="empty-state">
                No songs found. Try another search or filter.
              </p>
            )}
          </section>
        )}
      </main>

      <aside className="right-panel">
        <section className="quick-card">
          <h3>〽 Quick Mood Check-In</h3>
          <p>Save your current mood and keep track of your journey.</p>
          <button className="primary-button full-button" onClick={logMood}>
            Log Mood
          </button>
        </section>

        <section className="recent-card">
          <h3>Your Recent Moods</h3>

          {history.slice(0, 4).map((entry, index) => {
            const mood =
              moods.find((item) => item.name === entry.mood) || moods[0];

            return (
              <button
                className="recent-mood"
                key={`${entry.time}-${index}`}
                onClick={() => {
                  setSelectedMood(entry.mood);
                  setActivePage("Home");
                }}
              >
                <span className={`recent-emoji ${mood.color}`}>
                  {mood.emoji}
                </span>
                <span className="recent-details">
                  <strong>{entry.mood}</strong>
                  <small>{entry.time}</small>
                </span>
                <span className="recent-arrow">›</span>
              </button>
            );
          })}

          <div className="recent-quote">
            Different moods.
            <br />
            Same you. ♡
          </div>
        </section>

        <section className="player-card">
          <div className="player-art">
            {playingSong?.emoji || "♫"}
          </div>
          <div className="player-info">
            <strong>{playingSong?.title || "Your soundtrack awaits"}</strong>
            <span>
              {playingSong?.artist || "Choose a song to start"}
            </span>
          </div>
          <button
            className="player-button"
            onClick={() =>
              playingSong && playSong(playingSong)
            }
            title="Pause or play"
          >
            {playingSong ? "Ⅱ" : "▶"}
          </button>
          <p className="player-note">
            {playingSong
              ? "Demo player · no audio stream connected"
              : "Find your vibe. Find your music."}
          </p>
        </section>
      </aside>
    </div>
  );
}

function MoodSuggestions({ mood, onSelectMood, songs }) {
  return (
    <section className="recommendations">
      <div className="section-heading">
        <div>
          <h2>✦ Recommended for You</h2>
          <p>
            A little music for your {mood.name.toLowerCase()} side.
          </p>
        </div>
        <button
          className="text-button"
          onClick={() => onSelectMood(mood.name)}
        >
          {mood.emoji} {mood.name}
        </button>
      </div>

      <div className="song-grid">
        {songs
          .filter((song) => song.moods.includes(mood.name))
          .slice(0, 5)
          .map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
      </div>
    </section>
  );
}

function SongCard({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <article className="song-card">
      <div className={`album-art ${song.cover}`}>
        <span>{song.emoji}</span>
      </div>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
      <div className="song-card-footer">
        <span className="genre-tag">{song.genre}</span>
        <button
          className="play-button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause song demo" : "Play song demo"}
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
      </div>
      {isPlaying && (
        <small className="demo-label">Demo only · No audio connected</small>
      )}
    </article>
  );
}

function SongRow({
  song,
  isPlaying,
  isFavorite,
  onPlay,
  onFavorite,
}) {
  return (
    <div className="song-row">
      <div className={`row-art ${song.cover}`}>{song.emoji}</div>
      <div className="row-song-info">
        <strong>{song.title}</strong>
        <span>{song.artist}</span>
      </div>
      <span className="genre-tag">{song.genre}</span>
      <span className="song-duration">{song.duration}</span>
      <button className="small-play" onClick={onPlay}>
        {isPlaying ? "Ⅱ" : "▶"}
      </button>
      <button
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        onClick={onFavorite}
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
      >
        {isFavorite ? "♥" : "♡"}
      </button>
    </div>
  );
}

export default App;
