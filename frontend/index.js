const API_URL = "https://todo-app-655q.onrender.com/api/todos";

const toDoInput = document.querySelector(".todo-text");
const toDoContainer = document.querySelector(".todo-list");
// const checkbox = document.querySelector(".todo-checkbox");
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
    toDoContainer.innerHTML = "";

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
clearCompletedButton.addEventListener("click", async () => {
  try {
    await fetch(`${API_URL}/completed`, {
      method: "DELETE",
    });

    document.querySelectorAll(".todo-item").forEach((todo) => {
      const checkbox = todo.querySelector(".todo-checkbox");
      if (checkbox.checked) {
        todo.remove();
      }
    });

    updateToDoCount();
  } catch (err) {
    console.error("Failed to clear completed todos:", err);
  }
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

function renderTodo(todo) {
  const newDiv = document.createElement("div");
  newDiv.className = "todo-item";
  newDiv.dataset.id = todo._id;
  newDiv.draggable = true;

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

  const checkBox = newDiv.querySelector(".todo-checkbox");
  const deleteBtn = newDiv.querySelector(".delete-btn");
  const todoTextEl = newDiv.querySelector(".todo-text");

  if (todo.completed === true) {
    todoTextEl.classList.add("completed");
  } else {
    todoTextEl.classList.remove("completed");
  }

  checkBox.addEventListener("change", async (e) => {
    const id = newDiv.dataset.id;
    const completed = e.target.checked;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      // toggle CSS class on change
      todoTextEl.classList.toggle("completed", completed);
      updateToDoCount();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  });

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

  toDoContainer.appendChild(newDiv);
}

loadTodos();

let draggedItem = null;

toDoContainer.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("todo-item")) {
    draggedItem = e.target;
    e.target.classList.add("dragging");
  }
});

toDoContainer.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("todo-item")) {
    e.target.classList.remove("dragging");
  }
});

toDoContainer.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterElement = getDragAfterElement(toDoContainer, e.clientY);
  const current = document.querySelector(".dragging");

  if (!afterElement) {
    toDoContainer.appendChild(current);
  } else {
    toDoContainer.insertBefore(current, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
