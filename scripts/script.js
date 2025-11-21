// https://www.figma.com/file/h7ecVRqH6mqrf2JYkCyb0C/To-do-list-(Community)?type=design&node-id=348-221&mode=design

// 1 этап: верстка,
// 2 этап: добавление задачи, подключение к localstorage,
// 3 этап: фильтрация, редактирование

// доп. функ: поиск, редактирование задачи(название, время)

// task(entity):{
//     id:String|Number, // Math.random() | Date.now()
//     title: String,
//     date: String | Number,
//     completed: Boolean //false->true
// }

const tasks = JSON.parse(localStorage.getItem("myToDo")) || [];
window.addEventListener("DOMContentLoaded", () => {
  tasks.length !== 0 && showTasks("active");
});

// function remove(evt) {
//   // evt.target будет указывать на элемент <li>, по которому был произведён клик
//   // evt.currentTarget будет указывать на родительский элемент <ul>
//   evt.target.remove();
// }

// *******************************************************
// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// const days = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const now = new Date();
const currentWeekDay = document.querySelector(".current-weekday");
currentWeekDay.textContent = days[now.getDay()];

const currentDate = document.querySelector(".current-date");
currentDate.textContent = `${now.getDate()} ${
  months[now.getMonth()]
} ${now.getFullYear()}`;

function utcToInput(utcString) {
  const date = new Date(utcString);

  if (isNaN(date.getTime())) {
    console.error("Invalid UTC date:", utcString);
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Формат строго: YYYY-MM-DDTHH:MM
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// *******************************************************
function saveAllTasks() {
  localStorage.setItem("myToDo", JSON.stringify(tasks));
}
function changeTaskStatus(id, value) {
  for (let i = 0; i < tasks.length; i++) {
    if (id === tasks[i].id) {
      tasks[i].completed = value;
      if (value) tasks[i].completedDate = Date.now();
      else delete tasks[i].completedDate;
      saveAllTasks();
      showTasks();
      return true;
    }
  }
  return false;
}

function getDate(timestamp) {
  const dateString = new Date(timestamp);
  const year = dateString.getFullYear();
  const month = String(dateString.getMonth() + 1).padStart(2, "0");
  const day = String(dateString.getDate()).padStart(2, "0");
  const hours = String(dateString.getHours()).padStart(2, "0");
  const minutes = String(dateString.getMinutes()).padStart(2, "0");
  const seconds = String(dateString.getSeconds()).padStart(2, "0");

  // const [yearMonthDay, time] = task.date.split("T");

  const date = {
    year: year,
    month: month,
    day: day,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    dateOnly: `${year}-${month}-${day}`,
    timeOnly: `${hours}:${minutes}`,
    dateTime: `${year}-${month}-${day} ${hours}:${minutes}`,
  };
  return date;
}

function createTaskHTML(task) {
  const li = document.createElement("li");
  const checkBtnContainer = document.createElement("p");
  checkBtnContainer.className = "task-checkbox-container";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = task.id;
  input.checked = task.completed;
  input.className = "task-checkbox";

  const pDateBefore = document.createElement("p");
  pDateBefore.className = "task-date-before";
  pDateBefore.innerHTML = `<span class="material-symbols-outlined" style="font-size: 12px"> schedule </span> ${
    getDate(task.date).dateTime
  }`;

  // pDateBefore.textContent = task.date;

  // pDateBefore.textContent = `${dateString.getDate()} ${
  //   months[dateString.getMonth()]
  // } ${dateString.getFullYear()}   ${timeOnly}`;

  // +     '<span class="material-symbols-outlined" style="font-size: 12px"> task_alt </span>';
  // pDate.textContent = `${dateString.toLocaleDateString()} ${dateString.toLocaleTimeString()}`;

  // <span class="material-symbols-outlined"> expand_circle_down </span>;

  const pDateDone = document.createElement("p");
  pDateDone.className = "task-date-done";
  if (task.completedDate)
    pDateDone.innerHTML = `<span class="material-symbols-outlined" style="font-size: 12px"> task_alt </span> ${
      getDate(task.completedDate).dateTime
    }`;

  const pTask = document.createElement("p");
  pTask.className = "task-todo";
  if (task.completed) pTask.className += " deleted-text";

  pTask.textContent = task.title;

  const edit = document.createElement("p");

  edit.innerHTML =
    '<span class="material-symbols-outlined taskEditBtn"> drag_indicator </span>';
  // '<span class="material-symbols-outlined taskEditBtn"> edit </span>';
  edit.className = "taskEditBtnContainer";

  edit.addEventListener("click", function () {
    openTaskDialog(task.id);
  });

  input.addEventListener("change", function () {
    changeTaskStatus(this.id, this.checked);
    // if (this.checked) {
    //   console.log("Чекбокс отмечен ✅");
    // } else {
    //   console.log("Чекбокс снят ❌");
    // }
  });

  checkBtnContainer.appendChild(input);
  li.appendChild(checkBtnContainer);

  li.appendChild(pDateBefore);
  li.appendChild(pDateDone);
  li.appendChild(pTask);
  li.appendChild(edit);
  return li;
}

const listOfTasks = document.querySelector("#tasks");
let filter = "active";

function sortListByCompleted(list, value) {
  return list
    .filter((item) => {
      return item.completed === value;
    })
    .sort((a, b) => {
      return a.date - b.date;
    });
}

const numAllElement = document.querySelector(".numAll");
const numActiveElement = document.querySelector(".numActive");
const numDoneElement = document.querySelector(".numDone");
const searchClearBtn = document.querySelector(".search-btn");
searchClearBtn.addEventListener("click", () => {
  searchInput.value = "";
  showTasks();
});

function showTasks(sortByFilter = "") {
  numAllElement.textContent = ` (${tasks.length})`;

  let numActive = tasks.reduce((total, item) => {
    return item.completed ? total : total + 1;
  }, 0);
  numActiveElement.textContent = ` (${numActive})`;
  numDoneElement.textContent = ` (${tasks.length - numActive})`;

  let keyWord = searchInput.value;

  if (keyWord) searchClearBtn.textContent = " close ";
  else searchClearBtn.textContent = " search ";

  const searchedTasks = tasks.filter((item) => {
    return item.title.toLowerCase().includes(keyWord.toLowerCase());
  });
  if (sortByFilter) filter = sortByFilter;

  if (filter === "active") {
    renderTasks(sortListByCompleted(searchedTasks, false));
  } else if (filter === "done") {
    renderTasks(sortListByCompleted(searchedTasks, true));
  } else
    renderTasks(
      searchedTasks.sort((a, b) => {
        return a.date - b.date;
      })
    );
}
function renderTasks(tasks) {
  const listOfTasks = document.querySelector("#tasks");
  listOfTasks.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    listOfTasks.appendChild(createTaskHTML(tasks[i]));
  }
}
function getCurrentTaskById(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return tasks[i];
    }
  }
  return false;
}

