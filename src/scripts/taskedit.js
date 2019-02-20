import APIManager from "./APIManager";
import dashboardRefreshional from "./dashboardRefreshional";

const taskEdit = () => {
    const taskDisplay = document.getElementById("taskDisplay")
    taskDisplay.addEventListener("click", function (event) {
        if (taskDisplay.innerHTML.includes("taskName")) {
            if (event.target.id.split("--")[0] === "taskName") {
                const taskId = parseInt(event.target.id.split("--")[1])
                let taskObject = ""
                APIManager.fetchWithoutUserInfo("tasks").then(function (tasks) {
                    taskObject = tasks.find(task => task.id === taskId)
                    taskDisplay.innerHTML = `<div>Edit task title</div><input type="text" id="taskTextEdit" value="${taskObject.name}"></input>
                    <button id="taskTextEditSave">Save</button>
                    <button id="tasks--cancel">Cancel</button>`

                    document.getElementById("taskTextEdit").addEventListener("keyup", function (event) {
                        if (event.keyCode === 13) {
                            document.getElementById("taskTextEditSave").click();
                        }
                    });

                    document.getElementById("taskTextEditSave").addEventListener("click", function (event) {
                        taskObject.name = document.getElementById("taskTextEdit").value
                        APIManager.Put("tasks", taskId, taskObject).then(dashboardRefreshional)
                    })
                })
            }
        }
    })
}

export default taskEdit