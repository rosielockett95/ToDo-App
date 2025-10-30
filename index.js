//  View the optimal layout for the app depending on their device's screen size
// - See hover states for all interactive elements on the page

// - **Bonus**: Drag and drop to reorder items on the list

// - Create the concept of lists or groups so that they can be categorised

const toDoInput = document.querySelector(".todo-text");
const toDoContainer = document.querySelector(".todo-entry");
const checkbox = document.querySelector(".todo-checkbox");
const allButton = document.getElementById("all");
const activeButton = document.getElementById("active");
const completedButton = document.getElementById("completed");
const todoItem = document.querySelectorAll(".todo-item");
const dropDownBtn = document.querySelector(".dropbtn");
const dropDownContent = document.querySelector(".drop-down-menu-content");
let newDivArray = [];
let newDiv;
let todoText = toDoInput.value;

// Update to do count when checkbox is ticked
document.addEventListener("change", (event) => {
  if (event.target.classList.contains("todo-checkbox")) {
    updateToDoCount();
  }
});

// - Add new todos to the list
const onKeyDown = (e) => {
  if (e.key === "Enter") {
    addToDoToList();
  }
};

function addToDoToList() {
  let todoText = toDoInput.value;

  const newDiv = document.createElement("div");
  newDiv.className = "todo-item";
  newDiv.innerHTML = `
            <li>
              <label class="todo-check">
                <input type="checkbox" class="todo-checkbox" />
              </label>
              <input 
                type="text"
                class="todo-text"
                placeholder="${todoText}"
                aria-label="Todo item"
              />
            </li>
         `;

  toDoContainer.appendChild(newDiv);
  newDivArray.push(newDiv);
  const todoItem = document.querySelector(".todo-item");
  console.log(newDivArray.indexOf(newDiv));
  updateToDoCount();

  toDoInput.value = "";

  let newDivCheckbox = newDiv.querySelector(".todo-checkbox");
  let newDivText = newDiv.querySelector(".todo-text");

  function checkboxClickHandler(e) {
    if (e.target.checked) {
      newDivText.style.textDecoration = "line-through";
      // setTimeout(() => {
      //   e.target.closest(".todo-item").style.display = "none";
      // }, 500); // half a second delay
    }
  }

  newDivCheckbox.addEventListener("click", checkboxClickHandler);
}

toDoInput.addEventListener("keydown", onKeyDown);

// - Filter by all/active/complete todos

function updateTasks(filter) {
  const todoItem = document.querySelectorAll(".todo-item");

  todoItem.forEach((todo) => {
    const checkbox = todo.querySelector(".todo-checkbox");
    if (filter === "completed" && checkbox.checked) {
      todo.style.display = "flex";
    } else if (filter === "active" && !checkbox.checked) {
      todo.style.display = "flex";
    } else if (filter === "all") {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
}

completedButton.addEventListener("click", () => updateTasks("completed"));
activeButton.addEventListener("click", () => updateTasks("active"));
allButton.addEventListener("click", () => updateTasks("all"));

// - Clear all completed todos
const clearCompletedButton = document.getElementById("clear-completed");
clearCompletedButton.addEventListener("click", () => {
  const todoItem = document.querySelectorAll(".todo-item");
  todoItem.forEach((todo) => {
    const checkbox = todo.querySelector(".todo-checkbox");
    if (checkbox.checked) {
      todo.remove();
    }
    updateToDoCount();
  });
});

// Add dynamic number
function updateToDoCount() {
  const itemsLeftCount = document.getElementById("items-left-count");
  const toDoCount = newDivArray.length;
  const todoItem = document.querySelectorAll(".todo-item");
  const activeItems = Array.from(todoItem).filter((todo) => {
    const checkbox = todo.querySelector(".todo-checkbox");
    return !checkbox.checked; // only count unchecked
  });

  itemsLeftCount.textContent = `${activeItems.length} item${
    activeItems.length !== 1 ? "s" : ""
  } left`;
}

// - Select all button, so can delete all at once
const selectAllBtn = document.getElementById("select-all-btn");
const deselectAllBtn = document.getElementById("deselect-all-btn");

selectAllBtn.addEventListener("click", () => {
  const checkboxElements = document.querySelectorAll(".todo-checkbox");
  checkboxElements.forEach((checkbox) => {
    checkbox.checked = true;
  });
});

deselectAllBtn.addEventListener("click", () => {
  const checkboxElements = document.querySelectorAll(".todo-checkbox");
  checkboxElements.forEach((checkbox) => {
    checkbox.checked = false;
  });
});

// - Toggle light and dark mode

const darkModeBtn = document.getElementById("dark-mode-btn");
const btnEl = document.getElementById("mode-btn");

darkModeBtn.addEventListener("click", () => {
  if (btnEl.src.includes("images/icon-moon.svg")) {
    btnEl.src = "images/icon-sun.svg";
  } else {
    btnEl.src = "images/icon-moon.svg";
  }
  document.documentElement.classList.toggle("dark");
});

dropDownBtn.addEventListener("click", () => {
  dropDownContent.classList.toggle("hidden");
});
