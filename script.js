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

const calendarDays = document.getElementById("calendarDays");
const selectedDateDisplay = document.getElementById("selectedDate");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const taskList = document.getElementById("taskList");

let currentDate = new Date();
let selectedDate = null;
let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function generateCalendar(date) {
  calendarDays.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    calendarDays.appendChild(emptyDiv);
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    const fullDate = `${year}-${month + 1}-${day}`;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      selectedDate = fullDate;
      selectedDateDisplay.textContent = `Tasks for ${selectedDate}`;
      renderTasks();
    });

    calendarDays.appendChild(cell);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate);
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();
  if (task && selectedDate) {
    const taskItem = { text: task, completed: false };
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

// Initial calendar render
generateCalendar(currentDate);
