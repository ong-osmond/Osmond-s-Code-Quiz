//Assigning variables to the document elements
var viewScoresButton = document.querySelector("#view-scores");
var viewScoresModal = document.querySelector("#scores-modal");
var viewScoresModalContent = document.querySelector(".modal-body");
var clearScores = document.querySelector("#clear-scores");
var timeLeftSpan = document.querySelector("#time-left");
var startButton = document.querySelector("#start-quiz-button");
var startQuizBlock = document.querySelector("#start-quiz-block");
var quizProgress = document.querySelector("#quiz-progress");
var questionItem = document.querySelector("#question");
var choices = document.querySelector("#choices");
var result = document.querySelector("#result");
var endQuizBlock = document.querySelector("#end-quiz");

//Assigning default values
var userScore = 0;
var timerLimit = 60; //configurable value
var timeLeft = timerLimit;
var myTimer;
var questionProgress = 0;

//Questions copied from https://www.geeksforgeeks.org/
var questionsArray = [
    q1 = {
        question: "What is the HTML tag under which one can write the JavaScript code?",
        choices: ["javascript",
            "scripted",
            "script",
            "js"
        ],
        answer: "script"
    },
    q2 = {
        question: "Which of the following is the correct syntax to display a text in an alert box using JavaScript?",
        choices: ["alertbox",
            "msg",
            "msgbox",
            "alert"
        ],
        answer: "alert"
    },
    q3 = {
        question: "What is the correct syntax for referring to an external script?",
        choices: ["script src",
            "script href",
            "script ref",
            "script name"
        ],
        answer: "script src"
    },
    q4 = {
        question: "Which of the following is not a reserved word in JavaScript?",
        choices: ["interface",
            "throws",
            "program",
            "short"
        ],
        answer: "program"
    },
    q5 = {
        question: "What is the syntax for creating a function in JavaScript named as compute?",
        choices: ["function = compute()",
            "function compute()",
            "function := compute()",
            "function : compute()"
        ],
        answer: "function compute()"
    },
    q6 = {
        question: "What is the JavaScript syntax for printing values in Console?",
        choices: ["print(someValue)",
            "console.log(someValue);",
            "console.print(someValue);",
            "print.console(someValue);"
        ],
        answer: "console.log(someValue);"
    },
    q7 = {
        question: "What is the method in JavaScript used to remove the whitespace at the beginning and end of any string?",
        choices: ["strip()",
            "stripped()",
            "trim()",
            "trimmed()"
        ],
        answer: "trim()"
    },
    q8 = {
        question: "In JavaScript, we do not have datatypes like integer and float. What is the function that can be used to check if the number is an integer or not?",
        choices: ["Integer(value)",
            "ifInteger(value)",
            "isInteger(value)",
            "ifinteger(value)"
        ],
        answer: "isInteger(value)"
    },
    q9 = {
        question: "Which of the following is an advantage of using JavaScript?",
        choices: ["Increased interactivity.",
            "More server interaction.",
            "Delayed feedback from the users.",
            "More HTML and CSS code."
        ],
        answer: "Increased interactivity."
    },
    q10 = {
        question: "Which function of an Array object calls a function for each element in the array?",
        choices: ["every()",
            "forEvery()",
            "each()",
            "forEach()"
        ],
        answer: "forEach()"
    }
];
var totalQuestions = questionsArray.length;
var questionsAnswered = []; //Questions are selected randomly. 
//Each question already answered is stored in this temporary array 
//so they will no longer be selected for the next question/s.

// ------------ BUTTONS handling ------------ //

