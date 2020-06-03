var viewScoresButton = document.querySelector("#view-scores");
var viewScoresModal = document.querySelector("#scoresModal");
var viewScoresModalContent = document.querySelector(".modal-body");
var clearScores = document.querySelector("#clear-scores");
var timeLeftSpan = document.querySelector("#time-left");
var startButton = document.querySelector("#startQuizButton");
var startQuizBlock = document.querySelector("#startQuiz");
var questionItem = document.querySelector("#question");
var choices = document.querySelector("#choices");
var result = document.querySelector("#result");
var endQuizBlock = document.querySelector("#endQuiz");

var userScore = 0;
var timerLimit = 30;
var timeLeft = timerLimit;
var myTimer;
var timerEnd = false;


viewScoresButton.addEventListener("click", function (event) {
    viewScoresModalContent.innerHTML = "No scores saved... yet!";
    if ((JSON.parse(localStorage.initialsAndScores) == null) || 
    localStorage.getItem("initialsAndScores").valueOf() == null ||
        localStorage.getItem("initialsAndScores") == 'undefined') {
        viewScoresModalContent.innerHTML = "No scores saved... yet!";
        return;
    }
    else {
        console.log("Local Storage: " + localStorage.initialsAndScores);
        viewScoresModalContent.innerHTML = "";
        var alertScores = JSON.parse(localStorage.initialsAndScores);
        var alertScoreDisplay = "";
        for (var i = 0; i < alertScores.length; i++) {
            var scoreItem = document.createElement("li");
            scoreItem.textContent = alertScores[i].score + " by " + alertScores[i].initials;
            viewScoresModalContent.appendChild(scoreItem);
        }
    }
}
);

clearScores.addEventListener("click", function () {
    // if (localStorage.getItem("initialsAndScores").valueOf() == null ||
    //     localStorage.getItem("initialsAndScores") == 'undefined') {
    //     return;
    // } else 
    localStorage.setItem("initialsAndScores", null);
    console.log(localStorage.initialsAndScores);
}
);


var questionsArray = [
    q1 = {
        question: "What is the HTML tag under which one can write the JavaScript code?",
        choices: ["javascript",
            "scripted",
            "script",
            "js"],
        answer: "script"
    },
    q2 = {
        question: "Which of the following is the correct syntax to display a text in an alert box using JavaScript?",
        choices: ["alertbox",
            "msg",
            "msgbox",
            "alert"],
        answer: "alert"
    },
    q3 = {
        question: "What is the correct syntax for referring to an external script?",
        choices: ["script src",
            "script href",
            "script ref",
            "script name"],
        answer: "script src"
    },
    q4 = {
        question: "Which of the following is not a reserved word in JavaScript?",
        choices: ["interface",
            "throws",
            "program",
            "short"],
        answer: "program"
    },
    q5 = {
        question: "What is the syntax for creating a function in JavaScript named as compute?",
        choices: ["function = compute()",
            "function compute()",
            "function := compute()",
            "function : compute()"],
        answer: "function compute()"
    },
    q6 = {
        question: "What is the JavaScript syntax for printing values in Console?",
        choices: ["print(someValue)",
            "console.log(someValue);",
            "console.print(someValue);",
            "print.console(someValue);"],
        answer: "console.log(someValue);"
    },
    q6 = {
        question: "What is the method in JavaScript used to remove the whitespace at the beginning and end of any string?",
        choices: ["strip()",
            "stripped()",
            "trim()",
            "trimmed()"],
        answer: "trim()"
    }
];

var questionsAnswered = [];

startButton.addEventListener("click", startQuiz);

function startQuiz() {
    event.preventDefault();
    event.stopPropagation();
    hideEndQuizBlock();
    startQuizBlock.style.display = "none";
    viewScoresButton.style.display = "none";
    userScore = 0;
    timeLeft = timerLimit;
    questionItem.textContent = "";
    startButton.style.display = "none";
    myTimer = setInterval(startTimer, 1000);
    pickRandomQuestion();
};

function startTimer() {
    timeLeft--;
    timeLeftSpan.innerHTML = timeLeft;
    if (timeLeft === 0) {
        endQuiz();
    }
}

function endQuiz() {
    //Bonus for completing the quiz
    if (timeLeft > 0) {
        userScore = userScore + timeLeft;
    }
    clearInterval(myTimer);
    rebuildQuestionsArray();
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    };
    displayEndQuizBlock();
}

