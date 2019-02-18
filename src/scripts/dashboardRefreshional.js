import APIManager from "./APIManager"
import printToDOM from "./printToDOM";
import chatsModule from "./chats";
import articleModule from "./article"
import eventsModule from "./eventsModule"
import tasksModule from "./task"

const dashboardRefreshional = () => {
    const userId = parseInt(sessionStorage.getItem('userId'))
    const dashboardContainer = document.getElementById("dashboardContainer")
    const chatContainer = document.getElementById("chatDisplay")
    const articleContainer = document.getElementById("articleDisplay")
    const eventContainer = document.getElementById("eventDisplay")
    const taskContainer = document.getElementById("taskDisplay")
    const friendContainer = document.getElementById("friendDisplay")
    const usernameWelcome = document.getElementById("usernameWelcome")
    chatContainer.innerHTML = ""
    articleContainer.innerHTML = ""
    eventContainer.innerHTML = ""
    taskContainer.innerHTML = ""
    friendContainer.innerHTML = ""
    usernameWelcome.innerHTML = `Welcome, `
    APIManager.fetchAllEmbedded("chats").then(function(users) {
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const username = user.username
            user.chats.forEach(function(chat) {
                const messageHTML = chatsModule.buildChatsHTML(chat, username, userId)
                printToDOM(messageHTML, "#" + chatContainer.id)
            })
        }
    })
    APIManager.fetchWithExpandedUserInfo("articles", userId).then(function(articles) {
        for (let i = 0; i < articles.length; i++) {
            const currentArticle = articles[i]
            const articleHTML = articleModule.createArticleHTML(currentArticle, userId)
            printToDOM(articleHTML, "#" + articleContainer.id)
        }
    })
    APIManager.fetchWithExpandedUserInfo("events", userId).then(function(events) {
        for (let i = 0; i < events.length; i++) {
            const currentEvent = events[i]
            const eventHTML = eventsModule.createEventHTML(currentEvent, userId)
            printToDOM(eventHTML, "#" + eventContainer.id)
        }
    })
    APIManager.fetchWithExpandedUserInfo("tasks", userId).then(function(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            const currentTask = tasks[i]
            const taskHTML = tasksModule.taskToHTML(currentTask, userId)
            printToDOM(taskHTML, "#" + taskContainer.id)
        }
    })
    if (dashboardContainer.classList.contains("hidden")) {
        dashboardContainer.classList.toggle("hidden")
    }
}

export default dashboardRefreshional