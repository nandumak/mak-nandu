const fallbackAnime = [
  {
    title: "Attack on Titan",
    image: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    genres: ["Action", "Drama", "Suspense"],
    episodes: 25,
    malId: 16498,
    score: 8.55,
    url: "https://myanimelist.net/anime/16498",
    description: "Humanity fights for survival against giant man-eating Titans while uncovering dark secrets behind their walled world."
  },
  {
    title: "Demon Slayer",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    genres: ["Action", "Fantasy"],
    episodes: 26,
    malId: 38000,
    score: 8.45,
    url: "https://myanimelist.net/anime/38000",
    description: "Tanjiro becomes a demon slayer to save his sister and avenge his family after a brutal demon attack."
  },
  {
    title: "Jujutsu Kaisen",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    genres: ["Action", "Fantasy"],
    episodes: 24,
    malId: 40748,
    score: 8.60,
    url: "https://myanimelist.net/anime/40748",
    description: "Yuji Itadori joins sorcerers battling deadly curses after swallowing a powerful cursed object."
  },
  {
    title: "One Piece",
    image: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    episodes: 1000,
    malId: 21,
    score: 8.72,
    url: "https://myanimelist.net/anime/21",
    description: "Monkey D. Luffy sails with his crew across dangerous seas in search of the legendary treasure One Piece."
  },
  {
    title: "Naruto: Shippuden",
    image: "https://cdn.myanimelist.net/images/anime/1565/111305l.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    episodes: 500,
    malId: 1735,
    score: 8.27,
    url: "https://myanimelist.net/anime/1735",
    description: "Naruto returns stronger and faces powerful enemies while chasing his dream of becoming Hokage."
  },
  {
    title: "Death Note",
    image: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    genres: ["Supernatural", "Suspense"],
    episodes: 37,
    malId: 1535,
    score: 8.62,
    url: "https://myanimelist.net/anime/1535",
    description: "A genius student gains a notebook that can kill anyone whose name is written inside it."
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    image: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    episodes: 64,
    malId: 5114,
    score: 9.09,
    url: "https://myanimelist.net/anime/5114",
    description: "Two brothers search for the Philosopher's Stone after a forbidden alchemy ritual costs them dearly."
  },
  {
    title: "My Hero Academia",
    image: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg",
    genres: ["Action"],
    episodes: 13,
    malId: 31964,
    score: 7.85,
    url: "https://myanimelist.net/anime/31964",
    description: "A powerless boy enters a hero academy after inheriting a legendary power from the world's greatest hero."
  },
  {
    title: "Haikyu!!",
    image: "https://cdn.myanimelist.net/images/anime/7/76014l.jpg",
    genres: ["Sports", "Comedy", "Drama"],
    episodes: 25,
    malId: 20583,
    score: 8.44,
    url: "https://myanimelist.net/anime/20583",
    description: "A short but determined volleyball player joins Karasuno High and pushes his team toward national glory."
  },
  {
    title: "Spy x Family",
    image: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg",
    genres: ["Action", "Comedy"],
    episodes: 12,
    malId: 50265,
    score: 8.48,
    url: "https://myanimelist.net/anime/50265",
    description: "A spy, an assassin, and a telepath form a fake family while hiding their true identities from each other."
  },
  {
    title: "Chainsaw Man",
    image: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
    genres: ["Action", "Fantasy"],
    episodes: 12,
    malId: 44511,
    score: 8.48,
    url: "https://myanimelist.net/anime/44511",
    description: "Denji fuses with his devil dog Pochita and becomes a brutal devil hunter with chainsaw powers."
  },
  {
    title: "Hunter x Hunter",
    image: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    episodes: 148,
    malId: 11061,
    score: 9.03,
    url: "https://myanimelist.net/anime/11061",
    description: "Gon becomes a Hunter to find his father, entering a world of dangerous exams, battles, and secrets."
  }
];

let animeList = [...fallbackAnime];
let activeGenre = "all";
const expandedDescriptions = new Set();

const animeGrid = document.querySelector("#animeGrid");
const searchInput = document.querySelector("#searchInput");
const watchPoster = document.querySelector("#watchPoster");
const watchTitle = document.querySelector("#watchTitle");
const watchMeta = document.querySelector("#watchMeta");
const watchDescription = document.querySelector("#watchDescription");
const detailsLink = document.querySelector("#detailsLink");
const crunchyrollLink = document.querySelector("#crunchyrollLink");
const netflixLink = document.querySelector("#netflixLink");
const primeLink = document.querySelector("#primeLink");
const youtubeLink = document.querySelector("#youtubeLink");
const episodeList = document.querySelector("#episodeList");

function normalizeApiAnime(item) {
  return {
    title: item.title_english || item.title,
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
    genres: item.genres?.map((genre) => genre.name).slice(0, 4) || [],
    episodes: item.episodes || "Ongoing",
    malId: item.mal_id,
    score: item.score || "N/A",
    url: item.url,
    description: item.synopsis || "A popular anime title with memorable characters, striking animation, and a story loved by fans."
  };
}