function displayEndQuizBlock() {
    questionItem.textContent = "Your final score is " + userScore + ".";
    result.textContent = "";
    endQuizBlock.style.display = "block";
    var initials = document.createElement("input");
    initials.setAttribute("type", "text");
    initials.setAttribute("placeholder", "Enter your intials to save your score.");
    endQuizBlock.appendChild(initials);
    var saveScore = document.createElement("button");
    saveScore.setAttribute("class", "btn btn-primary btn-sm");
    saveScore.setAttribute("style", "margin : 10px");
    saveScore.innerHTML = "Submit";
    endQuizBlock.appendChild(saveScore);
    timeLeftSpan.innerHTML = timerLimit;
    //startButton.style.display = "block";
    saveScore.addEventListener("click", function (event) {
        event.preventDefault();
        //Clear previous initials and score
        var initialsAndScoreInput = {
            initials: "",
            score: 0
        };
        // Create score object from submission
        initialsAndScoreInput = {
            initials: initials.value.trim(),
            score: userScore
        };
        if (initialsAndScoreInput.initials == "") {
            alert("Initials cannot be blank.");
            return;
        };

        //Create or add local storage initialsAndScores
        if (localStorage.getItem("initialsAndScores") === null ||
            localStorage.getItem("initialsAndScores") === 'undefined') {
            var initialsAndScoreInputArray = [];
            initialsAndScoreInputArray.push(initialsAndScoreInput);
            localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScoreInputArray));
        }
        else {
            var initialsAndScoreInputArray = [];
            console.log("Heeere: " + localStorage.getItem("initialsAndScores") + "and" + initialsAndScoreInput);
            if (JSON.parse(localStorage.initialsAndScores) != null) {
                initialsAndScoreInputArray = JSON.parse(localStorage.initialsAndScores);
            } //retrieve existing initialsAndScores
            initialsAndScoreInputArray.push(initialsAndScoreInput);
            localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScoreInputArray));
        }
        hideEndQuizBlock();
        startQuizBlock.style.display = "block";
        startButton.style.display = "inline";
        viewScoresButton.style.display = "inline";
    }
    );
}

function hideEndQuizBlock() {
    questionItem.textContent = "";
    var child = endQuizBlock.lastElementChild;
    while (child) {
        endQuizBlock.removeChild(child);
        child = endQuizBlock.lastElementChild;
    };
    //userScoreSpan.innerHTML = 0;
    timeLeftSpan.innerHTML = timerLimit;
}

function pickRandomQuestion() {
    //Clear previous question and choices
    if (questionItem === "") {
        return;
    };
    //Randomly pick a question
    var questionNumber = [Math.floor(Math.random() * questionsArray.length)];
    var question = questionsArray[questionNumber];
    questionItem.innerHTML = question.question;
    //Display the choices
    for (var c = 0; c < questionsArray[questionNumber].choices.length; c++) {
        var choice = (questionsArray[questionNumber].choices[c]);
        var li = document.createElement("button");
        li.setAttribute("class", "btn btn-primary btn-sm btn-block");
        li.textContent = choice;
        choices.appendChild(li);
        var correctAnswer = (questionsArray[questionNumber].answer);
        //Add event listener to choice when it is clicked
        li.addEventListener("click", function (event) {
            result.textContent = "";
            var userChoice = event.target.innerHTML;
            checkAnswer(userChoice, correctAnswer);
        }
        )
    };
    questionsAnswered.push(question);
    questionsArray.splice(questionNumber, 1);
}

function checkAnswer(userChoice, correctAnswer) {
    if (userChoice == correctAnswer) {
        result.textContent = "Correct";
        userScore++;
        //  userScoreSpan.textContent = userScore;
    } else {
        result.textContent = "Sorry, wrong answer!";
        timeLeft = timeLeft - 5;
        timeLeftSpan.innerHTML = timeLeft;
    }
    var choices = document.getElementById("choices");
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    }
    if (questionsArray.length == 0 ||
        timeLeft <= 0) {
        endQuiz();
    } else pickRandomQuestion();
}

function rebuildQuestionsArray() {
    questionsArray = questionsArray.concat(questionsAnswered);
    questionsAnswered = [];
}