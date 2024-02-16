let tasks = []
const tasksContainer = document.querySelector('.tasks_container')
const taskInput = document.querySelector('#task_text_input')

function generateId() {
    return crypto.randomUUID()
}

function syncWithStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkCard(id) {
    const i = tasks.findIndex(task => task.id === id);
    tasks[i].checked = !tasks[i].checked;
    syncWithStorage();
}

function createCard(task) {
    const card = document.createElement('div');
    card.classList.add('task_card');
    card.id = `task_${task.id}`
    card.innerHTML = `
        <div class="task_card__task">
            <input type="checkbox" onclick="checkCard('${task.id}')" ${task.checked ? 'checked' : ''}>
            <h3>${task.text}</h3>
        </div>
        <button id="delete_btn" onclick="deleteCard('${task.id}')">Удалить</button>
    `;
    tasksContainer.append(card);
}

function renderCards(data) {
    tasksContainer.innerHTML = '';
    data.map(task => createCard(task))
}

function deleteCard(id) {
    const i = tasks.findIndex(task => task.id === id);
    tasks.splice(i, 1);
    document.querySelector('#task_' + id).remove();
    syncWithStorage();
}

function addCard() {
    const text = taskInput.value;
    if (text === '') return;
    const task = {
        id: generateId(),
        checked: false,
        text
    }
    tasks.push(task);
    syncWithStorage();
    createCard(task)
    taskInput.value = ''
}

function init() {
    tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    renderCards(tasks)

    taskInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addCard()
        }
    })
}

function filterActive() {
    const active = tasks.filter(task => !task.checked);
    renderCards(active)
    document.querySelectorAll('.navigation__tabs *').forEach(e => {
        e.classList.remove("active");
    })
    document.querySelector('.navigation__tabs button:nth-child(2)').classList.add("active");
}

function filterChecked() {
    const checked = tasks.filter(task => task.checked);
    renderCards(checked)
    document.querySelectorAll('.navigation__tabs *').forEach(e => {
        e.classList.remove("active");
    })
    document.querySelector('.navigation__tabs button:nth-child(3)').classList.add("active");
}
function showAll() {
    renderCards(tasks)
    document.querySelectorAll('.navigation__tabs *').forEach(e => {
        e.classList.remove("active");
    })
    document.querySelector('.navigation__tabs button:nth-child(1)').classList.add("active");
}

init()