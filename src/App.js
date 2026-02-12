import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [tiktokTags, setTiktokTags] = useState([]);
  const [igTags, setIgTags] = useState([]);
  const [ytTags, setYtTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPlaceholders, setShowPlaceholders] = useState(true);

  // Fast scrolling placeholders (randomized on mount)
  const placeholders = [
    "Apex Legends ranked 1v3 clutch", "Tarkov wipe funny fails", "gamer dad reaction clips",
    "Valorant ace moments", "Minecraft speedrun world record", "lofi hip hop radio beats",
    "Fortnite zero build wins", "GTA RP funny moments", "Among Us sus impostor plays",
    "Warzone gulag comebacks", "Roblox obby fails", "Call of Duty nukes",
    "Elden Ring boss rage quits", "Cyberpunk 2077 glitches", "Stardew Valley farm tours",
    "Overwatch 2 clutch plays", "League of Legends pentakills", "CS2 ace clutches",
    "Dead by Daylight killer mains", "Phasmophobia ghost hunts", "Fall Guys crown wins",
    "Pokemon shiny hunting", "Animal Crossing island tours", "Genshin Impact spiral abyss",
    "Hollow Knight boss fights", "Super Mario speedruns", "Zelda TOTK korok hunts",
    "Skyrim dragon shouts", "Terraria boss fights", "No Man's Sky expeditions"
  ];

  useEffect(() => {
    // Randomize order of placeholders
    setPlaceholders(placeholders.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (query.trim()) {
      setShowPlaceholders(false);
    }
  }, [query]);

  const fetchTags = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setTiktokTags([]);
    setIgTags([]);
    setYtTags([]);

    try {
      // TikTok hashtag suggest
      const tiktokRes = await fetch(`https://www.tiktok.com/api/search/hashtag/?keyword=${encodeURIComponent(query)}`);
      if (tiktokRes.ok) {
        const json = await tiktokRes.json();
        const tags = json?.data?.hashtag_list?.map(h => `#${h.title}`) || [];
        setTiktokTags(tags.slice(0, 5));
      }

      // Instagram (via allorigins proxy for CORS)
      const igRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/web/search/topsearch/?query=${encodeURIComponent(query)}`)}`);
      if (igRes.ok) {
        const json = await igRes.json();
        const tags = json?.hashtags?.map(h => `#${h.hashtag.name}`) || [];
        setIgTags(tags.slice(0, 5));
      }

      // YouTube suggest
      const ytRes = await fetch(`https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`);
      if (ytRes.ok) {
        const text = await ytRes.text();
        const matches = text.match(/"(.*?)"/g) || [];
        const tags = matches.map(m => `#${m.replace(/"/g, '')}`).slice(1, 6); // skip first (query itself)
        setYtTags(tags);
      }

      if (!tiktokTags.length && !igTags.length && !ytTags.length) {
        setError('No strong trending tags found – try a more specific vibe!');
      }
    } catch (err) {
      setError('Network issue – try again in a sec');
    } finally {
      setLoading(false);
    }
  };

  const copyTags = (tags) => {
    navigator.clipboard.writeText(tags.join(' '));
    alert('Copied!');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-black/15 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-cyan-400 drop-shadow-lg">
        Trending Tag Finder
      </h1>
      <p className="text-center text-cyan-300 mb-8 text-sm">
        Type your video/game/vibe → get top 5 real trending tags for each platform
      </p>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Apex Legends ranked 1v3 clutch"
          className="w-full p-4 bg-black/50 border border-cyan-500/40 rounded-xl text-white placeholder-cyan-400 focus:outline-none focus:border-pink-500 transition text-lg"
        />

        {showPlaceholders && query === '' && (
          <div className="absolute inset-0 pointer-events-none flex items-center overflow-hidden">
            <div className="marquee text-cyan-300/70 text-sm font-light whitespace-nowrap">
              {placeholders.map((p, i) => (
                <span key={i} className="mx-8">
                  {p} • 
                </span>
              ))}
              {placeholders.map((p, i) => (
                <span key={i + 'dup'} className="mx-8">
                  {p} • 
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={fetchTags}
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 watch-btn px-6 py-2 text-sm font-bold disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Find Top 5'}
        </button>
      </div>

      {loading && <p className="text-center text-cyan-400 animate-pulse">Scanning trends...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* TikTok */}
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-pink-500/30">
          <h2 className="text-xl font-semibold text-pink-400 mb-4 text-center">TikTok</h2>
          {tiktokTags.length > 0 ? (
            <div className="space-y-3">
              {tiktokTags.map((tag, i) => (
                <div key={i} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-pink-500/20">
                  <span className="text-pink-300">{tag}</span>
                  <button onClick={() => navigator.clipboard.writeText(tag)} className="text-pink-400 hover:text-pink-300 text-sm">
                    Copy
                  </button>
                </div>
              ))}
              <button onClick={() => copyTags(tiktokTags)} className="w-full mt-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg font-medium transition">
                Copy All 5
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">No strong tags yet</p>
          )}
        </div>

        {/* Instagram */}
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/30">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4 text-center">Instagram</h2>
          {igTags.length > 0 ? (
            <div className="space-y-3">
              {igTags.map((tag, i) => (
                <div key={i} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-cyan-500/20">
                  <span className="text-cyan-300">{tag}</span>
                  <button onClick={() => navigator.clipboard.writeText(tag)} className="text-cyan-400 hover:text-cyan-300 text-sm">
                    Copy
                  </button>
                </div>
              ))}
              <button onClick={() => copyTags(igTags)} className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition">
                Copy All 5
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">No strong tags yet</p>
          )}
        </div>

        {/* YouTube */}
        <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/30">
          <h2 className="text-xl font-semibold text-purple-400 mb-4 text-center">YouTube</h2>
          {ytTags.length > 0 ? (
            <div className="space-y-3">
              {ytTags.map((tag, i) => (
                <div key={i} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-purple-500/20">
                  <span className="text-purple-300">{tag}</span>
                  <button onClick={() => navigator.clipboard.writeText(tag)} className="text-purple-400 hover:text-purple-300 text-sm">
                    Copy
                  </button>
                </div>
              ))}
              <button onClick={() => copyTags(ytTags)} className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">
                Copy All 5
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">No strong tags yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
