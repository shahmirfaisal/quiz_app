window.onload = () => {
  var div = document.getElementById("container");
  var next = document.getElementById("next");
  var submit = document.getElementById("submit");
  var ques = document.getElementById("ques");
  var li = document.querySelectorAll("ol li div");
  var quesNum = document.getElementById("quesNum");
  var checkResults = document.getElementById("checkResults");
  var totalMarks = document.getElementsByClassName("marks");
  var modal = document.getElementById("modal");
  var marks = 0;
  li.forEach(function(li) {
    li.addEventListener("click", chooseAns);
  });

  function httpRequest(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
      true
    );

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        next.addEventListener("click", showNextQuiz);
        submit.addEventListener("click", submitAnswer);
        checkResults.addEventListener("click", showResults);

        var response = JSON.parse(this.responseText);

        // Count the number of questions
        var count = 0;

        callback(response, count);

        function showNextQuiz() {
          // Show next question
          count++;
          callback(response, count);

          li.forEach(function(li) {
            li.addEventListener("click", chooseAns);
          });

          next.style.visibility = "hidden";

          quesNum.innerText = count + 1;
          div.classList.add("slideInRight");
        }

        function showResults() {
          modal.style.display = "flex";
          for (var i in totalMarks) {
            totalMarks[i].innerHTML = marks;
          }
        }

        function submitAnswer() {
          if (count < 9) {
            div.classList.remove("slideInRight");
            var correct_answer = response.results[count].correct_answer;
            var correct;
            for (var i in li) {
              if (li[i].className == "listClicked") {
                if (li[i].innerHTML == correct_answer) {
                  correct = true;
                } else {
                  correct = false;
                }
              }
            }
            if (correct) {
              marks++;
              notification("Correct", "success", 2000);
            } else {
              notification("Incorrect", "danger", 2000);
            }
            submit.style.visibility = "hidden";
            next.style.visibility = "visible";

            li.forEach(function(li) {
              li.removeEventListener("click", chooseAns);
            });
          } else {
            next.style.display = "none";
            submit.style.display = "none";
            checkResults.style.display = "inline";
          }
        }
      }
    };

    xhr.send();
  }

  httpRequest(showQuiz);

  // Callback function
  function showQuiz(response, count) {
    var question = response.results[count].question;
    var incorrect_answers = response.results[count].incorrect_answers;
    var correct_answer = response.results[count].correct_answer;
    incorrect_answers.push(correct_answer);

    var answers = incorrect_answers;
    // sorting answers randomly
    answers = answers.sort(function(a, b) {
      return 0.5 - Math.random();
    });

    ques.innerHTML = question;

    for (let i in answers) {
      li[i].innerHTML = answers[i];
      li[i].className = answers[i] == correct_answer ? "correct" : "";
    }
  }

  function chooseAns(e) {
    for (var i in li) {
      if (li[i].className == "listClicked") {
        li[i].className = "";
      }
    }
    e.target.className = "listClicked";
    submit.style.visibility = "visible";
  }
};
