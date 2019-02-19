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
        <fieldset>
            <input type="hidden" id="userId" value="${objectId}"><br>
            <label for="name">Name of task: </label><br>
            <input type="text" placeholder="Task name" id="taskName">
        </fieldset>
        <fieldset>
            <label for="completion_date">Date to be completed by: </label><br>
            <input type="date" id="taskDate">
        <fieldset>
            <button onsubmit="return false" id="tasks--create">Submit</button>
            <button id="tasks--cancel">Cancel</button>
        </fieldset>
        `
    },
    captureFormValues: function () {
        let date = document.querySelector("#taskDate").value;
        let timestamp = new Date(date);
        timestamp.setDate(timestamp.getDate() + 1)
        let true_timestamp = timestamp.getTime();

        const taskObject = {
            name: document.querySelector("#taskName").value,
            completion_date: true_timestamp,
            is_complete: false,
            userId: parseInt(sessionStorage.getItem("userId"))
        }
        return taskObject
    }
}

const editTask = () => {
    let input = document.createElement("input")
    input.type = "text"
    input.name = "editTask"
    return input
}

document.querySelector("#taskName").addEventListener("onclick", editTask())

export default tasksModule