async function loadPopularAnime() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=24");
    if (!response.ok) throw new Error("Popular anime request failed");
    const payload = await response.json();
    animeList = payload.data.map(normalizeApiAnime).filter((anime) => anime.image);
    renderAnime();
    selectAnime(animeList[0]);
  } catch (error) {
    renderAnime();
    selectAnime(animeList[0]);
  }
}

function briefDescription(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  return cleanText.length > 145 ? `${cleanText.slice(0, 142)}...` : cleanText;
}

function getVisibleAnime() {
  const query = searchInput.value.trim().toLowerCase();
  return animeList.filter((anime) => {
    const matchesGenre = activeGenre === "all" || anime.genres.includes(activeGenre);
    const matchesSearch = !query || anime.title.toLowerCase().includes(query);
    return matchesGenre && matchesSearch;
  });
}

function renderAnime() {
  const visibleAnime = getVisibleAnime();
  animeGrid.innerHTML = "";

  if (!visibleAnime.length) {
    animeGrid.innerHTML = `<p class="anime-description">No anime found. Try another search or genre.</p>`;
    return;
  }

  visibleAnime.forEach((anime) => {
    const card = document.createElement("article");
    card.className = "anime-card";
    card.innerHTML = `
      <div class="poster-wrap">
        <img src="${anime.image}" alt="${anime.title} poster">
        <span class="score">Score ${anime.score}</span>
      </div>
      <div class="anime-body">
        <h3>${anime.title}</h3>
        <p class="anime-meta">${anime.genres.slice(0, 3).join(" - ")} - Episodes ${anime.episodes}</p>
        <p class="anime-description" data-description>${getCardDescription(anime)}</p>
        <div class="tag-list">${anime.genres.slice(0, 3).map((genre) => `<span>${genre}</span>`).join("")}</div>
        <button class="read-button" type="button">${expandedDescriptions.has(anime.title) ? "Show less" : "Read more"}</button>
        <button class="watch-button" type="button">Open episodes</button>
      </div>
    `;
    card.querySelector(".read-button").addEventListener("click", () => {
      toggleDescription(anime);
    });
    card.querySelector(".watch-button").addEventListener("click", () => {
      selectAnime(anime);
      document.querySelector("#watch").scrollIntoView({ behavior: "smooth" });
    });
    animeGrid.append(card);
  });
}

function selectAnime(anime) {
  watchPoster.src = anime.image;
  watchPoster.alt = `${anime.title} poster`;
  watchTitle.textContent = anime.title;
  watchMeta.textContent = `${anime.genres.slice(0, 4).join(" - ")} - Episodes ${anime.episodes} - Score ${anime.score}`;
  watchDescription.textContent = anime.description;
  detailsLink.href = anime.url;
  updateSourceLinks(anime.title);
  renderEpisodePlaceholders(anime);
  loadEpisodes(anime);
}

function getCardDescription(anime) {
  return expandedDescriptions.has(anime.title) ? anime.description : briefDescription(anime.description);
}

function toggleDescription(anime) {
  if (expandedDescriptions.has(anime.title)) {
    expandedDescriptions.delete(anime.title);
  } else {
    expandedDescriptions.add(anime.title);
    selectAnime(anime);
  }

  renderAnime();
}

function updateSourceLinks(title) {
  const query = encodeURIComponent(title);
  crunchyrollLink.href = `https://www.crunchyroll.com/search?q=${query}`;
  netflixLink.href = `https://www.netflix.com/search?q=${query}`;
  primeLink.href = `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${query}`;
  youtubeLink.href = `https://www.youtube.com/results?search_query=${query}%20official%20anime`;
}

function renderEpisodePlaceholders(anime) {
  const total = Number(anime.episodes) || 12;
  const count = Math.min(total, 12);
  episodeList.innerHTML = Array.from({ length: count }, (_, index) => (
    renderEpisodeLink(anime, index + 1)
  )).join("");
}

function renderEpisodeLink(anime, episodeNumber, episodeTitle = "") {
  const label = episodeTitle ? `Ep ${episodeNumber}: ${episodeTitle}` : `Episode ${episodeNumber}`;
  const query = encodeURIComponent(`${anime.title} episode ${episodeNumber} official anime`);
  return `<a href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noreferrer">${label}</a>`;
}

async function loadEpisodes(anime) {
  if (!anime.malId) return;

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${anime.malId}/episodes`);
    if (!response.ok) throw new Error("Episode request failed");
    const payload = await response.json();
    const episodes = payload.data.slice(0, 12);

    if (!episodes.length) return;

    episodeList.innerHTML = episodes.map((episode) => {
      const title = episode.title || `Episode ${episode.mal_id}`;
      const href = episode.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${anime.title} episode ${episode.mal_id} official anime`)}`;
      return `<a href="${href}" target="_blank" rel="noreferrer">Ep ${episode.mal_id}: ${title}</a>`;
    }).join("");
  } catch (error) {
    renderEpisodePlaceholders(anime);
  }
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeGenre = button.dataset.filter;
    renderAnime();
  });
});

searchInput.addEventListener("input", renderAnime);

renderAnime();
selectAnime(animeList[0]);
loadPopularAnime();
