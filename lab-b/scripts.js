/*Wiekszość pisane recznie przy wskazówkach caluda i jego podpowiedziach*/
class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasksList')) || [];
        this.term = '';
        this.editingIndex = null;
        this.draw();
    }

    get filteredTasks() {
        if (this.term.length < 2) {
            return this.tasks;
        } else {
            return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
        }
    }
    save() {
        localStorage.setItem('tasksList', JSON.stringify(this.tasks));
    }

    /*Claude: wydzielił walidację z add() do osobnej metody validate(), żeby używać jej przy dodawaniu i edycji*/
    validate(text, date) {
        const errors = [];

        if (text.length < 3) {
            errors.push('Zadanie musi mieć co najmniej 3 znaki!');
        }
        if (text.length > 255) {
            errors.push('Zadanie może mieć najwyżej 255 znaków!');
        }
        if (date !== '') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (new Date(date) < today) {
                errors.push('Data nie może być wcześniejsza niż dzisiaj!');
            }
        }

        return errors;
    }

    add(text, date) {
        const item = text.trim();
        const errors = this.validate(item, date);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        /*Wygenerowane przy użyciu Claude*/
        this.tasks.push({text: item, date: date});
        this.save();
        this.draw();
        return true;
    }

    remove(index) {
        this.tasks.splice(index, 1);
        this.editingIndex = null;
        this.save();
        this.draw();
    }

    /*Claude: pomógł zaimplementować edycję po kliknięciu w zadanie (pola input zamiast tekstu, zapis przy focusout)*/
    draw() {
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = '';
        const tasks = this.filteredTasks;
        for (let i = 0; i < tasks.length; i++) {

            const idx = this.tasks.indexOf(tasks[i]);

            const listItem = document.createElement('div');
            listItem.className = 'task';

            let nameInput = null;

            if (idx === this.editingIndex) {
                nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = tasks[i].text;

                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = tasks[i].date;

                listItem.appendChild(nameInput);
                listItem.appendChild(dateInput);

                listItem.addEventListener('focusout', (event) => {
                    if (listItem.contains(event.relatedTarget)) {
                        return;
                    }
                    if (!this.edit(idx, nameInput.value, dateInput.value)) {
                        nameInput.focus();
                    }
                });
            } else {
                const taskName = document.createElement('span');
                taskName.className = 'task-name';
                this.highlight(taskName, tasks[i].text);

                const taskDate = document.createElement('span');
                taskDate.className = 'task-date';
                taskDate.textContent = tasks[i].date;

                listItem.appendChild(taskName);
                listItem.appendChild(taskDate);
                listItem.addEventListener('click', () => this.startEdit(idx));
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.remove(idx);
            });
            listItem.appendChild(deleteButton);
            listContainer.appendChild(listItem);

            if (nameInput) {
                nameInput.focus();
            }
        }
    }

    search(query) {
        this.term = query;
        this.draw();
    }

    highlight(element,text){
        if (this.term.length < 2){
            element.textContent = text;
            return;
        }

        const startIdx = text.toLowerCase().indexOf(this.term.toLowerCase());
        const endIdx = startIdx + this.term.length;

        element.appendChild(document.createTextNode(text.slice(0, startIdx)));

        /*Claude: wygenerował opakowanie wyszukanej frazy w element <mark>*/
        const mark = document.createElement('mark')

        mark.textContent = text.slice(startIdx, endIdx);
        element.appendChild(mark);

        element.appendChild(document.createTextNode(text.slice(endIdx)));

    }

    startEdit(idx){
        this.editingIndex = idx;
        this.draw();
    }

    edit(idx,text,date){
        const item = text.trim();
        const errors = this.validate(item,date);

        if (errors.length > 0){
            alert(errors.join('\n'));
            return false;
        }

        this.tasks[idx] = {text: item, date: date};
        this.editingIndex = null;
        this.save();
        this.draw();
        return true;
    }
}

document.todo = new Todo();

const addItemButton = document.getElementById('addItemButton');
const searchInput = document.getElementById('search-input');

addItemButton.addEventListener('click', () => {
    const itemInput = document.getElementById("task-input");
    const dateInput = document.getElementById("date-input");
    if (document.todo.add(itemInput.value, dateInput.value)) {
        itemInput.value = '';
        dateInput.value = '';
    }
});

searchInput.addEventListener('input', () => {
    document.todo.search(searchInput.value);
});
