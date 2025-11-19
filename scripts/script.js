// https://www.figma.com/file/h7ecVRqH6mqrf2JYkCyb0C/To-do-list-(Community)?type=design&node-id=348-221&mode=design

// 1 этап: верстка,
// 2 этап: добавление задачи, подключение к localstorage,
// 3 этап: фильтрация, редактирование

// доп. функ: поиск, редактирование задачи(название, время)

// task(entity):{
//     id:String|Number, // Math.random() | Sate.now()
//     title: String,
//     date: String | Number,
//     completed: Boolean //false->true
// }

// const tasksR = [
//   {
//     id: 0.111111,
//     title: "Learn React",
//     date: "12.12.2025",
//     completed: false,
//   },
//   {
//     id: 0.222222,
//     title: "Покормить кошку",
//     date: "11 января, 12:30",
//     completed: true,
//   },
//   {
//     id: 0.333333,
//     title: "Покормить собаку",
//     date: "12 января, 13:30",
//     completed: false,
//   },
//   {
//     id: 0.444444,
//     title: "Покормить касатку",
//     date: "13 января, 14:30",
//     completed: false,
//   },
// ];

const tasks = JSON.parse(localStorage.getItem("myToDo")) || [];
// const tasks = JSON.parse(localStorage.getItem("myToDo")) || tasksR;
window.addEventListener("DOMContentLoaded", () => {
  tasks.length !== 0 && renderAllTasks(tasks);
});

// const currentWeekDay = document.querySelector(".current-weekday").textContent;
// console.log(currentWeekDay);
// const currentDate = document.querySelector(".current-date").textContent;
// console.log(currentDate);
// const searchInput = document.querySelector(".search-input").value;
// console.log(searchInput);

// const filterBtnAll = document.querySelector(".filter-all");
// console.log(filterBtnAll);

// const filterBtnActive = document.querySelector(".filter-active");
// console.log(filterBtnActive);

// const filterBtnCompleted = document.querySelector(".filter-completed");
// console.log(filterBtnCompleted);

// const listOfTasks2 = document.querySelectorAll("#tasks>li");
// console.log(listOfTasks2);

// function getTaskInfo(task) {
//   const taskCompleted = task.querySelector('input[type="checkbox"]').checked;
//   const taskId = task.querySelector('input[type="checkbox"]').id;
//   const taskDateTime = task.querySelector(".task-date").textContent;
//   const taskToDo = task.querySelector(".task-todo").textContent;
//   console.log(`taskCompleted [${taskCompleted}]`);
//   console.log(`taskDateTime [${taskDateTime}]`);
//   console.log(`taskToDo [${taskToDo}]`);
//   console.log(`Task id [${taskId}]`);
// }

// for (let i = 0; i < listOfTasks2.length; i++) {
//   console.log(listOfTasks2[i]);
//   getTaskInfo(listOfTasks2[i]);
// }

function remove(evt) {
  // evt.target будет указывать на элемент <li>, по которому был произведён клик
  // evt.currentTarget будет указывать на родительский элемент <ul>
  evt.target.remove();
}

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

// *******************************************************
function saveAllTasks() {
  localStorage.setItem("myToDo", JSON.stringify(tasks));
}
function changeTaskStatus(id, value) {
  for (let i = 0; i < tasks.length; i++) {
    if (id === tasks[i].id) {
      tasks[i].completed = value;
      saveAllTasks();
      renderAllTasks();
      return true;
    }
  }
  return false;
}

function createTaskHTML(task) {
  const li = document.createElement("li");
  const date = new Date(task.date);
  const [yearMonthDay, time] = task.date.split("T");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = task.id;
  input.checked = task.completed;

  const label = document.createElement("label");
  label.setAttribute("for", task.id);

  const pDate = document.createElement("p");
  pDate.className = "task-date";
  pDate.textContent = task.date;

  const pTask = document.createElement("p");
  pTask.className = "task-todo";
  if (task.completed) pTask.className += " deleted-text";

  pTask.textContent = task.title;

  input.addEventListener("change", function () {
    changeTaskStatus(this.id, this.checked);
    // if (this.checked) {
    //   console.log("Чекбокс отмечен ✅");
    // } else {
    //   console.log("Чекбокс снят ❌");
    // }
  });

  label.appendChild(pDate);
  label.appendChild(pTask);

  li.appendChild(input);
  li.appendChild(label);

  //   li.innerHTML = `
  //     <input type="checkbox" id="${task.id}" ${task.completed ? "checked" : ""} />
  //     <label for="${task.id}">
  //       <p class="task-date">${date.getDate()} ${
  //     months[date.getMonth()]
  //   } ${date.getFullYear()}, ${time}</p>
  //       <p class="task-todo ${task.completed ? "deleted-text" : ""}">${
  //     task.title
  //   }</p>
  //     </label>
  //   `;

  // Добавим обработчик события на список
  // Он будет вызываться при клике на каждом элементе <li>
  //   li.addEventListener("click", setChecked, false);

  return li;
}

const addNewTaskBtn = document.querySelector("#addNewTaskForm");
const listOfTasks = document.querySelector("#tasks");

function renderAllTasks() {
  const listOfTasks = document.querySelector("#tasks");
  listOfTasks.innerHTML = "";
  for (let i = 0; i < tasks.length; i++) {
    listOfTasks.appendChild(createTaskHTML(tasks[i]));
  }
}

addNewTaskBtn.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTask = {
    id: crypto.randomUUID(),
    title: event.target.elements["task-description"].value,
    date: event.target.elements["task-date"].value,
    // date: new Date(event.target.elements["task-date"].value).getTime(),
    completed: false,
  };
  console.log(newTask);
  tasks.push(newTask);
  addNewTaskBtn.reset();
  saveAllTasks();
  renderAllTasks();
});
