const quotes = [
  "Believe you can and you're halfway there.",
  "Do something today that your future self will thank you for.",
  "Every accomplishment starts with the decision to try.",
  "Push yourself, because no one else is going to do it for you.",
  "Success doesn't just find you. You have to go out and get it."
];

let currentQuote = 0;
function rotateQuote() {
  const quoteBox = document.getElementById("quoteBox");
  const quoteText = document.getElementById("quoteText");
  quoteBox.style.opacity = 0;
  setTimeout(() => {
    currentQuote = (currentQuote + 1) % quotes.length;
    quoteText.textContent = quotes[currentQuote];
    quoteBox.style.opacity = 1;
  }, 500);
}
setInterval(rotateQuote, 5000);

const calendar = document.getElementById("calendar");
const selectedDateDisplay = document.getElementById("selectedDate");
const taskList = document.getElementById("taskList");
let selectedDate = null;
let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};

function generateCalendar() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;
    if (day === today.getDate()) {
      cell.classList.add("today");
    }
    cell.addEventListener("click", () => {
      selectedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
      selectedDateDisplay.textContent = `Tasks for ${selectedDate}`;
      renderTasks();
    });
    calendar.appendChild(cell);
  }
}
generateCalendar();

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();
  if (task && selectedDate) {
    const taskItem = {
      text: task,
      completed: false
    };
    if (!tasksByDate[selectedDate]) {
      tasksByDate[selectedDate] = [];
    }
    tasksByDate[selectedDate].push(taskItem);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }
}

function saveTasks() {
  localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));
}

function renderTasks() {
  taskList.innerHTML = "";
  if (!selectedDate || !tasksByDate[selectedDate]) return;
  tasksByDate[selectedDate].forEach((taskObj, index) => {
    const li = document.createElement("li");
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("task-left");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskObj.completed;
    checkbox.addEventListener("change", () => {
      taskObj.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });
    const span = document.createElement("span");
    span.textContent = taskObj.text;
    if (taskObj.completed) {
      span.classList.add("completed");
    }
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.addEventListener("click", () => {
      tasksByDate[selectedDate].splice(index, 1);
      if (tasksByDate[selectedDate].length === 0) {
        delete tasksByDate[selectedDate];
      }
      saveTasks();
      renderTasks();
    });
    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}
