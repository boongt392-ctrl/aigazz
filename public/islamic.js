
(() => {
  const API_QURAN = "https://api.alquran.cloud/v1";
  const API_PRAYER = "https://api.aladhan.com/v1";

  const duas = [
    {
      title: "Doa sebelum makan",
      arabic: "بِسْمِ اللَّهِ",
      latin: "Bismillah",
      meaning: "Dengan nama Allah."
    },
    {
      title: "Doa sesudah makan",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      latin: "Alhamdulillahil-ladzi ath'amani hadza wa razaqanihi min ghairi haulin minni wa la quwwah.",
      meaning: "Segala puji bagi Allah yang telah memberiku makanan ini dan memberiku rezeki tanpa daya dan kekuatanku."
    },
    {
      title: "Doa sebelum tidur",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      latin: "Bismika Allahumma amutu wa ahya.",
      meaning: "Dengan nama-Mu ya Allah, aku mati dan aku hidup."
    },
    {
      title: "Doa bangun tidur",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      latin: "Alhamdulillahil-ladzi ahyana ba'da ma amatana wa ilaihin-nusyur.",
      meaning: "Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami dan kepada-Nya kami dibangkitkan."
    },
    {
      title: "Doa masuk kamar mandi",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
      latin: "Allahumma inni a'udzu bika minal khubutsi wal khaba'its.",
      meaning: "Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan."
    },
    {
      title: "Doa keluar rumah",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      latin: "Bismillahi tawakkaltu 'alallah, la haula wa la quwwata illa billah.",
      meaning: "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah."
    },
    {
      title: "Doa memohon ilmu",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      latin: "Rabbi zidni 'ilma.",
      meaning: "Ya Tuhanku, tambahkanlah ilmu kepadaku."
    },
    {
      title: "Doa untuk kebaikan dunia dan akhirat",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      latin: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adzaban-nar.",
      meaning: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari azab neraka."
    }
  ];

  const names = [
    ["Ar-Rahman", "Maha Pengasih"],
    ["Ar-Rahim", "Maha Penyayang"],
    ["Al-Malik", "Maha Merajai"],
    ["Al-Quddus", "Maha Suci"],
    ["As-Salam", "Maha Pemberi Keselamatan"],
    ["Al-Mu'min", "Maha Pemberi Keamanan"],
    ["Al-Muhaimin", "Maha Memelihara"],
    ["Al-Aziz", "Maha Perkasa"],
    ["Al-Jabbar", "Maha Kuasa"],
    ["Al-Mutakabbir", "Maha Megah"],
    ["Al-Khaliq", "Maha Pencipta"],
    ["Al-Bari'", "Maha Mengadakan"],
    ["Al-Musawwir", "Maha Membentuk Rupa"],
    ["Al-Ghaffar", "Maha Pengampun"],
    ["Al-Qahhar", "Maha Menundukkan"],
    ["Al-Wahhab", "Maha Pemberi Karunia"],
    ["Ar-Razzaq", "Maha Pemberi Rezeki"],
    ["Al-Fattah", "Maha Pembuka Rahmat"],
    ["Al-Alim", "Maha Mengetahui"],
    ["Al-Qabid", "Maha Menyempitkan"],
    ["Al-Basit", "Maha Melapangkan"],
    ["Al-Khafid", "Maha Merendahkan"],
    ["Ar-Rafi", "Maha Meninggikan"],
    ["Al-Mu'izz", "Maha Memuliakan"],
    ["Al-Mudzill", "Maha Menghinakan"],
    ["As-Sami", "Maha Mendengar"],
    ["Al-Basir", "Maha Melihat"],
    ["Al-Hakam", "Maha Menetapkan"],
    ["Al-Adl", "Maha Adil"],
    ["Al-Latif", "Maha Lembut"],
    ["Al-Khabir", "Maha Mengenal"],
    ["Al-Halim", "Maha Penyantun"],
    ["Al-Azim", "Maha Agung"],
    ["Al-Ghafur", "Maha Pengampun"],
    ["Asy-Syakur", "Maha Pembalas Budi"],
    ["Al-Aliyy", "Maha Tinggi"],
    ["Al-Kabir", "Maha Besar"],
    ["Al-Hafiz", "Maha Memelihara"],
    ["Al-Muqit", "Maha Pemberi Kecukupan"],
    ["Al-Hasib", "Maha Membuat Perhitungan"],
    ["Al-Jalil", "Maha Luhur"],
    ["Al-Karim", "Maha Pemurah"],
    ["Ar-Raqib", "Maha Mengawasi"],
    ["Al-Mujib", "Maha Mengabulkan"],
    ["Al-Wasi", "Maha Luas"],
    ["Al-Hakim", "Maha Bijaksana"],
    ["Al-Wadud", "Maha Mengasihi"],
    ["Al-Majid", "Maha Mulia"],
    ["Al-Ba'its", "Maha Membangkitkan"],
    ["Asy-Syahid", "Maha Menyaksikan"],
    ["Al-Haqq", "Maha Benar"],
    ["Al-Wakil", "Maha Memelihara"],
    ["Al-Qawiyy", "Maha Kuat"],
    ["Al-Matin", "Maha Kokoh"],
    ["Al-Waliyy", "Maha Melindungi"],
    ["Al-Hamid", "Maha Terpuji"],
    ["Al-Muhsi", "Maha Menghitung"],
    ["Al-Mubdi", "Maha Memulai"],
    ["Al-Mu'id", "Maha Mengembalikan"],
    ["Al-Muhyi", "Maha Menghidupkan"],
    ["Al-Mumit", "Maha Mematikan"],
    ["Al-Hayy", "Maha Hidup"],
    ["Al-Qayyum", "Maha Mandiri"],
    ["Al-Wajid", "Maha Menemukan"],
    ["Al-Maajid", "Maha Mulia"],
    ["Al-Wahid", "Maha Esa"],
    ["Al-Ahad", "Maha Tunggal"],
    ["As-Samad", "Tempat Bergantung"],
    ["Al-Qadir", "Maha Menentukan"],
    ["Al-Muqtadir", "Maha Berkuasa"],
    ["Al-Muqaddim", "Maha Mendahulukan"],
    ["Al-Mu'akhkhir", "Maha Mengakhirkan"],
    ["Al-Awwal", "Maha Awal"],
    ["Al-Akhir", "Maha Akhir"],
    ["Az-Zahir", "Maha Nyata"],
    ["Al-Batin", "Maha Tersembunyi"],
    ["Al-Wali", "Maha Memerintah"],
    ["Al-Muta'ali", "Maha Tinggi"],
    ["Al-Barr", "Maha Dermawan"],
    ["At-Tawwab", "Maha Penerima Tobat"],
    ["Al-Muntaqim", "Maha Pemberi Balasan"],
    ["Al-Afuww", "Maha Pemaaf"],
    ["Ar-Ra'uf", "Maha Pengasih"],
    ["Malikul-Mulk", "Maha Penguasa Kerajaan"],
    ["Dzul-Jalali wal-Ikram", "Pemilik Kebesaran dan Kemuliaan"],
    ["Al-Muqsit", "Maha Adil"],
    ["Al-Jami", "Maha Mengumpulkan"],
    ["Al-Ghaniyy", "Maha Kaya"],
    ["Al-Mughni", "Maha Pemberi Kekayaan"],
    ["Al-Mani", "Maha Mencegah"],
    ["Ad-Darr", "Maha Penimpa Kemudaratan"],
    ["An-Nafi", "Maha Pemberi Manfaat"],
    ["An-Nur", "Maha Bercahaya"],
    ["Al-Hadi", "Maha Pemberi Petunjuk"],
    ["Al-Badi", "Maha Pencipta Tanpa Contoh"],
    ["Al-Baqi", "Maha Kekal"],
    ["Al-Warith", "Maha Pewaris"],
    ["Ar-Rasyid", "Maha Membimbing"],
    ["As-Sabur", "Maha Sabar"]
  ];

  let currentView = "home";
  let surahs = [];
  let selectedSurah = 1;
  let selectedAyah = null;
  let tasbihCount = 0;
  let tasbihTarget = 33;
  let prayerCity = "Palembang";
  let prayerData = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);

  function shell(title, body) {
    return `
      <section class="islamic-app">
        <div class="islamic-hero">
          <div class="islamic-ornament">☪</div>
          <p class="islamic-eyebrow">AIGAZ • ISLAMIC CENTER</p>
          <h1>${title}</h1>
          <p>Ruang ibadah, ilmu, dan ketenangan.</p>
        </div>
        <nav class="islamic-tabs">
          ${[
            ["home", "Beranda"],
            ["quran", "Al-Qur'an"],
            ["duas", "Doa Harian"],
            ["tasbih", "Tasbih"],
            ["prayer", "Jadwal Salat"],
            ["names", "Asmaul Husna"]
          ].map(([id, label]) => `
            <button class="islamic-tab ${currentView === id ? "active" : ""}"
                    data-islamic-view="${id}">${label}</button>
          `).join("")}
        </nav>
        <div class="islamic-content">${body}</div>
      </section>
    `;
  }

  function homeView() {
    return `
      <div class="islamic-welcome">
        <h2>Assalamu'alaikum 🌙</h2>
        <p>Semoga hari ini dipenuhi ketenangan, ilmu, dan keberkahan.</p>
      </div>
      <div class="islamic-grid">
        ${[
          ["quran", "📖", "Al-Qur'an", "114 surah, teks Arab dan terjemahan Indonesia"],
          ["duas", "🤲", "Doa Harian", "Kumpulan doa beserta latin dan artinya"],
          ["tasbih", "📿", "Tasbih Digital", "Hitung zikir dengan target pribadi"],
          ["prayer", "🕌", "Jadwal Salat", "Jadwal salat berdasarkan kota"],
          ["names", "✨", "Asmaul Husna", "Nama-nama Allah dan maknanya"]
        ].map(([id, icon, title, desc]) => `
          <button class="islamic-feature" data-islamic-view="${id}">
            <span>${icon}</span><h3>${title}</h3><p>${desc}</p>
            <b>Buka fitur ↗</b>
          </button>
        `).join("")}
      </div>
      <p class="islamic-note">Teks Al-Qur'an dan terjemahan dimuat dari layanan Al Quran Cloud. Perlu koneksi internet.</p>
    `;
  }

  function quranView() {
    return `
      <div class="islamic-section-head">
        <div><h2>Al-Qur'an</h2><p>Pilih surah untuk membaca ayat dan terjemahannya.</p></div>
      </div>
      <div class="islamic-controls">
        <input id="islamicSurahSearch" placeholder="Cari nama surah..." />
        <select id="islamicSurahSelect">
          <option value="">Memuat daftar surah...</option>
        </select>
      </div>
      <div id="islamicQuranResult" class="islamic-quran-result">
        <p class="islamic-loading">Memuat Al-Qur'an...</p>
      </div>
    `;
  }

  function duasView() {
    return `
      <h2>Doa Harian</h2>
      <p class="islamic-muted">Doa-doa singkat untuk aktivitas sehari-hari.</p>
      <div class="islamic-stack">
        ${duas.map((dua, i) => `
          <article class="islamic-card">
            <div class="islamic-card-top"><span>DOA ${String(i + 1).padStart(2, "0")}</span>
              <button class="islamic-copy" data-copy-doa="${i}">Salin doa</button>
            </div>
            <h3>${esc(dua.title)}</h3>
            <p class="islamic-arabic">${esc(dua.arabic)}</p>
            <p><b>Latin:</b> ${esc(dua.latin)}</p>
            <p><b>Arti:</b> ${esc(dua.meaning)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function tasbihView() {
    return `
      <div class="islamic-tasbih">
        <p class="islamic-eyebrow">DIGITAL TASBIH</p>
        <h2>Hitung zikir</h2>
        <label for="islamicZikir">Bacaan zikir</label>
        <select id="islamicZikir">
          <option>Subhanallah</option>
          <option>Alhamdulillah</option>
          <option>Allahu Akbar</option>
          <option>Astaghfirullah</option>
          <option>La ilaha illallah</option>
          <option>Shalawat</option>
        </select>
        <div class="islamic-count" id="islamicCount">${tasbihCount}</div>
        <p>Target: <strong id="islamicTargetLabel">${tasbihTarget}</strong></p>
        <div class="islamic-controls">
          <label>Target
            <select id="islamicTarget">
              ${[33, 99, 100, 333, 1000].map(n =>
                `<option value="${n}" ${tasbihTarget === n ? "selected" : ""}>${n}</option>`
              ).join("")}
            </select>
          </label>
        </div>
        <button class="islamic-count-button" data-tasbih="add">SUBHANALLAH · +1</button>
        <button class="islamic-reset" data-tasbih="reset">Reset hitungan</button>
        <p id="islamicTasbihMessage" aria-live="polite"></p>
      </div>
    `;
  }

  function prayerView() {
    return `
      <h2>Jadwal Salat</h2>
      <p class="islamic-muted">Pilih kota untuk melihat jadwal harian. Cocokkan dengan jadwal resmi setempat.</p>
      <form id="islamicPrayerForm" class="islamic-controls">
        <input id="islamicCity" value="${esc(prayerCity)}" placeholder="Nama kota, mis. Palembang" required />
        <button type="submit" class="islamic-primary">Cari jadwal</button>
      </form>
      <div id="islamicPrayerResult" class="islamic-prayer-result">
        ${prayerData ? prayerCards(prayerData) : '<p class="islamic-loading">Memuat jadwal salat...</p>'}
      </div>
      <p class="islamic-note">Jadwal dihitung oleh AlAdhan API. Waktu dapat berbeda dari jadwal resmi masjid setempat.</p>
    `;
  }

  function prayerCards(data) {
    const timings = data.timings || {};
    const fields = [
      ["Fajr", "Subuh"], ["Sunrise", "Terbit"], ["Dhuhr", "Zuhur"],
      ["Asr", "Asar"], ["Maghrib", "Magrib"], ["Isha", "Isya"]
    ];
    return `
      <div class="islamic-prayer-grid">
        ${fields.map(([key, label]) => `
          <div class="islamic-prayer-time">
            <span>${label}</span><strong>${esc((timings[key] || "--").split(" ")[0])}</strong>
          </div>
        `).join("")}
      </div>
      <p class="islamic-muted">Tanggal: ${esc(data.date?.readable || "")}</p>
    `;
  }

  function namesView() {
    return `
      <h2>Asmaul Husna</h2>
      <p class="islamic-muted">99 nama Allah beserta makna ringkasnya.</p>
      <div class="islamic-names-grid">
        ${names.map(([name, meaning], i) => `
          <article class="islamic-name-card">
            <span>${String(i + 1).padStart(2, "0")}</span>
            <h3>${esc(name)}</h3><p>${esc(meaning)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderView() {
    const titles = {
      home: "Pusat Islami", quran: "Al-Qur'an", duas: "Doa Harian",
      tasbih: "Tasbih Digital", prayer: "Jadwal Salat", names: "Asmaul Husna"
    };
    const body = {
      home: homeView, quran: quranView, duas: duasView,
      tasbih: tasbihView, prayer: prayerView, names: namesView
    }[currentView]();

    return shell(titles[currentView], body);
  }

  function renderPage() {
    currentView = "home";
    return renderView();
  }

  async function loadSurahList() {
    const select = $("#islamicSurahSelect");
    if (!select) return;

    try {
      const response = await fetch(`${API_QURAN}/surah`);
      if (!response.ok) throw new Error("Gagal mengambil daftar surah");
      const json = await response.json();
      surahs = json.data || [];
      fillSurahSelect();
      loadSurah(selectedSurah);
    } catch (error) {
      const result = $("#islamicQuranResult");
      if (result) result.innerHTML = `<p class="islamic-error">Daftar surah gagal dimuat. Periksa koneksi internet, lalu buka tab Al-Qur'an lagi.</p>`;
    }
  }

  function fillSurahSelect(filter = "") {
    const select = $("#islamicSurahSelect");
    if (!select) return;
    const q = filter.toLowerCase();
    const matching = surahs.filter(s =>
      String(s.englishName || "").toLowerCase().includes(q) ||
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
    select.innerHTML = matching.map(s => `
      <option value="${s.number}" ${Number(s.number) === selectedSurah ? "selected" : ""}>
        ${s.number}. ${esc(s.englishName)} — ${esc(s.name)}
      </option>
    `).join("");
  }

  async function loadSurah(number) {
    const result = $("#islamicQuranResult");
    if (!result) return;

    selectedSurah = Number(number) || 1;
    result.innerHTML = '<p class="islamic-loading">Memuat ayat dan terjemahan...</p>';

    try {
      const response = await fetch(
        `${API_QURAN}/surah/${selectedSurah}/editions/quran-uthmani,id.indonesian`
      );
      if (!response.ok) throw new Error("Gagal mengambil surah");
      const json = await response.json();
      const arabic = json.data?.[0];
      const translation = json.data?.[1];
      if (!arabic || !translation) throw new Error("Data surah tidak lengkap");

      result.innerHTML = `
        <div class="islamic-surah-heading">
          <h3>${esc(arabic.name)}</h3>
          <p>${esc(arabic.englishName)} · ${esc(arabic.englishNameTranslation || "")}</p>
          <p>${esc(arabic.numberOfAyahs)} ayat</p>
        </div>
        ${(arabic.ayahs || []).map((ayah, i) => {
          const translated = translation.ayahs?.[i];
          return `
            <article class="islamic-ayah">
              <div class="islamic-ayah-number">${ayah.numberInSurah}</div>
              <p class="islamic-arabic">${esc(ayah.text)}</p>
              <p class="islamic-translation">${esc(translated?.text || "Terjemahan tidak tersedia")}</p>
            </article>
          `;
        }).join("")}
      `;
    } catch (error) {
      result.innerHTML = '<p class="islamic-error">Surah gagal dimuat. Coba lagi saat koneksi internet stabil.</p>';
    }
  }

  async function loadPrayer() {
    const result = $("#islamicPrayerResult");
    if (!result) return;
    result.innerHTML = '<p class="islamic-loading">Mengambil jadwal salat...</p>';

    try {
      const now = new Date();
      const date = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
      const url = `${API_PRAYER}/timingsByCity/${date}?city=${encodeURIComponent(prayerCity)}&country=Indonesia&method=20`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Gagal mengambil jadwal");
      const json = await response.json();
      if (json.code !== 200 || !json.data) throw new Error("Jadwal tidak tersedia");
      prayerData = json.data;
      result.innerHTML = prayerCards(prayerData);
    } catch (error) {
      result.innerHTML = '<p class="islamic-error">Jadwal gagal dimuat. Periksa nama kota dan koneksi internet.</p>';
    }
  }

  function showView(view) {
    if (!["home", "quran", "duas", "tasbih", "prayer", "names"].includes(view)) return;
    currentView = view;
    const content = $("#content");
    if (!content) return;
    content.innerHTML = renderView();

    if (view === "quran" && surahs.length === 0) loadSurahList();
    if (view === "prayer") loadPrayer();
  }

  document.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-islamic-view]");
    if (viewButton) {
      showView(viewButton.dataset.islamicView);
      return;
    }

    const tasbihButton = event.target.closest("[data-tasbih]");
    if (tasbihButton) {
      if (tasbihButton.dataset.tasbih === "reset") {
        tasbihCount = 0;
        const count = $("#islamicCount");
        if (count) count.textContent = "0";
        const msg = $("#islamicTasbihMessage");
        if (msg) msg.textContent = "Hitungan direset.";
      } else {
        tasbihCount += 1;
        const count = $("#islamicCount");
        if (count) count.textContent = String(tasbihCount);
        const msg = $("#islamicTasbihMessage");
        if (msg) msg.textContent = tasbihCount >= tasbihTarget ? "Target tercapai. Alhamdulillah!" : "";
      }
      return;
    }

    const copyButton = event.target.closest("[data-copy-doa]");
    if (copyButton) {
      const dua = duas[Number(copyButton.dataset.copyDoa)];
      if (dua) {
        const text = `${dua.title}\n${dua.arabic}\n${dua.latin}\nArti: ${dua.meaning}`;
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            copyButton.textContent = "Tersalin ✓";
          }).catch(() => {
            copyButton.textContent = "Gagal menyalin";
          });
        }
      }
    }
  });

  document.addEventListener("change", event => {
    if (event.target.id === "islamicSurahSelect") {
      loadSurah(event.target.value);
    }
    if (event.target.id === "islamicTarget") {
      tasbihTarget = Number(event.target.value) || 33;
      const label = $("#islamicTargetLabel");
      if (label) label.textContent = String(tasbihTarget);
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id === "islamicSurahSearch") {
      fillSurahSelect(event.target.value);
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "islamicPrayerForm") {
      event.preventDefault();
      prayerCity = $("#islamicCity")?.value.trim() || "Palembang";
      loadPrayer();
    }
  });

  window.AIGAZIslamic = { renderPage };
})();
