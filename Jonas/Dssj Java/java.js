
var familyStats = [
    0,      // adventurous
    0,      //creative
    0,      //chill
    0,      //organized
    0,      //sporty
    0,       //geeky
];      

var currentQuestion = 0;

var questionText = [
    "Hvad kan jeres børn bedst lide at lave i deres fritid?",
    "Hvor tit laver I noget sammen som familie?",
    "Er I mest til udendørs eller indendørs aktiviteter?",
    "Er der bestemte interesser eller hobbyer?",
    "Hvilke typer oplevelser nyder I mest som familie?",
    "Er der noget nyt I godt kunne tænke jer at prøve sammen som familie?",
];

var answerText = [
    ["Udforske nye steder",
    "Lege med legetøj",
    "Læse",
    "Rydde op",
    "Løbe/sport",
    "Spille videospil"],

    ["Vi tager ofte på spontane ture",
    "Vi Maler eller tegner",
    "Vi hygger os med film",
    "Vi Planlægger næste uge",
    "Vi Spiller fodbold",
    "Vi laver noget Teknisk"],

    ["Udendørs i naturen",
    "Indendørs",
    "Hjemme er bedst",
    "Begge dele",
    "Udendørs og være aktiv ",
    "Online"],

    ["Gå på eventyr",
    "Lave kreative projekter",
    "Chille", 
    "Vi har en fælles rutine",
    "Sport og bevægelse",
    "Teknologi og gaming"],

    ["Actionfyldte ture",
    "kreative workshops",
    "Familiehygge",
    "Planlagte aktiviteter",
    "sportsarrangementer",
    "Teknologi"],
    
    ["Camping",
    "Et kreativt projekt",
    "Prøve en spaoplevelse",
    "Et organiseret familieprojekt",
    "sport sammen",
    "Kode eller spille sammen"]
];

var answerValues = [
    [[3,1,0,0,2,0],
    [0,3,1,0,0,2],
    [0,0,3,1,0,2],
    [0,0,2,3,0,1],
    [2,1,0,0,3,0],
    [0,1,2,0,0,3]],

    [[3,1,0,0,2,0],
    [0,3,2,0,0,1],
    [0,0,3,1,0,2],
    [0,0,1,3,0,2],
    [2,1,0,0,3,0],
    [0,1,1,0,0,3]],

    [[2,1,1,0,0,2],
    [1,3,1,0,0,1],
    [0,0,1,3,0,2],
    [0,0,0,3,0,3],
    [2,1,0,0,3,0],
    [0,1,0,0,0,4]],

    [[3,1,0,0,2,0],
    [0,3,1,0,0,2],
    [0,0,3,1,0,2],
    [0,0,1,3,0,2],
    [2,1,0,0,3,0],
    [0,0,1,0,0,4]],

    [[2,1,0,0,3,0],
    [1,3,0,0,0,2],
    [0,0,3,0,0,3],
    [0,0,0,4,0,2],
    [3,0,0,0,3,0],
    [0,0,0,0,0,5]],

    [[3,1,0,0,2,0],
    [0,3,1,0,0,2],
    [0,0,4,0,0,2], 
    [0,0,1,3,0,2], 
    [2,1,0,0,3,0],
    [0,1,1,0,0,4]]
];

function showQuestion() {

    document.getElementById("result").style.display = "none";

    let question = questionText[currentQuestion];
    let answers = answerText[currentQuestion];

    document.getElementById("question").innerText = question;

    let answersHTML = "";

    answers.forEach((answer, i) => {
        answersHTML += `<button class="buttonAnswers" onclick="selectAnswer(${i})">${answer}</button>`;
    });

    document.getElementById("answers").innerHTML = answersHTML;
    
}

function selectAnswer(index) {

    let values = answerValues[currentQuestion][index];
    for (let i = 0; i < familyStats.length; i++) {
        familyStats[i] += values[i];
    }

    document.querySelectorAll("#answers button").forEach(btn => btn.disabled = true);
}

function nextQuestion() {

    if (currentQuestion < questionText.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {

        showResult();
    }

    console.log(familyStats)
}

function showResult() {

    let types = ["Eventyrlysten", 
                "Kreativ", 
                "Chill", 
                "Organiseret", 
                "Sporty", 
                "Nørdet"];

    let maxIndex = familyStats.indexOf(Math.max(...familyStats));

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("personality").innerText = types[maxIndex];
}

    
showQuestion(); // Start quizzen
