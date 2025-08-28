const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const countEl = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filters button[data-filter]');
const clearBtn = document.getElementById('clearCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'all';

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';

  let filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = t.id;
    li.className = t.completed ? 'completed' : '';

    li.innerHTML = `
      <input type="checkbox" ${t.completed ? 'checked' : ''}>
      <label>${t.text}</label>
      <button class="delete" aria-label="Delete task">&times;</button>
    `;

    list.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
}

// Add
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, completed: false });
  input.value = '';
  save();
  render();
});

// Toggle complete or delete
list.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  const task = tasks.find(t => t.id == id);

  if (e.target.matches('input[type="checkbox"]')) {
    task.completed = e.target.checked;
    save();
    render();
  }
  if (e.target.matches('button.delete')) {
    tasks = tasks.filter(t => t.id != id);
    save();
    render();
  }
});

// Edit in place
list.addEventListener('dblclick', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  const task = tasks.find(t => t.id == id);

  const edit = document.createElement('input');
  edit.type = 'text';
  edit.value = task.text;
  li.innerHTML = '';
  li.appendChild(edit);
  edit.focus();

  const finish = (saveEdit) => {
    if (saveEdit) task.text = edit.value.trim() || task.text;
    save();
    render();
  };

  edit.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') finish(true);
    if (ev.key === 'Escape') finish(false);
  });
  edit.addEventListener('blur', () => finish(true));
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

// Clear Completed
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
});

// Initial render
render();
