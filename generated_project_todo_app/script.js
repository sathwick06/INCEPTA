// script.js - VibrantTodo core logic

// Data model
const tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'
let draggedTaskId = null;

// Utility: generate UUID
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Persistence
function saveTasks() {
  localStorage.setItem('vibrantTodoTasks', JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem('vibrantTodoTasks');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        tasks.push(...parsed);
        // Ensure order is numeric and sort
        tasks.sort((a, b) => a.order - b.order);
      }
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
    }
  }
}

function saveThemePreference(theme) {
  localStorage.setItem('vibrantTodoTheme', theme);
}

function loadThemePreference() {
  const theme = localStorage.getItem('vibrantTodoTheme');
  return theme === 'dark' ? 'dark' : 'light';
}

// DOM references (cached after DOMContentLoaded)
let elNewTaskInput, elNewTaskDue, elAddTaskBtn, elTaskList, elThemeToggle, elFilterButtons, elClearCompleted, elTasksLeft, elApp;

function cacheDomElements() {
  elNewTaskInput = document.getElementById('new-task-input');
  elNewTaskDue = document.getElementById('new-task-due');
  elAddTaskBtn = document.getElementById('add-task-btn');
  elTaskList = document.getElementById('task-list');
  elThemeToggle = document.getElementById('theme-toggle');
  elFilterButtons = document.querySelectorAll('.filter-btn');
  elClearCompleted = document.getElementById('clear-completed');
  elTasksLeft = document.getElementById('tasks-left');
  elApp = document.getElementById('app');
}

// CRUD operations
function addTask(text, dueDate) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const order = tasks.length ? Math.max(...tasks.map(t => t.order)) + 1 : 0;
  const task = {
    id: generateId(),
    text: trimmed,
    dueDate: dueDate ? dueDate : null,
    completed: false,
    order,
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function editTask(id, newText, newDueDate) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.text = newText.trim() || task.text;
  task.dueDate = newDueDate ? newDueDate : null;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  const remaining = tasks.filter(t => !t.completed);
  tasks.length = 0;
  tasks.push(...remaining);
  // Reassign order to keep sequence
  tasks.forEach((t, i) => (t.order = i));
  saveTasks();
  renderTasks();
}

