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

// Variables for calendar and tasks
const calendar = document.getElementById("calendar");
const selectedDateDisplay = document.getElementById("selectedDate");
const taskList = document.getElementById("taskList");
const monthYearLabel = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
let selectedDate = null;

// Track current displayed year and month
let currentYear, currentMonth; // month: 0-11

function initializeCalendar() {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();
  renderCalendar(currentYear, currentMonth);
}

function renderCalendar(year, month) {
  calendar.innerHTML = "";

  // Show Month Year label, e.g., May 2025
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYearLabel.textContent = `${monthNames[month]} ${year}`;

  // Add day labels for week (Sun - Sat)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let dayLabel of dayLabels) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = dayLabel;
    dayDiv.style.fontWeight = "bold";
    dayDiv.style.backgroundColor = "#d2b894";
    calendar.appendChild(dayDiv);
  }

  // Calculate starting day index of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

  // Days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Fill blank days before first day of month
  for (let i = 0; i < startDay; i++) {
    const blankDiv = document.createElement("div");
    blankDiv.style.backgroundColor = "transparent";
    blankDiv.style.cursor = "default";
    calendar.appendChild(blankDiv);
  }

  // Add days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    // Highlight today if in current month and year
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
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

// Change month handlers
prevMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
  // Clear selection and tasks
  selectedDate = null;
  selectedDateDisplay.textContent = "Select a date to see tasks";
  taskList.innerHTML = "";
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
  // Clear selection and tasks
  selectedDate = null;
  selectedDateDisplay.textContent = "Select a date to see tasks";
  taskList.innerHTML = "";
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
  } else if (!selectedDate) {
    alert("Please select a date on the calendar first.");
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

// Initialize calendar on page load
initializeCalendar();