//View Scores Button calls the Scores Modal
viewScoresButton.addEventListener("click", function(event) {
    event.preventDefault();
    if ((localStorage.initialsAndScores == null) ||
        localStorage.getItem("initialsAndScores") == null ||
        localStorage.getItem("initialsAndScores") == 'undefined') {
        viewScoresModalContent.textContent = "No scores saved... yet!";
        return;
    } else {
        viewScoresModalContent.textContent = "";
        var alertScores = JSON.parse(localStorage.initialsAndScores);
        alertScores.sort((a, b) => (a.score < b.score) ? 1 : -1);
        var scoreOrderList = document.createElement("ol");
        scoreOrderList.setAttribute("type", "1");
        scoreOrderList.setAttribute("style", "margin : 10px; text-align: center; list-style-position: inside;");
        viewScoresModalContent.appendChild(scoreOrderList);
        for (var i = 0; i < alertScores.length; i++) {
            var scoreItem = document.createElement("li");
            scoreItem.textContent = alertScores[i].score + " by " + alertScores[i].initials;
            //scoreItem.setAttribute("style", "")
            scoreOrderList.appendChild(scoreItem);
        };

    }
});
//Clear Scores button handling
clearScores.addEventListener("click", function() {
    event.preventDefault();
    localStorage.removeItem("initialsAndScores");
    viewScoresModalContent.textContent = "No scores saved... yet!";
});

//Start Quiz button handling
startButton.addEventListener("click", startQuiz);

// ------------ FUNCTIONS ------------ //

//Start Quiz function
function startQuiz() {
    event.preventDefault();
    event.stopPropagation();
    hideEndQuizBlock(); //Calls the hideEndQuizBlock function if that is already displayed
    startQuizBlock.style.display = "none";
    viewScoresButton.style.display = "none";
    userScore = 0; //Resets the userScore
    questionProgress = 0; //Resets the questionProgress value
    timeLeft = timerLimit;
    questionItem.textContent = "";
    startButton.style.display = "none"; //Hides the startButton
    myTimer = setInterval(startTimer, 1000); //Calls the startTimer function; counts down by 1 second.
    pickRandomQuestion(); //Calls the pickRandomQuestion function
};

function startTimer() {
    timeLeft--;
    timeLeftSpan.textContent = timeLeft;
    if (timeLeft === 0) {
        endQuiz(); //Calls the endQuiz function
    }
}

function endQuiz() {
    //Bonus points for completing the quiz
    if (timeLeft > 0) {
        userScore = userScore + timeLeft;
    }
    clearInterval(myTimer);
    rebuildQuestionsArray(); //Calls the rebuildQuestionsArray function
    clearChoices(); //Clear any existing question choices
    displayEndQuizBlock(); //Calls the displayEndQuizBlock for initials entry
}

//Displays the end quiz message and the initials entry section
function displayEndQuizBlock() {
    if (timeLeft === 0) {
        questionItem.textContent = "Time's up! Your final score is " + userScore + ".";
    } else {
        questionItem.textContent = "All done! Your final score is " + userScore + ".";
    }
    //Resets the questionProgress bar
    questionProgressPercentage = 0;
    quizProgress.setAttribute("style", "width : 0");
    quizProgress.setAttribute("aria-valuenow", "0");
    //Displays the initials entry and Submit button
    endQuizBlock.style.display = "block";
    var initials = document.createElement("input");
    initials.setAttribute("type", "text");
    initials.setAttribute("placeholder", "Enter your intials.");
    endQuizBlock.appendChild(initials);
    var saveScore = document.createElement("button");
    saveScore.setAttribute("class", "btn btn-primary btn-sm");
    saveScore.setAttribute("style", "margin : 10px");
    saveScore.textContent = "Submit";
    endQuizBlock.appendChild(saveScore);
    //Save Score / Submit Button handling
    saveScore.addEventListener("click", function(event) {
        event.preventDefault();
        result.textContent = "";
        //Clear initials and score from previous quiz (if not empty)
        var initialsAndScoreInput = {
            initials: "",
            score: 0
        };
        // Create initials and score object on submission
        initialsAndScoreInput = {
            initials: initials.value.trim(),
            score: userScore
        };
        // Alert user if initials have not been entered
        if (initialsAndScoreInput.initials == "") {
            alert("Initials cannot be blank.");
            return;
        };
        //Create or add local storage initialsAndScores
        if (localStorage.getItem("initialsAndScores") === null ||
            localStorage.getItem("initialsAndScores") === 'undefined') {
            var initialsAndScoreInputArray = []; //Create an initialsAndScoreInputArray
            initialsAndScoreInputArray.push(initialsAndScoreInput);
            localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScoreInputArray));
        } else {
            var initialsAndScoreInputArray = []; //Create an initialsAndScoreInputArray
            if (JSON.parse(localStorage.initialsAndScores) != null) {
                initialsAndScoreInputArray = JSON.parse(localStorage.initialsAndScores);
            } //Retrieve existing initialsAndScores from local storage
            initialsAndScoreInputArray.push(initialsAndScoreInput); //Fill in the initialsAndScoreInputArray
            localStorage.setItem("initialsAndScores", JSON.stringify(initialsAndScoreInputArray));
        }
        hideEndQuizBlock();
        //Show the Start Quiz Block
        startQuizBlock.style.display = "block";
        startButton.style.display = "inline";
        viewScoresButton.style.display = "inline";
    });
}

