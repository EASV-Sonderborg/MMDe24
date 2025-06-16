
var familyStats = [
    0,      // adventurous
    0,      //creative
    0,      //chill
    0,      //organized
    0,      //sporty
    0,      //geeky
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
    "Sport og være aktiv ",
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

let reTry = document.getElementById("reTry")
let quizContainer = document.getElementById("quizContainer")
let result = document.getElementById("result")
let personality = document.getElementById("personality")
let recSection = document.getElementById("recSection")


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
    console.log(question)




}

function selectAnswer(index) {

    let values = answerValues[currentQuestion][index];
    for (let i = 0; i < familyStats.length; i++) {
        familyStats[i] += values[i];

        console.log(index)

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

showQuestion(); // Start quizzen

let types = ["Eventyrlysten", 
            "Kreativ", 
            "Chill", 
            "Organiseret", 
            "Sporty", 
            "Nørdet"];

let maxIndex;
let dominantType = "";

function showResult() {
    maxIndex = familyStats.indexOf(Math.max(...familyStats));
    dominantType = types[maxIndex];

    quizContainer.style.display = "none";
    result.style.display = "block";
    personality.innerText = dominantType;

    reTry.style.display = "block";
    console.log(dominantType);

    fetchData(dominantType); // Send tag-navn til fetch
}

function reset() {
    if (currentQuestion > 0){

        currentQuestion = 0;

        familyStats = [
            0,
            0,
            0,
            0,
            0,
            0];
    }

    recSection.innerHTML = '';

    reTry.style.display = "none";
    quizContainer.style.display = "block";

    console.log(familyStats);
}

async function fetchData(tagName) {
    try {
        // 1. Hent alle tags for at finde ID på det ønskede tagnavn
        const tagResponse = await fetch(`https://kristian-frederichsen.dk/wp-json/wp/v2/tags`);
        const tagData = await tagResponse.json();

        const tagObj = tagData.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());

        if (!tagObj) {
            console.log(`Ingen tag fundet for: ${tagName}`);
            return;
        }

        // 2. Brug tag-ID til at hente filtrerede posts
        const postsResponse = await fetch(`https://kristian-frederichsen.dk/wp-json/wp/v2/posts?tags=${tagObj.id}`);
        const posts = await postsResponse.json();

        // 3. Loop og vis resultater
        for (const post of posts) {
            
            console.log(`Titel: ${post.title.rendered}`);
            console.log(`Indhold: ${post.excerpt.rendered}`);

            recSection.innerHTML +=`

            <div class="post" onclick="openModal(${post.id})">
                <div class="title">${post.title.rendered}</div>
                <div class="postText">${post.excerpt.rendered}</div>
            </div>
            `

            
        }

    } catch (error) {
        console.error("Fejl ved hentning af data:", error);
    }
}

async function openModal(postId) {
    try {
        const res = await fetch(`https://kristian-frederichsen.dk/wp-json/wp/v2/posts/${postId}`);
        const post = await res.json();

        document.getElementById("modalTitle").innerHTML = post.title.rendered;
        document.getElementById("modalContent").innerHTML = post.content.rendered;

        document.getElementById("popupModal").style.display = "flex";
    } catch (error) {
        console.error("Fejl ved hentning af post:", error);
    }
}

function closeModal() {
    document.getElementById("popupModal").style.display = "none";
}
showQuestion(); // Start quizzen
