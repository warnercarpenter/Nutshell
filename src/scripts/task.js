import timeConverter from "./timestampparser";

const tasksModule = {
    taskToHTML: function (taskObject, userId) {
        const taskTimestamp = timeConverter(taskObject.completion_date)
        let baseHTML = `
            <section class="tasks" id="task--${taskObject.id}">
            <div class="taskName" id="taskName--${taskObject.id}">${taskObject.name}</div>
            <p class="taskDate" id="completion_date">${taskTimestamp}</p>
            <label>Completed</label>
            <input type="checkbox" id="tasks--delete--${taskObject.id}"><br>
        `

        baseHTML += "</section><hr/>"

        return baseHTML
    },
    taskForm: function (objectId) {
        return `
        <fieldset>
            <input type="hidden" id="userId" value="${objectId}"><br>
            <label for="name">Name of task: </label><br>
            <input type="text" placeholder="Task name" id="taskName">
        </fieldset>
        <fieldset>
            <label for="completion_date">Date to be completed by: </label><br>
            <input type="date" id="taskDate">
        <fieldset>
            <button id="tasks--create">Submit</button>
        </fieldset>
        `
    },
    captureFormValues: function () {
        let date = document.querySelector("#taskDate").value;
        let timestamp = new Date(date);
        let true_timestamp = timestamp.getTime();

        const taskObject = {
            name: document.querySelector("#taskName").value,
            completion_date: true_timestamp,
            userId: parseInt(sessionStorage.getItem("userId"))
        }
        return taskObject
    }
}

export default tasksModule