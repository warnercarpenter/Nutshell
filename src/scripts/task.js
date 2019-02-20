import timeConverter from "./timestampparser";

const tasksModule = {
    taskToHTML: function (taskObject, userId) {
        const taskTimestamp = timeConverter(taskObject.completion_date).split(",").join(" ")
        const splitDate = taskTimestamp.split(" ")
        splitDate.length = 4
        const justDate = splitDate.join(" ")
        let baseHTML = `
            <section class="tasks" id="task--${taskObject.id}">
            <div class="taskName" id="taskName--${taskObject.id}">${taskObject.name}</div>
            <p class="taskDate" id="completion_date">${justDate}</p>
            <label>Completed</label>
            <input type="checkbox" id="tasks--complete--${taskObject.id}"><br>
        `

        baseHTML += "</section><hr/>"

        return baseHTML
    },
    taskForm: function (objectId) {
        return `
            <input type="hidden" id="userId" value="${objectId}"><br>
            <label for="name">Name of task: </label><br>
            <input type="text" placeholder="Task name" id="taskNameInput"><br>
            <label for="completion_date">Date to be completed by: </label><br>
            <input type="date" id="taskDate"><br>
            <button onsubmit="return false" id="tasks--create">Submit</button>
            <button id="tasks--cancel">Cancel</button>
        `
    },
    captureFormValues: function () {
        let date = document.querySelector("#taskDate").value;
        let timestamp = new Date(date);
        timestamp.setDate(timestamp.getDate() + 1)
        let true_timestamp = timestamp.getTime();

        const taskObject = {
            name: document.querySelector("#taskNameInput").value,
            completion_date: true_timestamp,
            is_complete: false,
            userId: parseInt(sessionStorage.getItem("userId"))
        }
        return taskObject
    }
}

export default tasksModule
