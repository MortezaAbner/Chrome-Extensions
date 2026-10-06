export function initTasks() {
  const taskInput = document.getElementById('newTaskInput');
  const taskList = document.getElementById('taskList');

  if (!taskInput || !taskList) return;

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim() !== '') {
      const taskText = taskInput.value.trim();
      const div = document.createElement('div');
      div.className = 'task-item';
      div.innerHTML = `
        <input type="checkbox">
        <label>${taskText}</label>
      `;
      taskList.appendChild(div);
      taskInput.value = '';
    }
  });
}