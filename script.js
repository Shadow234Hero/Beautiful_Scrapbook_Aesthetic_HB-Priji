/* =====================================================================
   PRIJI GIFT SITE & PUZZLES - Unified Script
   ===================================================================== */
(() => {
  "use strict";
  const C = window.SITE_CONFIG;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------------- Torn Paper Clip Path Generator ---------------- */
  const rng = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  function tearPath(sides, amp, seed) {
    const n = 28, r = rng(seed), j = () => (r() * amp).toFixed(1);
    const has = k => sides.includes(k) || sides.includes("all");
    const p = [];
    for (let i = 0; i <= n; i++)  p.push(`${(i / n * 100).toFixed(2)}% ${has("top") ? j() : 0}px`);
    for (let i = 1; i <= n; i++)  p.push(`calc(100% - ${has("right") ? j() : 0}px) ${(i / n * 100).toFixed(2)}%`);
    for (let i = n - 1; i >= 0; i--) p.push(`${(i / n * 100).toFixed(2)}% calc(100% - ${has("bottom") ? j() : 0}px)`);
    for (let i = n - 1; i >= 1; i--) p.push(`${has("left") ? j() : 0}px ${(i / n * 100).toFixed(2)}%`);
    return `polygon(${p.join(",")})`;
  }
  $$("[data-torn]").forEach((node, i) => {
    node.style.clipPath = tearPath((node.dataset.torn || "all").split(" "), +node.dataset.amp || 5, 11 + i * 7);
  });

  /* ---------------- Web Sticker SVG ---------------- */
  function webSVG() {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#bb1f2b" stroke="#14090a" stroke-width="4.5"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#fff6e8" stroke-width="1.6" stroke-dasharray="3 5" opacity=".7"/>
      <path d="M50 50L50 4M50 50L96 50M50 50L50 96M50 50L4 50" stroke="#14090a" stroke-width="2.3"/>
    </svg>`;
  }
  $$("[data-web]").forEach(n => (n.innerHTML = webSVG()));

  /* ---------------- Fill Content from Config ---------------- */
  document.title = C.pageTitle || document.title;
  $$("[data-strip]").forEach(n => (n.textContent = C.stripText));
  $("#pass-title").textContent = C.passTitle;
  $("#p-photo").src  = C.photos.passcode;
  $("#i-photo").src  = C.photos.intro;
  $("#g1-photo").src = C.photos.gift1;
  $("#g2-photo").src = C.photos.gift2;
  $("#i-l1").textContent = C.introLine1;
  $("#i-l2").textContent = C.introLine2;
  $("#i-date").textContent = C.introDate;
  $("#i-hint").textContent = C.introHint;
  $("#hub-title").textContent = C.giftsTitle;
  $("#g2-title").textContent = C.gift2.title;
  $("#g2-cap").textContent = C.gift2.caption;

  C.gift2.reasons.forEach(t => $("#g2-list").appendChild(el("li", "", t)));

  const g1 = $("#g1-text");
  g1.appendChild(el("p", "greet", C.gift1.greeting));
  C.gift1.paragraphs.forEach(t => g1.appendChild(el("p", "", t)));
  const s1 = el("p", "sign", C.gift1.signoff);
  s1.appendChild(el("b", "", C.signature || C.gift1.signature));
  g1.appendChild(s1);

  const g3 = $("#g3-text");
  C.gift3.paragraphs.forEach(t => g3.appendChild(el("p", "", t)));
  g3.appendChild(el("p", "sign", C.gift3.signature));

  C.photos.strip.forEach((src, i) => {
    const im = el("img"); im.src = src; im.alt = `Memory ${i + 1}`;
    $("#film").appendChild(im);
  });

  /* ---------------- Screen Management ---------------- */
  const screens = Object.fromEntries($$(".screen").map(s => [s.id.replace("s-", ""), s]));
  let current = "pass", introTimer = null;

  function show(name) {
    Object.entries(screens).forEach(([k, node]) => {
      const on = k === name;
      node.classList.toggle("active", on);
      node.inert = !on;
      node.setAttribute("aria-hidden", String(!on));
      if (on) node.scrollTop = 0;
    });
    current = name;
    document.body.dataset.screen = name;
    clearTimeout(introTimer);
    if (name === "intro") {
      introTimer = setTimeout(() => { if (current === "intro") show("hub"); }, C.introAutoMs || 7000);
    }
  }

  /* ---------------- Background Music ---------------- */
  const bgm = $("#bgm"), muteBtn = $("#mute");
  let started = false;
  if (C.music) bgm.src = C.music; else muteBtn.style.display = "none";

  function startMusic() {
    if (!C.music || started) return;
    started = true;
    bgm.volume = 0;
    const p = bgm.play();
    const fadeIn = () => {
      let v = 0;
      const t = setInterval(() => { v = Math.min(.8, v + .05); bgm.volume = v; if (v >= .8) clearInterval(t); }, 120);
    };
    if (p && p.then) p.then(fadeIn).catch(() => { started = false; });
    else fadeIn();
  }
  ["pointerdown", "keydown", "touchstart"].forEach(ev =>
    window.addEventListener(ev, startMusic, { passive: true }));

  muteBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (!started) { startMusic(); return; }
    bgm.muted = !bgm.muted;
    muteBtn.classList.toggle("off", bgm.muted);
  });

  /* ---------------- Passcode Keypad ---------------- */
  const len = String(C.passcode).length;
  const slotsEl = $("#slots"), wrongEl = $("#wrong"), keysEl = $("#keys");
  let buf = "", peek = false, peekT = null, locked = false;

  for (let i = 0; i < len; i++) slotsEl.appendChild(el("span", "slot"));
  const slotNodes = $$(".slot", slotsEl);

  function paint() {
    slotNodes.forEach((s, i) => {
      s.textContent = i < buf.length ? (peek && i === buf.length - 1 ? buf[i] : "♥") : "";
      s.classList.toggle("on", i < buf.length);
    });
  }

  ["1","2","3","4","5","6","7","8","9","0","#"].forEach(k => {
    const b = el("button", "key", k);
    b.type = "button";
    b.addEventListener("click", () => (k === "#" ? back() : press(k)));
    keysEl.appendChild(b);
  });

  function press(d) {
    if (locked || buf.length >= len) return;
    buf += d; peek = true; paint();
    clearTimeout(peekT);
    peekT = setTimeout(() => { peek = false; paint(); }, 420);
    if (buf.length === len) { locked = true; setTimeout(check, 480); }
  }
  function back() { if (locked) return; buf = buf.slice(0, -1); peek = false; paint(); }

  function check() {
    if (buf === String(C.passcode)) {
      slotsEl.classList.add("ok");
      setTimeout(() => { show("intro"); locked = false; buf = ""; paint(); slotsEl.classList.remove("ok"); }, 650);
    } else {
      wrongEl.textContent = C.wrongText;
      wrongEl.classList.add("on");
      slotsEl.classList.add("shake");
      setTimeout(() => { buf = ""; peek = false; paint(); slotsEl.classList.remove("shake"); locked = false; }, 560);
      setTimeout(() => wrongEl.classList.remove("on"), 2200);
    }
  }

  /* ---------------- Navigation Events ---------------- */
  $(".intro-grid").addEventListener("click", () => show("hub"));

  function burst(x, y) {
    for (let i = 0; i < 14; i++) {
      const h = el("i", "burst", "♥");
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      h.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--r:${(Math.random() - .5) * 90}deg;font-size:${14 + Math.random() * 16}px`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1000);
    }
  }

  $$(".gift").forEach(g => g.addEventListener("click", e => {
    const r = g.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
    setTimeout(() => show("g" + g.dataset.gift), 500);
  }));

  $$("[data-back]").forEach(b => b.addEventListener("click", () => show("hub")));

  /* ---------------- Hub Tab Navigation ---------------- */
  $$(".tab-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.tab;
    $$(".stage-view").forEach(v => v.classList.remove("active"));
    if (target === "gifts-view") $("#v-gifts").classList.add("active");
    else $("#v-puzzles").classList.add("active");
  }));

  /* ---------------- Render Puzzle Chapter Tickets ---------------- */
  const unlockedChapters = new Set(["ch1"]);

  function renderTickets() {
    const grid = $("#chapter-tickets");
    grid.innerHTML = "";
    C.puzzles.forEach(p => {
      const isUnlocked = unlockedChapters.has(p.id);
      const ticket = el("div", `ticket-card ${isUnlocked ? "unlocked" : "locked"}`);
      ticket.innerHTML = `
        <div class="ticket-num">CHAPTER ${p.num}</div>
        <div class="ticket-title">${p.title}</div>
        <div class="ticket-status ${isUnlocked ? "unlocked" : ""}">${isUnlocked ? "🔓 Tap to Play" : "🔒 Complete Ch " + (parseInt(p.num)-1) + " First"}</div>
      `;
      if (isUnlocked) {
        ticket.addEventListener("click", () => show(p.id));
      }
      grid.appendChild(ticket);
    });
  }
  renderTickets();

  function unlockNext(currentId) {
    const idx = C.puzzles.findIndex(p => p.id === currentId);
    if (idx !== -1 && idx + 1 < C.puzzles.length) {
      unlockedChapters.add(C.puzzles[idx + 1].id);
      renderTickets();
    }
  }

  /* ---------------- 11 PUZZLE GAME LOGIC ---------------- */

  // Chapter 1: Love Meter
  let dialVal = 100;
  $("#dial-plus").addEventListener("click", () => {
    dialVal = Math.min(500, dialVal + 50);
    $("#dial-val").textContent = dialVal + "%";
  });
  $("#dial-minus").addEventListener("click", () => {
    dialVal = Math.max(50, dialVal - 50);
    $("#dial-val").textContent = dialVal + "%";
  });
  $("#ch1-check").addEventListener("click", () => {
    if (dialVal === 500) {
      alert("Correct! 500% Be-Intehaan Love! Chapter 1 Solved ♥");
      unlockNext("ch1");
      show("hub");
    } else {
      alert("Try making it 500%!");
    }
  });

  // Chapter 2: Memory Card Game
  const memImages = [
    C.photos.passcode, C.photos.intro, C.photos.gift1, C.photos.gift2
  ];
  let memCards = [...memImages, ...memImages].sort(() => Math.random() - .5);
  let flipped = [], matchedCount = 0;

  function initMemory() {
    const board = $("#memory-board");
    board.innerHTML = "";
    memCards.forEach((src, idx) => {
      const card = el("div", "mem-card");
      card.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-front">♥</div>
          <div class="mem-back"><img src="${src}" alt="Mem"></div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (card.classList.contains("flipped") || flipped.length >= 2) return;
        card.classList.add("flipped");
        flipped.push({ card, src });
        if (flipped.length === 2) {
          if (flipped[0].src === flipped[1].src) {
            matchedCount++;
            flipped = [];
            $("#mem-status").textContent = `Matches: ${matchedCount} / 4`;
            if (matchedCount === 4) {
              setTimeout(() => {
                alert("You matched all memories! Chapter 2 Solved ♥");
                unlockNext("ch2");
                show("hub");
              }, 400);
            }
          } else {
            setTimeout(() => {
              flipped.forEach(f => f.card.classList.remove("flipped"));
              flipped = [];
            }, 800);
          }
        }
      });
      board.appendChild(card);
    });
  }
  initMemory();

  // Chapter 3: Flirt Riddles
  const riddleWords = ["YOU", "MAKE", "OMM", "BLUSH"];
  let chosenWords = [];
  const pool = $("#riddle-tiles-pool"), zone = $("#riddle-answer-zone");

  function initRiddles() {
    pool.innerHTML = ""; zone.innerHTML = ""; chosenWords = [];
    [...riddleWords].sort(() => Math.random() - .5).forEach(word => {
      const tile = el("button", "word-tile", word);
      tile.addEventListener("click", () => {
        if (tile.classList.contains("used")) return;
        tile.classList.add("used");
        chosenWords.push(word);
        const ansTile = el("span", "word-tile", word);
        zone.appendChild(ansTile);
      });
      pool.appendChild(tile);
    });
  }
  initRiddles();
  $("#riddle-reset").addEventListener("click", initRiddles);
  $("#riddle-submit").addEventListener("click", () => {
    if (chosenWords.join(" ") === "YOU MAKE OMM BLUSH") {
      alert("Awww! Correct! Chapter 3 Solved ♥");
      unlockNext("ch3");
      show("hub");
    } else {
      alert("Try putting the words in order: 'YOU MAKE OMM BLUSH'");
    }
  });

  // Chapter 4: Secret Words Anagram
  $("#anagram-check").addEventListener("click", () => {
    const val = $("#anagram-input").value.trim().toUpperCase();
    if (val === "I LOVE YOU") {
      alert("Three simple words, forever true! Chapter 4 Solved ♥");
      unlockNext("ch4");
      show("hub");
    } else {
      alert("Try 'I LOVE YOU'");
    }
  });

  // Chapter 5: Simon Pattern & Voice Note
  let simonSeq = [0, 1, 2, 3], playerSeq = [];
  const pads = $$(".heart-pad");

  $("#simon-start").addEventListener("click", () => {
    playerSeq = [];
    $("#simon-status").textContent = "Watch carefully...";
    simonSeq.forEach((padIdx, step) => {
      setTimeout(() => {
        pads[padIdx].classList.add("lit");
        setTimeout(() => pads[padIdx].classList.remove("lit"), 400);
      }, step * 700 + 400);
    });
    setTimeout(() => {
      $("#simon-status").textContent = "Now repeat the pattern!";
    }, simonSeq.length * 700 + 400);
  });

  pads.forEach((pad, idx) => {
    pad.addEventListener("click", () => {
      pad.classList.add("lit");
      setTimeout(() => pad.classList.remove("lit"), 300);
      playerSeq.push(idx);
      if (playerSeq[playerSeq.length - 1] !== simonSeq[playerSeq.length - 1]) {
        $("#simon-status").textContent = "Wrong sequence! Tap 'Start Pattern' to try again.";
        playerSeq = [];
        return;
      }
      if (playerSeq.length === simonSeq.length) {
        $("#simon-status").textContent = "Pattern complete!";
        $("#voice-player").style.display = "block";
        alert("Voice Note Unlocked! Chapter 5 Solved ♥");
        unlockNext("ch5");
      }
    });
  });

  // Chapter 6: Quiz
  const quizData = [
    { q: "What is Omm's absolute favourite thing about Priji?", opts: ["Her laugh", "Her smile & eyes", "Her cooking", "Her sense of humor"], ans: 1 },
    { q: "What does Omm promise Priji forever?", opts: ["To bring chocolates", "To love her unconditionally", "To play video games", "To take her shopping"], ans: 1 }
  ];
  let qIdx = 0;

  function renderQuiz() {
    const qBox = $("#quiz-container");
    if (qIdx >= quizData.length) {
      qBox.innerHTML = "<p class='quiz-done'>You answered all questions correctly! Chapter 6 Solved ♥</p>";
      unlockNext("ch6");
      setTimeout(() => show("hub"), 1200);
      return;
    }
    const curr = quizData[qIdx];
    qBox.innerHTML = `
      <p class="quiz-q">${curr.q}</p>
      <div class="quiz-opts">
        ${curr.opts.map((opt, i) => `<button class="scrap-btn q-opt" data-opt="${i}">${opt}</button>`).join("")}
      </div>
    `;
    $$(".q-opt", qBox).forEach(b => b.addEventListener("click", e => {
      const choice = parseInt(e.target.dataset.opt);
      if (choice === curr.ans) {
        alert("Correct!");
        qIdx++;
        renderQuiz();
      } else {
        alert("Try again!");
      }
    }));
  }
  renderQuiz();

  // Chapter 7: Catch Falling Hearts
  let caughtHearts = 0;
  $("#catch-start").addEventListener("click", () => {
    caughtHearts = 0;
    $("#catch-count").textContent = "0";
    const playfield = $("#catch-playfield");
    playfield.innerHTML = "";

    const interval = setInterval(() => {
      if (caughtHearts >= 14) {
        clearInterval(interval);
        alert("Awesome! You caught 14 hearts! Chapter 7 Solved ♥");
        unlockNext("ch7");
        show("hub");
        return;
      }
      const h = el("div", "falling-heart");
      h.innerHTML = `<svg viewBox="0 0 100 100"><use href="#i-heart"/></svg>`;
      h.style.left = Math.random() * 85 + "%";
      h.style.top = "0px";
      h.addEventListener("click", () => {
        caughtHearts++;
        $("#catch-count").textContent = caughtHearts;
        h.remove();
      });
      playfield.appendChild(h);
      setTimeout(() => h.remove(), 3000);
    }, 600);
  });

  // Chapter 8: Image Revealing Sudoku
  function initSudoku() {
    const grid = $("#sudoku-grid");
    const board = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];
    const userBoard = [
      [1, 0, 0, 4],
      [3, 0, 0, 2],
      [2, 0, 0, 3],
      [4, 0, 0, 1]
    ];
    grid.innerHTML = "";
    for(let r=0; r<4; r++) {
      for(let c=0; c<4; c++) {
        const cell = el("div", `s-cell ${userBoard[r][c] !== 0 ? "fixed" : ""}`, userBoard[r][c] !== 0 ? userBoard[r][c] : "");
        cell.dataset.r = r; cell.dataset.c = c;
        if (userBoard[r][c] === 0) {
            cell.addEventListener("click", () => {
                activeCell = cell;
                $$(".s-cell").forEach(c => c.style.background = "#fbf8ef");
                cell.style.background = "#f2b8c6";
            });
        }
        grid.appendChild(cell);
      }
    }
    let activeCell = null;
    $("#sudoku-clear").addEventListener("click", () => {
        if(activeCell) activeCell.textContent = "";
    });
    $$(".sudoku-num").forEach(btn => btn.addEventListener("click", () => {
      if (!activeCell || activeCell.classList.contains("fixed")) return;
      activeCell.textContent = btn.dataset.num;
      let filled = true;
      $$(".s-cell").forEach(cell => {
          const r = cell.dataset.r, c = cell.dataset.c;
          if(cell.textContent != board[r][c]) filled = false;
      });
      if (filled) {
        alert("Sudoku Solved! Photo Revealed! Chapter 8 Complete ♥");
        unlockNext("ch8");
        show("hub");
      }
    }));
  }
  initSudoku();

  // Chapter 9: HTML5 Canvas Scratch Card
  const canvas = $("#scratch-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f2b8c6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 24px Caveat";
    ctx.fillStyle = "#7a1420";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Me ♥", canvas.width / 2, canvas.height / 2);

    let scratching = false;
    function scratch(e) {
      if (!scratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    canvas.addEventListener("mousedown", () => scratching = true);
    canvas.addEventListener("mouseup", () => {
      scratching = false;
      unlockNext("ch9");
    });
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("touchstart", () => scratching = true);
    canvas.addEventListener("touchend", () => scratching = false);
    canvas.addEventListener("touchmove", scratch);
  }

  // Chapter 10: Balloon Spelling (P-R-I-J-I)
  const spellTarget = ["P", "R", "I", "J", "I"];
  let spelledSoFar = [];

  function initBalloons() {
    spelledSoFar = [];
    $$(".b-slot").forEach(s => s.textContent = "_");
    const field = $("#balloons-field");
    field.innerHTML = "";
    ["J", "P", "I", "R", "I"].sort(() => Math.random() - .5).forEach(ltr => {
      const btn = el("button", "balloon-btn", ltr);
      btn.addEventListener("click", () => {
        btn.classList.add("popped");
        spelledSoFar.push(ltr);
        $$(".b-slot")[spelledSoFar.length - 1].textContent = ltr;
        if (spelledSoFar.join("") === "PRIJI") {
          setTimeout(() => {
            alert("Spelled PRIJI correctly! Chapter 10 Solved ♥");
            unlockNext("ch10");
            show("hub");
          }, 300);
        } else if (spelledSoFar.length === 5) {
          setTimeout(initBalloons, 600);
        }
      });
      field.appendChild(btn);
    });
  }
  initBalloons();
  $("#balloon-reset").addEventListener("click", initBalloons);

  // Chapter 11: Find My Heart Cup Game (Real Sliding Version)
  let cupWins = 0;
  let heartPos = 1; // 0, 1, or 2
  let cupPositions = [0, 1, 2]; // Current left positions [10, 110, 210]
  let isShuffling = false;

  const cups = $$("#s-ch11 .cup-btn");
  const heart = $("#heart-target");
  const leftMap = [10, 110, 210];

  $("#cup-shuffle-btn").addEventListener("click", () => {
    if (isShuffling) return;
    isShuffling = true;
    $("#cup-shuffle-btn").disabled = true;

    // 1. Reveal heart
    heartPos = Math.floor(Math.random() * 3);
    heart.style.left = leftMap[heartPos] + "px";
    heart.classList.add("visible");
    cups[heartPos].classList.add("lifted");

    setTimeout(() => {
      // 2. Hide heart and drop cup
      cups[heartPos].classList.remove("lifted");
      heart.classList.remove("visible");

      setTimeout(() => {
        // 3. Shuffle positions
        let shuffles = 0;
        const interval = setInterval(() => {
          // Swap two random indices
          let a = Math.floor(Math.random() * 3);
          let b = Math.floor(Math.random() * 3);
          while(a === b) b = Math.floor(Math.random() * 3);

          // Swap them in our tracking array
          [cupPositions[a], cupPositions[b]] = [cupPositions[b], cupPositions[a]];

          // Update actual CSS left positions
          cups.forEach((c, idx) => {
            c.style.left = leftMap[cupPositions.indexOf(idx)] + "px";
          });

          shuffles++;
          if (shuffles > 7) {
            clearInterval(interval);
            isShuffling = false;
            $("#cup-shuffle-btn").disabled = false;
          }
        }, 500);
      }, 500);
    }, 1200);
  });

  cups.forEach((cup, idx) => {
    cup.addEventListener("click", () => {
      if (isShuffling || cup.classList.contains("lifted")) return;

      cup.classList.add("lifted");
      const currentPos = cupPositions.indexOf(idx);

      if (currentPos === heartPos) {
        heart.style.left = leftMap[currentPos] + "px";
        heart.classList.add("visible");
        cupWins++;
        $("#cup-wins").textContent = cupWins;
        if (cupWins >= 3) {
          setTimeout(() => {
            alert("Perfect! You found Omm's heart 3 times! Finale Unlocked ♥");
            unlockNext("ch11");
            show("finale");
          }, 600);
        } else {
          setTimeout(() => {
            alert("Found it! Solve " + (3 - cupWins) + " more!");
            cup.classList.remove("lifted");
            heart.classList.remove("visible");
          }, 800);
        }
      } else {
        alert("Not there! Watch closely next time.");
        setTimeout(() => cup.classList.remove("lifted"), 800);
      }
    });
  });

  // Finale: Birthday Candles Blowing
  $$(".candle").forEach(candle => {
    candle.addEventListener("click", () => {
      candle.classList.remove("lit");
      candle.classList.add("out");
      if ($$(".candle.lit").length === 0) {
        alert("Happy Birthday Priji! 🎉 All candles blown out!");
      }
    });
  });

  /* Initialize passcode screen */
  show("pass");
})();
