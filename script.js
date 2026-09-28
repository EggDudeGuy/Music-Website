const tracks = [
  {
    title: "STRESS",
    meta: "001 // STRESS",
    src: "audio/Stress.mp3"
  },
  {
    title: "The Stuff",
    meta: "002 // STRESS",
    src: "audio/The_Stuff.mp3"
  },
  {
    title: "GS",
    meta: "003 // STRESS",
    src: "audio/GS.mp3"
  },
  {
    title: "Continum1",
    meta: "004 // STRESS",
    src: "audio/Continum_1.mp3"
  },
  {
    title: "Continum2",
    meta: "005 // STRESS",
    src: "audio/Continum_2.mp3"
  },
  {
    title: "Homeless",
    meta: "006 // STRESS",
    src: "audio/Homeless.mp3"
  },
  {
    title: "GoodBy",
    meta: "007 // STRESS",
    src: "audio/GoodBy.m4a"
  }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const volume = document.getElementById("volume");
const progress = document.getElementById("progress");
const progressBar = document.querySelector(".progress-bar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const title = document.getElementById("trackTitle");
const meta = document.getElementById("trackMeta");
const tracklist = document.getElementById("tracklist");

let currentTrack = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function renderTracks() {
  tracklist.innerHTML = tracks.map((track, index) => `
    <div class="track ${index === currentTrack ? "active" : ""}" data-index="${index}">
      <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="track-name">${track.title}</span>
      <span class="track-meta">${track.meta}</span>
    </div>
  `).join("");

  document.querySelectorAll(".track").forEach(item => {
    item.addEventListener("click", () => {
      loadTrack(Number(item.dataset.index));
      audio.play().catch(() => {});
    });
  });
}

function loadTrack(index) {
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];

  title.textContent = track.title;
  meta.textContent = track.meta;
  audio.src = track.src;

  progress.style.width = "0%";
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  renderTracks();
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {
      alert("Add your MP3 files to the /audio folder, then try again.");
    });
  } else {
    audio.pause();
  }
}

playBtn.addEventListener("click", togglePlay);

prevBtn.addEventListener("click", () => {
  loadTrack(currentTrack - 1);
  audio.play().catch(() => {});
});

nextBtn.addEventListener("click", () => {
  loadTrack(currentTrack + 1);
  audio.play().catch(() => {});
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.addEventListener("play", () => {
  playBtn.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progress.style.width = `${percent}%`;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1);
  audio.play().catch(() => {});
});

progressBar.addEventListener("click", (event) => {
  if (!audio.duration) return;

  const rect = progressBar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

audio.volume = 0.8;
loadTrack(0);
