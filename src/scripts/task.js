
const taskManager = {
    taskToHTML: function (taskObject) {
        return `
            <h1>${taskObject.name}</h1>
            <section id="completion__date">${taskObject.completion__date}</section>
            <label for="is__complete__boolean" id="task__complete__boolean">${taskObject.is__complete__boolean}</label>

            <button id="deleteButton--${taskObject.id}">Delete ${taskObject.name}</button>
            <button id="editButton--${taskObject.id}">Edit ${taskObject.name}</button>

        `
    },
    taskForm: function () {
        return `
            <input type="hidden" id="userId" value="${userId}"><br>
            <label for="name">Name of task: </label><br>

            <input type="text" placeholder="Task name" id="taskName">
            <label for="completion__date">Date to be completed by: </label><br>

            <input type="date" id="taskDate">
            <label>Is task complete: </label><br>

            <input type="checkbox" id="taskComplete" value="Yes">Yes<br>
            <input type="checkbox" id="taskComplete" value="No">No<br>
        `
    },
    captureFormValues: function () {
        const taskObject = {
            name: document.querySelector("#taskName").value,
            completion__date: document.querySelector("#taskDate").value,
            is__complete__boolean: document.querySelector("#taskComplete").value,
        }
        return taskObject
    }
}


