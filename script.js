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
const monthYearDisplay = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let selectedDate = null;
let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};

let currentDate = new Date();

function generateCalendar(date) {
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Update month and year display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendar.appendChild(emptyCell);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    if (isCurrentMonth && day === today.getDate()) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      selectedDate = `${year}-${month + 1}-${day}`;
      selectedDateDisplay.textContent = `Tasks for ${selectedDate}`;
      renderTasks();
    });

    calendar.appendChild(cell);
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
    const
::contentReference[oaicite:0]{index=0}
 