function hideEndQuizBlock() {
    //Clear the Questions and End Quiz text
    questionItem.textContent = "";
    var child = endQuizBlock.lastElementChild;
    //Clear the End Quiz Block
    while (child) {
        endQuizBlock.removeChild(child);
        child = endQuizBlock.lastElementChild;
    };
    timeLeftSpan.textContent = timerLimit;
}

//The function that displays the quiz progress, quiz questions and answer choices
function pickRandomQuestion() {
    //Pick a random question from the questionsArray
    var questionNumber = [Math.floor(Math.random() * questionsArray.length)];
    var question = questionsArray[questionNumber];
    //Update the progress bar
    var questionProgressPercentage = Math.round(((questionProgress / totalQuestions)) * 100);
    quizProgress.setAttribute("style", `width : ${questionProgressPercentage}%; height: 15px`);
    quizProgress.setAttribute("aria-valuenow", questionProgressPercentage);
    quizProgress.textContent = `${questionProgressPercentage}%`;
    questionItem.textContent = question.question;
    //Display the choices
    for (var c = 0; c < questionsArray[questionNumber].choices.length; c++) {
        var choice = (questionsArray[questionNumber].choices[c]);
        var li = document.createElement("button");
        li.setAttribute("class", "btn btn-primary btn-sm btn-block");
        li.textContent = choice;
        choices.appendChild(li);
        var correctAnswer = (questionsArray[questionNumber].answer);
        //Add event listener to user's choice when it is clicked
        li.addEventListener("click", function(event) {
            event.preventDefault();
            result.textContent = "";
            var userChoice = event.target.textContent;
            questionProgress++;
            checkAnswer(userChoice, correctAnswer); //Calls the checkAnswer function passing two arguments to compare
        })
    };
    //Move the question that has just been answered to the questionsAnswered array
    questionsAnswered.push(question);
    questionsArray.splice(questionNumber, 1);
}

//Check the user's answer
function checkAnswer(userChoice, correctAnswer) {
    if (userChoice == correctAnswer) {
        result.textContent = "Correct";
        result.setAttribute("style", "color : green;");
        userScore++;
    } else {
        result.textContent = "Sorry, wrong answer!";
        result.setAttribute("style", "color : red;");
        timeLeft = timeLeft - 5;
        timeLeftSpan.textContent = timeLeft;
    };
    clearChoices(); //Clear the choices of the question that has just been answered
    //Clear the result info after 1 second
    setTimeout(function() {
        result.textContent = ""
    }, 1000);
    //Check if all questions have been answered
    if (questionsArray.length == 0 ||
        timeLeft <= 0) {
        endQuiz();
    } else pickRandomQuestion();
}

//Clears the answer choices
function clearChoices() {
    var choices = document.getElementById("choices");
    while (choices.hasChildNodes()) {
        choices.removeChild(choices.firstChild);
    }
}

//Moves all answered questions back to the initial questionsArray
function rebuildQuestionsArray() {
    questionsArray = questionsArray.concat(questionsAnswered);
    questionsAnswered = [];
}