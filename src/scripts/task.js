
const tasksModule = {
    taskToHTML: function (taskObject) {
        return `
            <h1>${taskObject.name}</h1>
            <section id="completion_date">${taskObject.completion_date}</section>
            <label for="is_complete" id="task_complete">${taskObject.is_complete}</label>

            <button id="deleteButton--${taskObject.id}">Delete ${taskObject.name}</button>
            <button id="editButton--${taskObject.id}">Edit ${taskObject.name}</button>

        `
    },
    taskForm: function (userId) {
        return `
            <input type="hidden" id="userId" value="${userId}"><br>
            <label for="name">Name of task: </label><br>

            <input type="text" placeholder="Task name" id="taskName">
            <label for="completion_date">Date to be completed by: </label><br>

            <input type="date" id="taskDate">
            <label>Is task complete: </label><br>

            <input type="checkbox" id="taskComplete" value="Yes">Yes<br>
            <input type="checkbox" id="taskComplete" value="No">No<br>
        `
    },
    captureFormValues: function () {
        const taskObject = {
            name: document.querySelector("#taskName").value,
            completion_date: document.querySelector("#taskDate").value,
            is_complete: document.querySelector("#taskComplete").value,
            userId: Window.sessionStorage.getItem("userId")
        }
        return taskObject
    }
}

export default tasksModule;