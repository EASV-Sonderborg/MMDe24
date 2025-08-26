/***********************
 * Quiz – Active until Next
 * Philip/ven – fuld fil (java.js)
 ***********************/

/* ====== DATA (eksempel) ======
   Behold dine egne spørgsmål/svar/værdier hvis du allerede har dem.
   Strukturen skal være:
   - questionText: [ "spm1", "spm2", ... ]
   - answerText: [ [ "svar1", "svar2", ... ], [ ... ], ... ]
   - answerValues: [ [ [6 tal], [6 tal], ... ], ... ]  (samme længde som svar pr. spørgsmål)
*/
var familyStats = [
  0, // adventurous
  0, // creative
  0, // chill
  0, // organized
  0, // sporty
  0  // geeky
];

var currentQuestion = 0;

// ==== Eksempeldata (brug dine egne hvis du har) ====
var questionText = [
  "Hvad kan jeres børn bedst lide at lave i deres fritid?",
  "Hvor tit laver I noget sammen som familie?",
  "Er I mest til udendørs eller indendørs aktiviteter?",
  "Hvordan planlægger I typisk weekender?",
  "Hvad tiltaler jer mest på en ferie?",
  "Hvilken slags spil/aktiviteter vælger I oftest?"
];

var answerText = [
  ["Sport/lege",
   "Kreative ting (male, bygge)",
   "Gaming/tech",
   "Ro og hygge",
   "Planlagte ture",
   "Eventyr/udforskning"],
  ["Dagligt",
   "Flere gange om ugen",
   "Hver uge",
   "Hver anden uge",
   "Sjældnere",
   "Når det passer"],
  ["Mest udendørs",
   "Lidt mere udendørs",
   "Lige dele",
   "Lidt mere indendørs",
   "Mest indendørs",
   "Skifter helt efter humør"],
  ["Meget planlagt",
   "Lidt planlagt",
   "Impulsivt",
   "Roligt hjemme",
   "Aktivt ude",
   "Afhænger af vejret"],
  ["Action/oplevelser",
   "Kultur/kreativt",
   "Afslapning",
   "Struktureret sightseeing",
   "Sport og leg",
   "Teknologi og museer"],
  ["Brætspil",
   "Kreative projekter",
   "Computerspil",
   "Puslespil/bøger",
   "Fysiske lege",
   "Bygge-sæt/robotter"]
];

// Hver svarmulighed giver point til 6 typer i rækkefølge: [adv, cre, chill, org, sporty, geeky]
var answerValues = [
  // Q1
  [
    [1,0,0,0,2,0], // Sport/lege
    [0,2,0,0,0,1], // Kreativt
    [0,0,0,0,0,2], // Gaming/tech
    [0,0,2,0,0,0], // Ro/hygge
    [0,0,0,2,0,0], // Planlagt
    [2,0,0,0,0,0]  // Eventyr
  ],
  // Q2
  [
    [0,0,1,1,0,0], // Dagligt
    [0,1,0,1,0,0],
    [1,0,0,1,0,0],
    [0,0,1,0,0,0],
    [0,0,0,0,1,0],
    [1,0,0,0,0,1]
  ],
  // Q3
  [
    [2,0,0,0,1,0], // Mest udendørs
    [1,0,0,0,1,0],
    [1,0,0,0,0,1],
    [0,0,1,0,0,1],
    [0,0,2,0,0,0],
    [1,1,0,0,0,0]
  ],
  // Q4
  [
    [0,0,0,2,0,0], // Meget planlagt
    [0,0,0,1,0,0],
    [1,0,0,0,0,0],
    [0,0,2,0,0,0],
    [1,0,0,0,1,0],
    [0,0,0,0,0,1]
  ],
  // Q5
  [
    [2,0,0,0,1,0], // Action/oplevelser
    [0,2,0,0,0,0], // Kultur/kreativt
    [0,0,2,0,0,0], // Afslapning
    [0,0,0,2,0,0], // Struktureret
    [0,0,0,0,2,0], // Sport
    [0,0,0,0,0,2]  // Tech
  ],
  // Q6
  [
    [0,0,0,1,0,0], // Brætspil
    [0,2,0,0,0,0], // Kreative projekter
    [0,0,0,0,0,2], // Computerspil
    [0,0,2,0,0,0], // Puslespil/bøger
    [1,0,0,0,2,0], // Fysiske lege
    [0,0,0,0,0,2]  // Bygge/robotter
  ]
];

