import timeConverter from "./timestampparser";

const tasksModule = {
    taskToHTML: function (taskObject) {
        const taskTimestamp = timeConverter(taskObject.completion_date)
        let baseHTML = `
            <section class="tasks" id="task--${taskObject.id}">
            <div class="taskName">${taskObject.name}</div>
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
            <label for="completion_date">Date to be completed by: </label><br>
            <input type="date" id="taskDate">
        <fieldset>
            <button id="tasks--create">Submit</button>
        </fieldset>
        `
    },
    captureFormValues: function () {
        const taskObject = {
            name: document.querySelector("#taskName").value,
            completion_date: document.querySelector("#taskDate").value,
            is_complete: document.querySelector("#taskComplete").value,
            userId: parseInt(sessionStorage.getItem("userId"))
        }
        return taskObject
    },
    taskEdit: function () {
        let database = event.target.id.split("--")[0]
        let taskId = event.target.id.split("--")[2]
        APIManager.getAnyById(database, taskId)
            .then((response) => {
                taskToHTML(tasksModule.taskForm, "#formSection")
                let button = document.getElementById("tasks--create")
                button.innerText = "Save Edits"
                button.id = `tasks--editing--${response.id}`
                document.querySelector("#articleTitle").value = response.title
                document.querySelector("#articleSummary").value = response.summary
                document.querySelector("#articleURL").value = response.url
            })
    }
}

export default tasksModule

const editTask = () => {
    let input = document.createElement("input")
    input.type = "text"
    input.name = "editTask"
    return input
}

document.querySelector("#taskName").addEventListener("onclick", editTask())
