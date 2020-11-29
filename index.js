let tracker = 0;
const score = {
  pass: 0,
  fail: 0,
};
let turn = 1;
let store = [];

let state = false;
const startBtn = document.querySelector("#startTimer");
const clickBtn = document.querySelector("#action");
const restartBtn = document.querySelector("#restart");
const scoreBoard = document.querySelector("#score");
const selectTime = document.querySelector("#selectTime");
const options = document.querySelector(".options");

for (let i = 1; i <= 30; i++) {
  let option = document.createElement("option");
  option.text = `${i} mins`;
  option.value = i;
  selectTime.add(option);
}

startBtn.addEventListener("click", function () {
  reset();
  options.style.display = "none";
  restartBtn.style.display = "block";
  scoreBoard.style.display = "block";
  scoreBoard.innerHTML = `${workOutPercent()}%`;
  clickBtn.style.display = "block";
  const countDownDate = addMins(new Date(), selectTime.value);
  displayTime(countDownDate - new Date().getTime());
  var x = setInterval(function () {
    if (tracker !== score.pass) {
      score.fail++;
      tracker--;
    }
    scoreBoard.innerHTML = `${workOutPercent()}%`;
    clickBtn.classList.remove("action");
    clickBtn.classList.add("flash");
    state = Math.random() < 0.2 && checkTurns() ? true : false;
    if (state) {
      clickBtn.classList.remove("flash");
      clickBtn.classList.add("action");
      tracker++;
    }
    const now = new Date().getTime();
    const distance = countDownDate - now;
    displayTime(distance);
    if (distance < 0) {
      clearInterval(x);
      document.getElementById(
        "timer"
      ).innerHTML = `Test Finished. You got ${workOutPercent()}%`;
      options.style.display = "block";
      clickBtn.style.display = "none";
      scoreBoard.style.display = "none";
      restartBtn.style.display = "none";
    }
    store.push({ turn, state });
    turn++;
  }, 1000);
  restartBtn.addEventListener("click", () => {
    reset();
    clearInterval(x);
    options.style.display = "block";
    restartBtn.style.display = "none";
    scoreBoard.style.display = "none";
    clickBtn.style.display = "none";
    document.getElementById(
        "timer"
      ).innerHTML = `Click 'Start Timer' button to try again!`;
  });
});

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    clickEvent();
  }
});

clickBtn.addEventListener("click", () => {
  clickEvent();
});

const clickEvent = () => {
  if (state) {
    score.pass++;
  } else {
    score.fail++;
  }
  state = false;
};

const addMins = function (date, mins) {
  return new Date(date.getTime() + mins * 60000);
};

const workOutPercent = () => {
  const work = 100 / (score.pass + score.fail);
  return work === Infinity ? 100 : parseInt(work * score.pass);
};

const displayTime = (distance) => {
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";
};

const checkTurns = () => {
  const check = store.filter((obj) => {
    return obj.turn >= turn - 5 && obj.state === true;
  });
  return !check.length;
};

const reset = () => {
  tracker = 0;
  score.pass = 0;
  score.fail = 0;
  turn = 1;
  store = [];
};
