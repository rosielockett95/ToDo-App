//  View the optimal layout for the app depending on their device's screen size
// - See hover states for all interactive elements on the page

// - Filter by all/active/complete todos
// - Clear all completed todos
// - Toggle light and dark mode
// - **Bonus**: Drag and drop to reorder items on the list
// - Select all button, so can delete all at once
// - Create the concept of lists or groups so that they can be categorised

const toDoInput = document.querySelector(".todo-text");
const toDoContainer = document.querySelector(".todo-entry");
const checkbox = document.querySelector(".todo-checkbox");
const allButton = document.getElementById("all");
const activeButton = document.getElementById("active");
const completedButton = document.getElementById("completed");
const todoItem = document.querySelectorAll(".todo-item");
let newDivArray = [];
let newDiv;
let todoText = toDoInput.value;

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
  console.log(newDivArray);
  const todoItem = document.querySelector(".todo-item");

  toDoInput.value = "";

  let newDivCheckbox = newDiv.querySelector(".todo-checkbox");
  let newDivText = newDiv.querySelector(".todo-text");

  function checkboxClickHandler(e) {
    if (e.target.checked) {
      newDivText.style.textDecoration = "line-through";
      setTimeout(() => {
        e.target.closest(".todo-item").style.display = "none";
      }, 500); // half a second delay
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
      console.log(true);
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
