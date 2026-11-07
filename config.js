/* =====================================================================
   CONFIG.JS - All Content, Passcode, Photos, Text & Puzzle Configuration
   ===================================================================== */
window.SITE_CONFIG = {

  pageTitle: "For Priji ♥",

  /* ---------- PASSCODE ---------- */
  passcode: "0811",                       // Passcode to unlock site
  passTitle: "Enter Passcode",
  wrongText: "Not quite... try again ♥",
  stripText: "PRIJI",                     // Big text on left red strip

  /* ---------- INTRO PAGE ---------- */
  introLine1: "You are my",
  introLine2: "reason to smile",
  introDate:  "01/01/2025",
  introHint:  "tap to open your scrapbook & puzzles",
  introAutoMs: 7000,

  /* ---------- GIFTS PAGE ---------- */
  giftsTitle: "Choose Your Gift",

  /* ---------- MUSIC ---------- */
  music: "assets/music/be-intehaan.mp3",

  /* ---------- PHOTOS ---------- */
  photos: {
    passcode: "assets/photos/photo2.jpg",
    intro:    "assets/photos/photo5.jpg",
    gift1:    "assets/photos/photo1.jpg",
    gift2:    "assets/photos/photo7.jpg",
    strip: [
      "assets/photos/photo6.jpg",
      "assets/photos/photo3.jpg",
      "assets/photos/photo4.jpg",
      "assets/photos/photo2.jpg"
    ]
  },

  /* ---------- GIFT 1 : POSTCARD LETTER ---------- */
  gift1: {
    greeting: "Dear Priji,",
    paragraphs: [
      "As always, I put some efforts in making this beautiful aesthetic website for your beautiful smile to your facee.",
      "idk how to say thank you in the best possible way. Thank You soooooooooooo much for being my favourite person in the entire world.",
      "I love you 3000"
    ],
    signoff: "Always yours,",
    signature: "Omm"
  },

  /* ---------- GIFT 2 : 5 REASONS I LOVE YOU ---------- */
  gift2: {
    title: "Why You??",
    reasons: [
      "You make me the happiest person ever just bcz I am yours😳",
      "aapko tease krne se mujhe sukooon milta h😘",
      "I love how lovely and kind you are to everyone",
      "haaye teri ankhein👀😭😭🫡",
      "Sb faltu likha h idk why you... but always you..."
    ],
    caption: "Hottie 😳"
  },

  /* ---------- GIFT 3 : FILM-STRIP LETTER ---------- */
  gift3: {
    paragraphs: [
      "Looking back at all your photos and memories fills my heart literally rona aajata h dekhte hi😭😭.",
      "No matter how much time passes, my feelings for you only grow deeper and stronger...",
      "Thank you for being MY PRIJI. thank you so so damnn much for everything. Dammm you are mine😳😳."
    ],
    signature: "— Forever & Always, Omm"
  },

  /* ---------- 11 PUZZLE CHAPTERS DATA ---------- */
  puzzles: [
    { id: "ch1", num: "01", title: "Love Meter", desc: "Set the dial to 500% love", targetDial: 500 },
    { id: "ch2", num: "02", title: "Memory Pair Game", desc: "Match photo pairs", pairs: 4 },
    { id: "ch3", num: "03", title: "Riddles", desc: "Unscramble sentence", targetSentence: "YOU MAKE OMM BLUSH" },
    { id: "ch4", num: "04", title: "Secret Words", desc: "Unscramble 5 words", answer: "I LOVE YOU MY PRIJI" },
    { id: "ch5", num: "05", title: "Voice Note Pattern", desc: "Repeat glowing heart pattern", patternLen: 4 },
    { id: "ch6", num: "06", title: "Our Quiz", desc: "Answer questions about us" },
    { id: "ch7", num: "07", title: "Catch Falling Hearts", desc: "Catch 14 hearts", catchTarget: 14 },
    { id: "ch8", num: "08", title: "Memory Jigsaw", desc: "Complete 3x3 photo puzzle" },
    { id: "ch9", num: "09", title: "Scratch Card", desc: "Scratch off secret note" },
    { id: "ch10", num: "10", title: "Balloon Spell", desc: "Spell P-R-I-J-I Ye toh pta hona chahiye" },
    { id: "ch11", num: "11", title: "Find My Heart", desc: "Find heart under cup 3 times" }
  ]
};