const addNewTaskBlock = document.querySelector(".addNewTaskBlock");
const addNewTaskFormDescriptionInput = document.querySelector(
  "#addNewTaskFormDescriptionInput"
);

const addNewTaskFormDateInput = document.querySelector(
  "#addNewTaskFormDateInput"
);
// addNewTaskFormDateInput.min = new Date().toISOString().split("T")[0];

function openTaskDialog(taskId = "") {
  addNewTaskBlock.classList.add("active");
  addNewTaskForm.id = taskId;

  addNewTaskFormDescriptionInput.value = "";
  addNewTaskFormDateInput.value = "";
  addNewTaskFormDeleteBtn.classList.add("hidden");

  if (taskId !== "") {
    const currentTask = getCurrentTaskById(taskId);
    if (currentTask) {
      addNewTaskFormDescriptionInput.value = currentTask.title;
      addNewTaskFormDateInput.value = utcToInput(currentTask.date);
      addNewTaskFormDeleteBtn.classList.remove("hidden");
    }
  }
}
function closeTaskDialog() {
  addNewTaskBlock.classList.remove("active");
}

function updateTask(task) {
  for (let i = 0; i < tasks.length; i++) {
    if (task.id === tasks[i].id) {
      tasks[i].title = task.title;
      tasks[i].date = task.date;
      return true;
    }
  }
  return false;
}

function deleteTask(id) {
  const newTasksList = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks.splice(i, 1);
      console.log(`tasks.splice(i)`);
      break;
    }
  }
}
const addNewTaskForm = document.querySelector(".addNewTaskForm");
addNewTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTask = {
    id: addNewTaskForm.id ? addNewTaskForm.id : crypto.randomUUID(),
    title: event.target.elements["task-description"].value,
    // date: event.target.elements["task-date"].value,
    date: new Date(event.target.elements["task-date"].value).getTime(),
    completed: false,
  };

  console.log(newTask);
  if (getCurrentTaskById(newTask.id)) {
    updateTask(newTask);
  } else tasks.push(newTask);

  saveAllTasks();
  closeTaskDialog();
  showTasks();
});

// *******************************************************

const addNewTaskBtnInMain = document.querySelector(".addNewTask");

addNewTaskBtnInMain.addEventListener("click", () => {
  openTaskDialog();
});

// *******************************************************
const addNewTaskFormCancelBtn = document.querySelector(
  "#addNewTaskFormCancelBtn"
);

addNewTaskFormCancelBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  closeTaskDialog();
});
// *******************************************************
const addNewTaskFormDeleteBtn = document.querySelector(
  "#addNewTaskFormDeleteBtn"
);

addNewTaskFormDeleteBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  deleteTask(addNewTaskForm.id);
  saveAllTasks();
  showTasks();
  closeTaskDialog();
});
// *******************************************************
const filterAllBtn = document.querySelector(".filter-all");
const filterActiveBtn = document.querySelector(".filter-active");
const filterDoneBtn = document.querySelector(".filter-done");

const filterAllCheck = document.querySelector(".filter-all-check");
const filterActiveCheck = document.querySelector(".filter-active-check");
const filterDoneCheck = document.querySelector(".filter-done-check");

filterAllBtn.addEventListener("click", () => {
  filterAllBtn.classList.add("current");
  filterActiveBtn.classList.remove("current");
  filterDoneBtn.classList.remove("current");

  filterAllCheck.classList.remove("hidden");
  filterActiveCheck.classList.add("hidden");
  filterDoneCheck.classList.add("hidden");
  showTasks("all");
});

filterActiveBtn.addEventListener("click", () => {
  filterAllBtn.classList.remove("current");
  filterActiveBtn.classList.add("current");
  filterDoneBtn.classList.remove("current");

  filterAllCheck.classList.add("hidden");
  filterActiveCheck.classList.remove("hidden");
  filterDoneCheck.classList.add("hidden");
  showTasks("active");
});

filterDoneBtn.addEventListener("click", () => {
  filterAllBtn.classList.remove("current");
  filterActiveBtn.classList.remove("current");
  filterDoneBtn.classList.add("current");

  filterAllCheck.classList.add("hidden");
  filterActiveCheck.classList.add("hidden");
  filterDoneCheck.classList.remove("hidden");
  showTasks("done");
});

const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("input", () => {
  // console.log(`searchInput: ${searchInput.value}`);
  showTasks();
});
