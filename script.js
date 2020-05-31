var userScoreSpan = document.querySelector("#user-score");
var timeLeftSpan = document.querySelector("#time-left");
var startButton = document.querySelector("#startGame");
var questionItem = document.querySelector("#question");
var choices = document.querySelector("#choices");

var userScore = 0;
var timerLimit = 20;
var timeLeft = timerLimit;
var timerEnd = false;

var questionsArray = [
    q1 = {
        question: "What is the HTML tag under which one can write the JavaScript code?",
        choices: ["<javascript>",
            "<scripted>",
            "<script>",
            "<js>"],
        answer: "<script>"
    },
    q2 = {
        question: "Which of the following is the correct syntax to display a text in an alert box using JavaScript?",
        choices: ["alertbox();",
            "msg()",
            "msgbox()",
            "alert()"],
        answer: "alert()"
    },
    q3 = {
        question: "What is the correct syntax for referring to an external script called script.js”?",
        choices: ["<script src=script.js”>",
            "<script href=script.js”>",
            "<script ref=”script.js”>",
            "<script name=”script.js”>"],
        answer: "<script src=script.js”>"
    },
    q4 = {
        question: "Which of the following is not a reserved word in JavaScript?",
        choices: ["interface",
            "throws",
            "program",
            "short"],
        answer: "program"
    }
];

var questionsAnswered = [];

startButton.addEventListener("click", function (event) {
    event.preventDefault();
    startButton.remove();
    startTimer();
}
);

function startTimer() {
    timeLeftSpan.innerHTML = timerLimit;
    setInterval(function () {
        timeLeft--;
        timeLeftSpan.innerHTML = timeLeft;
    }, 1000);
    pickRandomQuestion();
};

function endQuiz() {
    alert("Time is up!");
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
        var li = document.createElement("li");
        li.textContent = choice;
        choices.appendChild(li);
        var correctAnswer = (questionsArray[questionNumber].answer);
        //Add event listener to choice when it is clicked
        li.addEventListener("click", function (event) {
            var userChoice = event.target.innerHTML;
            compareChoiceWithCorrectAnswer(userChoice, correctAnswer);
        }
        )
    };
    questionsAnswered.push(question);
    questionsArray.splice(questionNumber, 1);
}

function compareChoiceWithCorrectAnswer(userChoice, correctAnswer) {
    if (userChoice === correctAnswer) {
        console.log("You are correct!");
        userScore++;
        userScoreSpan.textContent = userScore;
    } else
        console.log("Sorry, wrong answer!");
        timeLeft = timeLeft - 5;
        timeLeftSpan.innerHTML = timeLeft;

    var choices = document.getElementById("choices");
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    }
    if (questionsArray.length == 0) {
        questionItem.textContent = "Thank you for playing. Your score is: " + userScore + "\n Enter your initials.";
        rebuildQuestionsArray();
    } else pickRandomQuestion();
}

function rebuildQuestionsArray() {
    for (qa = 0; qa < questionsAnswered.length; qa++) {
        questionsArray.push(questionsAnswered[qa]);
    }
}