// Rendering
function renderTasks(filter = currentFilter) {
  // Clear list
  elTaskList.innerHTML = '';
  // Filter and sort
  const filtered = tasks
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true; // all
    })
    .sort((a, b) => a.order - b.order);

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;
    li.draggable = true;
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
      <span class="task-text">${escapeHtml(task.text)}</span>
      ${task.dueDate ? `<span class="task-due">${escapeHtml(task.dueDate)}</span>` : ''}
      <button class="edit-btn" title="Edit">✎</button>
      <button class="delete-btn" title="Delete">✖</button>
    `;

    // Event listeners for item controls
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit task text:', task.text);
      if (newText === null) return; // cancel
      const newDue = prompt('Edit due date (YYYY-MM-DD) or leave blank:', task.dueDate || '');
      editTask(task.id, newText, newDue.trim() || null);
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Drag & Drop handlers
    li.addEventListener('dragstart', onDragStart);
    li.addEventListener('dragover', onDragOver);
    li.addEventListener('dragleave', onDragLeave);
    li.addEventListener('drop', onDrop);
    li.addEventListener('dragend', onDragEnd);

    // Keyboard accessibility: up/down arrows to move when focused
    li.tabIndex = 0; // make focusable
    li.addEventListener('keydown', onTaskKeyDown);

    elTaskList.appendChild(li);
  });

  // Update tasks left counter
  const activeCount = tasks.filter(t => !t.completed).length;
  elTasksLeft.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;

  // Update filter button active states
  elFilterButtons.forEach(btn => {
    const btnFilter = btn.dataset.filter;
    if (btnFilter === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Event Handlers
function onAddTaskClick() {
  const text = elNewTaskInput.value;
  const due = elNewTaskDue.value;
  addTask(text, due);
  elNewTaskInput.value = '';
  elNewTaskDue.value = '';
}

function onInputKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    addTask(elNewTaskInput.value, elNewTaskDue.value);
    elNewTaskInput.value = '';
    elNewTaskDue.value = '';
  } else if (e.key === 'Escape') {
    elNewTaskInput.value = '';
    elNewTaskDue.value = '';
  } else if (e.key === 'Enter' && e.ctrlKey) {
    // Ctrl+Enter also adds task (same as button)
    e.preventDefault();
    onAddTaskClick();
  }
}

function onThemeToggle() {
  const isDark = elApp.classList.toggle('theme-dark');
  if (isDark) {
    elApp.classList.remove('theme-light');
    saveThemePreference('dark');
  } else {
    elApp.classList.add('theme-light');
    saveThemePreference('light');
  }
}

function onFilterClick(e) {
  const filter = e.currentTarget.dataset.filter;
  if (filter) {
    currentFilter = filter;
    renderTasks();
  }
}

function onClearCompleted() {
  clearCompleted();
}

// Drag & Drop functions
function onDragStart(e) {
  draggedTaskId = e.currentTarget.dataset.id;
  e.dataTransfer.effectAllowed = 'move';
  // For Firefox compatibility
  e.dataTransfer.setData('text/plain', draggedTaskId);
  e.currentTarget.classList.add('dragging');
}

function onDragOver(e) {
  e.preventDefault(); // necessary to allow drop
  e.dataTransfer.dropEffect = 'move';
  const target = e.currentTarget;
  if (target && target !== e.target) {
    target.classList.add('drag-over');
  }
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const targetLi = e.currentTarget;
  targetLi.classList.remove('drag-over');
  const dropId = targetLi.dataset.id;
  if (!draggedTaskId || draggedTaskId === dropId) return;

  const draggedIdx = tasks.findIndex(t => t.id === draggedTaskId);
  const dropIdx = tasks.findIndex(t => t.id === dropId);
  if (draggedIdx === -1 || dropIdx === -1) return;

  // Remove dragged task
  const [draggedTask] = tasks.splice(draggedIdx, 1);
  // Insert at new position
  tasks.splice(dropIdx, 0, draggedTask);

  // Reassign order based on array position
  tasks.forEach((t, i) => (t.order = i));
  saveTasks();
  renderTasks();
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedTaskId = null;
  // Clean any leftover classes
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function onTaskKeyDown(e) {
  const li = e.currentTarget;
  const id = li.dataset.id;
  if (!id) return;
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveTask(id, -1);
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveTask(id, 1);
  }
}

function moveTask(id, direction) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= tasks.length) return;
  // Swap order
  const temp = tasks[idx];
  tasks[idx] = tasks[newIdx];
  tasks[newIdx] = temp;
  // Reassign order numbers
  tasks.forEach((t, i) => (t.order = i));
  saveTasks();
  renderTasks();
  // Restore focus to moved element after render
  setTimeout(() => {
    const newLi = elTaskList.querySelector(`li[data-id="${id}"]`);
    if (newLi) newLi.focus();
  }, 0);
}

// Initialization
function init() {
  cacheDomElements();
  loadTasks();
  // Theme initialization
  const savedTheme = loadThemePreference();
  if (savedTheme === 'dark') {
    elApp.classList.add('theme-dark');
    elApp.classList.remove('theme-light');
  } else {
    elApp.classList.add('theme-light');
    elApp.classList.remove('theme-dark');
  }

  // Event listeners
  elAddTaskBtn.addEventListener('click', onAddTaskClick);
  elNewTaskInput.addEventListener('keydown', onInputKeyDown);
  elNewTaskDue && elNewTaskDue.addEventListener('keydown', onInputKeyDown);
  elThemeToggle && elThemeToggle.addEventListener('click', onThemeToggle);
  elFilterButtons.forEach(btn => btn.addEventListener('click', onFilterClick));
  elClearCompleted && elClearCompleted.addEventListener('click', onClearCompleted);

  renderTasks();
}

// Run when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing (optional)
window.VibrantTodo = {
  addTask,
  editTask,
  deleteTask,
  toggleComplete,
  clearCompleted,
  tasks,
  renderTasks,
  saveTasks,
  loadTasks,
  currentFilter,
};
