import APIManager from "./APIManager"
import printToDOM from "./printToDOM";
import chatsModule from "./chats";
import articleModule from "./article"
import eventsModule from "./eventsModule"
import tasksModule from "./task"
import taskEdit from "./taskedit";
import chatEdit from "./chatedit";
import articleEdit from "./articleedit";
import eventEdit from "./eventedit";

//

const dashboardRefreshional = () => {
    const userId = parseInt(sessionStorage.getItem('userId'))
    const dashboardContainer = document.getElementById("dashboardContainer")
    const chatContainer = document.getElementById("chatDisplay")
    const articleContainer = document.getElementById("articleDisplay")
    const eventContainer = document.getElementById("eventDisplay")
    const taskContainer = document.getElementById("taskDisplay")
    const friendContainer = document.getElementById("friendDisplay")
    const usernameWelcome = document.getElementById("usernameWelcome")
    const logoutButton = document.getElementById("logoutButton")
    const nutshellLogo = document.getElementById("nutshellLogo")
    const headerRight = document.getElementById("headerRight")
    chatContainer.innerHTML = ""
    articleContainer.innerHTML = ""
    eventContainer.innerHTML = ""
    taskContainer.innerHTML = ""
    friendContainer.innerHTML = ""
    APIManager.getUsers().then(function(users) {
        const currentUser = users.find(user => user.id === userId)
        usernameWelcome.innerHTML = `Welcome, ${currentUser.username}`
    })
    APIManager.fetchAllEmbedded("chats").then(function(users) {
        const newChatArray = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            user.chats.forEach(function(chat) {
                newChatArray.push(chat)
            })
        }
        APIManager.getUsers().then(function(users) {
            newChatArray.sort((a, b) => a.timestamp - b.timestamp).forEach(function(chat) {
                const username = users.find(user => user.id === chat.userId).username
                const messageHTML = chatsModule.buildChatsHTML(chat, username, userId)
                printToDOM(messageHTML, "#" + chatContainer.id)
            })
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
    })
    APIManager.fetchWithExpandedUserInfo("articles", userId).then(function(articles) {
        const sortedArticles = articles.sort((a, b) => a.timestamp - b.timestamp)
        for (let i = 0; i < sortedArticles.length; i++) {
            const currentArticle = sortedArticles[i]
            const articleHTML = articleModule.createArticleHTML(currentArticle, userId)
            printToDOM(articleHTML, "#" + articleContainer.id)
        }
    })
    APIManager.fetchWithExpandedUserInfo("events", userId).then(function(events) {
        const sortedEvents = events.sort((a, b) => a.date - b.date)
        for (let i = 0; i < sortedEvents.length; i++) {
            const currentEvent = sortedEvents[i]
            const eventHTML = eventsModule.createEventHTML(currentEvent, userId, i)
            printToDOM(eventHTML, "#" + eventContainer.id)
        }
    })
    APIManager.fetchWithExpandedUserInfo("tasks", userId).then(function(tasks) {
        const sortedTasks = tasks.sort((a, b) => a.completion_date - b.completion_date)
        for (let i = 0; i < sortedTasks.length; i++) {
            const currentTask = sortedTasks[i]
            const taskHTML = tasksModule.taskToHTML(currentTask, userId)
            printToDOM(taskHTML, "#" + taskContainer.id)
        }
    })
    if (dashboardContainer.classList.contains("hidden")) {
        dashboardContainer.classList.toggle("hidden")
    }
    if (nutshellLogo.classList.contains("centeredLogo")) {
        nutshellLogo.classList.toggle("centeredLogo")
    }
    if (headerRight.classList.contains("hidden")) {
        headerRight.classList.toggle("hidden")
    }

    taskEdit()
    chatEdit()
    articleEdit()
    eventEdit()
}

export default dashboardRefreshional