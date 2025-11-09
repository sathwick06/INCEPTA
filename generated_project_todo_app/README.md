# VibrantTodo

**VibrantTodo** is a modern, responsive web-based to‑do list application that helps you stay organized with a clean UI, powerful task management features, and a touch of personalization. All data is stored locally in your browser, so you can manage tasks offline without any server.

---

## Tech Stack
- **HTML5** – Semantic markup for the app structure.
- **CSS3** – Custom styling, responsive layout, dark/light themes, and drag‑and‑drop animations.
- **JavaScript (ES6+)** – Core application logic, event handling, localStorage persistence, and keyboard shortcuts.

---

## Features
- **Add Tasks** – Quickly create new tasks with a title and optional description.
- **Edit Tasks** – Inline editing of task title and description.
- **Delete Tasks** – Remove tasks with a single click.
- **Complete / Incomplete** – Toggle task status; completed tasks are visually distinct.
- **Filters** – View *All*, *Active*, or *Completed* tasks.
- **Drag‑and‑Drop** – Reorder tasks by dragging them within the list.
- **Theme Switcher** – Switch between Light and Dark modes; preference is saved.
- **Keyboard Shortcuts** –
  - `Enter` – Add a new task when the input field is focused.
  - `Ctrl + D` – Delete the currently selected task.
  - `Ctrl + E` – Edit the selected task.
  - `Ctrl + ↑/↓` – Move the selected task up or down.
- **Persistence** – All tasks, order, and theme preference are saved to `localStorage` and restored on page load.

---

## Installation / Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/vibranttodo.git
   cd vibranttodo
   ```
2. **Open the application**
   - Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
   - No additional build steps or server are required.

---

## Usage Guide
### Adding a Task
1. Click the **"Add Task"** button or focus the input field at the top.
2. Type the task title (and press `Enter` if you prefer the keyboard shortcut).
3. The task appears at the bottom of the list.

### Editing a Task
- Click the **pencil** icon on a task, or select the task and press `Ctrl + E`.
- Modify the title/description and press `Enter` or click outside to save.

### Deleting a Task
- Click the **trash** icon, or select the task and press `Ctrl + D`.

### Completing a Task
- Click the checkbox next to a task or press the space bar while the task is focused.

### Using Filters
- At the top of the list, click **All**, **Active**, or **Completed** to filter the view.

### Drag‑and‑Drop Reordering
- Click and hold a task, then drag it to the desired position. Release to drop. The new order is saved automatically.

### Theme Switching
- Click the **theme toggle** button (sun/moon icon) in the header to switch between Light and Dark modes. Your choice is remembered across sessions.

### Keyboard Shortcuts Overview
| Shortcut | Action |
|----------|--------|
| `Enter` (focused on input) | Add new task |
| `Ctrl + D` | Delete selected task |
| `Ctrl + E` | Edit selected task |
| `Ctrl + ↑` / `Ctrl + ↓` | Move selected task up/down |
| `Space` (when a task is focused) | Toggle completion |

---

## Development Notes
### File Structure
```
/vibranttodo
│   index.html      ← Main HTML markup
│   styles.css      ← All visual styling, theme variables, responsive layout
│   script.js       ← Core JavaScript logic (task CRUD, drag‑and‑drop, persistence)
│   README.md       ← Project documentation (this file)
```

- **Styling** – Modify `styles.css` to adjust colors, fonts, or layout. Theme variables are defined at the top of the file for easy customization.
- **Core Logic** – `script.js` contains:
  - Task model and array management.
  - Functions for creating, updating, deleting, and rendering tasks.
  - Drag‑and‑drop event handlers.
  - LocalStorage read/write utilities.
  - Keyboard shortcut bindings.
- **Persistence** – All tasks are stored in `localStorage` under the key `vibrantTodoTasks`. The current theme is saved under `vibrantTodoTheme`. On page load, `script.js` reads these values and restores the UI state.

---

## Contributing (Optional)
Contributions are welcome! If you’d like to improve VibrantTodo:
1. Fork the repository.
2. Create a new branch for your feature or bug‑fix.
3. Ensure the UI remains responsive and the existing tests (if any) pass.
4. Submit a pull request with a clear description of your changes.

Please follow the existing code style and keep the documentation up‑to‑date.

---

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
