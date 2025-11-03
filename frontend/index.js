//  View the optimal layout for the app depending on their device's screen size
// - See hover states for all interactive elements on the page

// - **Bonus**: Drag and drop to reorder items on the list

// - Create the concept of lists or groups so that they can be categorised

const API_URL = "http://localhost:3000/api/todos";

const toDoInput = document.querySelector(".todo-text");
const toDoContainer = document.querySelector(".todo-list");
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

// Load todos from backend
async function loadTodos() {
  try {
    const res = await fetch(API_URL);
    const todos = await res.json();

    // clear current items
    // toDoContainer.innerHTML = "";

    todos.forEach((todo) => renderTodo(todo));
    updateToDoCount();
  } catch (err) {
    console.error("Error loading todos:", err);
  }
}

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

async function addToDoToList() {
  const text = toDoInput.value.trim();
  if (!text) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const savedTodo = await res.json();

    renderTodo(savedTodo); // render using the new helper
    updateToDoCount();
    toDoInput.value = "";
  } catch (err) {
    console.error("Error adding todo:", err);
  }
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

function renderTodo(todo) {
  const newDiv = document.createElement("div");
  newDiv.className = "todo-item";
  newDiv.dataset.id = todo._id; // store MongoDB ID for later actions
  newDiv.innerHTML = `
    <li>
      <label class="todo-check">
        <input type="checkbox" class="todo-checkbox" ${
          todo.completed ? "checked" : ""
        } />
      </label>
      <input 
        type="text"
        class="todo-text"
        value="${todo.text}"
        disabled
      />
      <button class="delete-btn">✕</button>
    </li>
  `;

  // checkbox toggle support
  const checkBox = newDiv.querySelector(".todo-checkbox");
  const deleteBtn = newDiv.querySelector(".delete-btn");
  const todoTextEl = newDiv.querySelector(".todo-text");

  checkBox.addEventListener("change", async (e) => {
    const id = newDiv.dataset.id;
    const completed = e.target.checked;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      todoTextEl.style.textDecoration = completed ? "line-through" : "none";
      todoTextEl.style.opacity = completed ? "0.5" : "1";
      updateToDoCount();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  });

  // delete button
  deleteBtn.addEventListener("click", async () => {
    const id = newDiv.dataset.id;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      newDiv.remove();
      updateToDoCount();
    } catch (err) {
      console.error("Delete error:", err);
    }
  });

  // append item into the list
  // make sure `toDoContainer` is the <ul> or list wrapper
  toDoContainer.appendChild(newDiv);
}

loadTodos();
