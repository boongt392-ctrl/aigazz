
(() => {
  const questions = [
    { category: "Logika", q: "Apa yang punya banyak gigi tetapi tidak bisa menggigit?", a: ["sisir"], hint: "Dipakai untuk merapikan rambut.", explanation: "Jawabannya sisir." },
    { category: "Lucu", q: "Kenapa komputer suka kedinginan?", a: ["karena banyak windows", "banyak windows"], hint: "Pikirkan nama sistem operasi.", explanation: "Karena banyak Windows! Ini permainan kata." },
    { category: "Logika", q: "Semakin diambil, semakin besar. Apakah itu?", a: ["lubang"], hint: "Bisa ditemukan di tanah.", explanation: "Jawabannya lubang." },
    { category: "Teka-teki", q: "Apa yang selalu naik tetapi tidak pernah turun?", a: ["umur", "usia"], hint: "Bertambah setiap tahun.", explanation: "Jawabannya umur atau usia." },
    { category: "Logika", q: "Punya leher tetapi tidak punya kepala. Apakah itu?", a: ["botol"], hint: "Sering dipakai untuk menyimpan minuman.", explanation: "Jawabannya botol." },
    { category: "Lucu", q: "Ikan apa yang paling sabar?", a: ["ikan paus", "paus"], hint: "Nama hewan laut yang sangat besar.", explanation: "Tebakan bercanda: ikan paus." },
    { category: "Pengetahuan", q: "Planet apa yang dikenal sebagai Planet Merah?", a: ["mars"], hint: "Namanya terdiri dari empat huruf.", explanation: "Jawabannya Mars." },
    { category: "Logika", q: "Apa yang punya tangan tetapi tidak bisa bertepuk tangan?", a: ["jam", "jam dinding", "jam tangan"], hint: "Menunjukkan waktu.", explanation: "Jawabannya jam." },
    { category: "Teka-teki", q: "Apa yang bisa pecah walaupun tidak pernah jatuh?", a: ["janji"], hint: "Sesuatu yang kita ucapkan kepada orang lain.", explanation: "Jawabannya janji." },
    { category: "Pengetahuan", q: "Berapa jumlah sisi pada segitiga?", a: ["3", "tiga"], hint: "Lebih banyak dari dua, kurang dari empat.", explanation: "Jawabannya tiga." },
    { category: "Logika", q: "Apa yang punya mata tetapi tidak bisa melihat?", a: ["jarum", "jarum jahit"], hint: "Digunakan untuk menjahit.", explanation: "Jawabannya jarum." },
    { category: "Lucu", q: "Apa yang kalau dipotong malah jadi lebih panjang dalam cerita?", a: ["antrean", "antrian"], hint: "Orang berdiri menunggu giliran.", explanation: "Tebakan permainan kata: antrean bisa terasa makin panjang saat menunggu." },
    { category: "Logika", q: "Ada di depan mata, tetapi tidak bisa dilihat. Apakah itu?", a: ["masa depan"], hint: "Belum terjadi.", explanation: "Jawabannya masa depan." },
    { category: "Pengetahuan", q: "Apa nama satelit alami Bumi?", a: ["bulan"], hint: "Terlihat jelas pada malam hari.", explanation: "Jawabannya Bulan." },
    { category: "Teka-teki", q: "Apa yang punya kota tetapi tidak punya rumah, punya sungai tetapi tidak punya air?", a: ["peta"], hint: "Digunakan untuk menunjukkan lokasi.", explanation: "Jawabannya peta." },
    { category: "Logika", q: "Apa yang bisa memenuhi ruangan tanpa memakan tempat?", a: ["cahaya", "sinar"], hint: "Bisa berasal dari lampu.", explanation: "Jawabannya cahaya." },
    { category: "Pengetahuan", q: "Berapa hari dalam satu minggu?", a: ["7", "tujuh"], hint: "Senin sampai Minggu.", explanation: "Jawabannya tujuh." },
    { category: "Teka-teki", q: "Apa yang punya banyak kunci tetapi tidak bisa membuka pintu?", a: ["piano", "keyboard", "papan ketik"], hint: "Alat musik atau perangkat untuk mengetik.", explanation: "Jawabannya piano atau keyboard." },
    { category: "Logika", q: "Kalau kamu menyalip orang di posisi kedua dalam lomba, kamu berada di posisi berapa?", a: ["kedua", "posisi kedua", "2"], hint: "Kamu mengambil posisi orang yang disalip.", explanation: "Jawabannya posisi kedua." },
    { category: "Pengetahuan", q: "Apa nama proses tumbuhan membuat makanan dengan bantuan cahaya?", a: ["fotosintesis"], hint: "Dimulai dengan kata foto.", explanation: "Jawabannya fotosintesis." },
    { category: "Lucu", q: "Apa yang selalu ikut kita saat siang cerah, tetapi menghilang saat gelap?", a: ["bayangan"], hint: "Terbentuk ketika cahaya terhalang.", explanation: "Jawabannya bayangan." },
    { category: "Logika", q: "Apa yang bisa berjalan tanpa kaki dan mengalir tanpa punya tangan?", a: ["air", "sungai"], hint: "Bisa ditemukan di sungai.", explanation: "Jawabannya air." },
    { category: "Teka-teki", q: "Apa yang semakin basah justru semakin mengeringkan?", a: ["handuk", "lap"], hint: "Dipakai setelah mandi.", explanation: "Jawabannya handuk." },
    { category: "Pengetahuan", q: "Benua tempat Indonesia berada adalah?", a: ["asia", "benua asia"], hint: "Benua terbesar di dunia.", explanation: "Jawabannya Asia." },
    { category: "Logika", q: "Apa yang bisa kamu tangkap tetapi tidak bisa kamu lempar?", a: ["flu", "pilek", "napas", "angin"], hint: "Bisa berkaitan dengan kesehatan.", explanation: "Salah satu jawaban yang umum adalah flu atau pilek." },
    { category: "Teka-teki", q: "Apa yang punya halaman tetapi bukan rumah?", a: ["buku"], hint: "Bisa dibaca.", explanation: "Jawabannya buku." },
    { category: "Pengetahuan", q: "Apa lambang kimia untuk air?", a: ["h2o", "h₂o"], hint: "Terdiri dari hidrogen dan oksigen.", explanation: "Jawabannya H₂O." },
    { category: "Logika", q: "Apa yang punya satu kaki tetapi tidak bisa berjalan?", a: ["gelas", "lampu", "meja berkaki satu"], hint: "Bisa berdiri di atas meja.", explanation: "Jawabannya bisa berupa gelas bertangkai atau lampu berkaki satu." },
    { category: "Teka-teki", q: "Apa yang bisa keliling dunia tetapi tetap berada di sudut?", a: ["perangko", "prangko"], hint: "Ada di amplop surat.", explanation: "Jawabannya perangko." },
    { category: "Pengetahuan", q: "Hewan darat tercepat yang terkenal adalah?", a: ["citah", "cheetah"], hint: "Kucing besar berbintik.", explanation: "Jawabannya citah." }
  ];

  const categories = ["Semua", "Logika", "Lucu", "Teka-teki", "Pengetahuan"];
  let category = "Semua";
  let deck = [];
  let current = null;
  let score = 0;
  let played = 0;
  let hintsUsed = 0;
  let answered = false;
  let streak = 0;
  let bestStreak = 0;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function refillDeck() {
    const pool = questions.filter(q => category === "Semua" || q.category === category);
    deck = shuffle(pool);
  }

  function nextQuestion() {
    if (!deck.length) refillDeck();
    current = deck.pop();
    hintsUsed = 0;
    answered = false;
    renderGame();
  }

  function shell() {
    return `
      <section class="riddle-app">
        <div class="riddle-hero">
          <div class="riddle-orb">🎲</div>
          <p class="riddle-eyebrow">AIGAZ • BRAIN GAME</p>
          <h1>Tebak-Tebakan</h1>
          <p>Asah otak, pecahkan teka-teki, dan kumpulkan skor tertinggi.</p>
        </div>
        <div class="riddle-stats">
          <div><span>SKOR</span><strong id="riddleScore">${score}</strong></div>
          <div><span>DIMAINKAN</span><strong id="riddlePlayed">${played}</strong></div>
          <div><span>STREAK</span><strong id="riddleStreak">${streak} 🔥</strong></div>
        </div>
        <div class="riddle-toolbar">
          <label for="riddleCategory">Kategori soal</label>
          <select id="riddleCategory">
            ${categories.map(c => `<option ${c === category ? "selected" : ""}>${esc(c)}</option>`).join("")}
          </select>
          <button class="riddle-btn riddle-btn-secondary" data-riddle-action="restart">Mulai ulang skor</button>
        </div>
        <div id="riddleQuestion"></div>
      </section>`;
  }

  function questionCard() {
    if (!current) return "";
    return `
      <article class="riddle-card">
        <div class="riddle-card-top">
          <span class="riddle-tag">${esc(current.category)}</span>
          <span class="riddle-number">SOAL ACAK</span>
        </div>
        <h2>${esc(current.q)}</h2>
        <form id="riddleForm" class="riddle-answer-form">
          <input id="riddleAnswer" autocomplete="off" placeholder="Tulis jawabanmu..." ${answered ? "disabled" : ""} required>
          <button class="riddle-btn" type="submit" ${answered ? "disabled" : ""}>Periksa Jawaban</button>
        </form>
        <div class="riddle-actions">
          <button class="riddle-btn riddle-btn-secondary" data-riddle-action="hint" ${answered ? "disabled" : ""}>💡 Petunjuk</button>
          <button class="riddle-btn riddle-btn-secondary" data-riddle-action="reveal" ${answered ? "disabled" : ""}>Lihat Jawaban</button>
          <button class="riddle-btn" data-riddle-action="next">Soal Berikutnya →</button>
        </div>
        <p id="riddleHint" class="riddle-hint">${hintsUsed ? `💡 ${esc(current.hint)}` : ""}</p>
        <div id="riddleFeedback" class="riddle-feedback" aria-live="polite"></div>
      </article>`;
  }

  function renderGame() {
    const host = document.querySelector("#content");
    if (!host) return;
    host.innerHTML = shell();
    const categorySelect = document.querySelector("#riddleCategory");
    if (categorySelect) categorySelect.value = category;
    const questionHost = document.querySelector("#riddleQuestion");
    if (questionHost) questionHost.innerHTML = questionCard();
    updateStats();
  }

  function updateStats() {
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("riddleScore", score);
    set("riddlePlayed", played);
    set("riddleStreak", `${streak} 🔥`);
  }

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("id-ID")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function checkAnswer(value) {
    if (!current || answered) return;
    const answer = normalize(value);
    if (!answer) return;

    const accepted = current.a.map(normalize);
    const correct = accepted.includes(answer);

    answered = true;
    played++;

    if (correct) {
      const points = hintsUsed ? 5 : 10;
      score += points;
      streak++;
      bestStreak = Math.max(bestStreak, streak);
      showFeedback(`Benar! +${points} poin. ${current.explanation}`, true);
    } else {
      streak = 0;
      showFeedback(`Belum tepat. Jawaban yang benar: ${current.a[0]}. ${current.explanation}`, false);
    }

    const input = document.querySelector("#riddleAnswer");
    const button = document.querySelector('#riddleForm button[type="submit"]');
    if (input) input.disabled = true;
    if (button) button.disabled = true;
    updateStats();
  }

  function showFeedback(message, correct) {
    const feedback = document.querySelector("#riddleFeedback");
    if (!feedback) return;
    feedback.className = `riddle-feedback ${correct ? "is-correct" : "is-wrong"}`;
    feedback.textContent = message;
  }

  function revealAnswer() {
    if (!current || answered) return;
    answered = true;
    played++;
    streak = 0;
    showFeedback(`Jawabannya: ${current.a[0]}. ${current.explanation}`, false);
    const input = document.querySelector("#riddleAnswer");
    const button = document.querySelector('#riddleForm button[type="submit"]');
    if (input) input.disabled = true;
    if (button) button.disabled = true;
    updateStats();
  }

  function showHint() {
    if (!current || answered || hintsUsed) return;
    hintsUsed = 1;
    const hint = document.querySelector("#riddleHint");
    if (hint) hint.textContent = `💡 Petunjuk: ${current.hint}`;
  }

  function resetGame() {
    score = 0;
    played = 0;
    streak = 0;
    bestStreak = 0;
    refillDeck();
    nextQuestion();
  }

  function renderPage() {
    if (!current) nextQuestion();
    return shell();
  }

  document.addEventListener("submit", (event) => {
    if (event.target.id !== "riddleForm") return;
    event.preventDefault();
    checkAnswer(document.querySelector("#riddleAnswer")?.value);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-riddle-action]");
    if (!button) return;
    const action = button.dataset.riddleAction;
    if (action === "next") nextQuestion();
    if (action === "hint") showHint();
    if (action === "reveal") revealAnswer();
    if (action === "restart") resetGame();
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "riddleCategory") {
      category = event.target.value;
      refillDeck();
      nextQuestion();
    }
  });

  window.AIGAZRiddles = { renderPage };
})();