/* ====== UI ELEMENTS ====== */
const quizContainer = document.querySelector(".quizSection"); // kan være en overordnet wrapper
const answersWrap   = document.getElementById("answers");
const questionEl    = document.getElementById("question");
const nextBtn       = document.querySelector(".buttonNext");
const resultBox     = document.getElementById("result");
const personalityEl = document.getElementById("personality");
const retryBtn      = document.getElementById("reTry");

/* ====== VISUELT VALG (ACTIVE) – INGEN SCORING HER ======
   - Klik på svar: aktivér .active på det ene, fjern på de andre
   - Klik igen på det samme: unselect
*/
function selectAnswer(index) {
  const buttons = answersWrap.querySelectorAll(".buttonAnswers");
  const clicked = buttons[index];

  if (clicked.classList.contains("active")) {
    clicked.classList.remove("active");
    clicked.setAttribute("aria-checked", "false");
    return;
  }

  buttons.forEach(b => {
    b.classList.remove("active");
    b.setAttribute("aria-checked", "false");
  });

  clicked.classList.add("active");
  clicked.setAttribute("aria-checked", "true");
}

/* ====== RENDER SPØRGSMÅL ====== */
function showQuestion() {
  // Skjul resultat, vis quiz
  if (resultBox) resultBox.style.display = "none";
  if (quizContainer) quizContainer.style.display = "block";
  if (retryBtn) retryBtn.style.display = "none";

  // Sæt spørgsmålstekst
  questionEl.innerText = questionText[currentQuestion];

  // Byg svar-knapper (uden at låse/disable dem)
  const answers = answerText[currentQuestion];
  answersWrap.innerHTML = answers
    .map((a, i) =>
      `<button class="buttonAnswers" role="radio" aria-checked="false" data-index="${i}" onclick="selectAnswer(${i})">${a}</button>`
    )
    .join("");
}

/* ====== NÆSTE SPØRGSMÅL (SCORING LAVES HER) ====== */
function nextQuestion() {
  const activeBtn = answersWrap.querySelector(".buttonAnswers.active");

  if (activeBtn) {
    const selectedIndex = parseInt(activeBtn.getAttribute("data-index"), 10);
    const values = answerValues[currentQuestion][selectedIndex];

    // Læg point til NU (låses først ved "Næste")
    for (let i = 0; i < familyStats.length; i++) {
      familyStats[i] += values[i];
    }
  } else {
    // Ingen valgt – lille feedback
    nextBtn?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 150, iterations: 1 }
    );
    // Hvis du vil Tvinge valg, så: return;
    // return;
  }

  if (currentQuestion < questionText.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResult();
  }
}

/* ====== RESULTAT ====== */
const types = ["Eventyrlysten", "Kreativ", "Chill", "Organiseret", "Sporty", "Nørdet"];
let maxIndex = 0;

function showResult() {
  // Find dominerende type
  maxIndex = familyStats.indexOf(Math.max(...familyStats));
  const dominantType = types[maxIndex];

  if (quizContainer) quizContainer.style.display = "none";
  if (resultBox) resultBox.style.display = "block";
  if (personalityEl) personalityEl.innerText = " " + dominantType;
  if (retryBtn) retryBtn.style.display = "inline-flex";
}

/* ====== RESET ====== */
function reset() {
  for (let i = 0; i < familyStats.length; i++) familyStats[i] = 0;
  currentQuestion = 0;
  showQuestion();
}

/* ====== TASTATUR-SUPPORT (valgfrit, men rart) ====== */
document.addEventListener("keydown", (e) => {
  const focused = document.activeElement;
  if (!focused?.classList?.contains("buttonAnswers")) return;

  const all = [...answersWrap.querySelectorAll(".buttonAnswers")];
  const i = all.indexOf(focused);

  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    (all[i + 1] || all[0]).focus();
  }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    (all[i - 1] || all[all.length - 1]).focus();
  }
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    selectAnswer(i);
  }
});

/* ====== BIND NEXT-KNAPPEN ====== */
if (nextBtn) nextBtn.addEventListener("click", nextQuestion);

/* ====== START QUIZZEN ====== */
showQuestion();
