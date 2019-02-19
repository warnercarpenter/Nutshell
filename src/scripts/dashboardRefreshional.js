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
import friendsListener from "./friendsListener";

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
    const reloadChats = () => {
        chatContainer.innerHTML = ""
        APIManager.getUsers().then(function (users) {
            const currentUser = users.find(user => user.id === userId)
            usernameWelcome.innerHTML = `Welcome, ${currentUser.username}`
        })
        return APIManager.fetchAllEmbedded("chats").then(function (users) {
            const newChatArray = []
            for (let i = 0; i < users.length; i++) {
                const user = users[i]
                user.chats.forEach(function (chat) {
                    newChatArray.push(chat)
                })
            }
            APIManager.getUsers().then(function (users) {
                newChatArray.sort((a, b) => a.timestamp - b.timestamp).forEach(function (chat) {
                    const username = users.find(user => user.id === chat.userId).username
                    const messageHTML = chatsModule.buildChatsHTML(chat, username, userId)
                    printToDOM(messageHTML, "#" + chatContainer.id)
                })
                chatContainer.scrollTop = chatContainer.scrollHeight;
            })
        })
    }

    const reloadArticles = () => {
        articleContainer.innerHTML = ""
        return APIManager.fetchWithExpandedUserInfo("articles", userId).then(function (articles) {
            const sortedArticles = articles.sort((a, b) => a.timestamp - b.timestamp)
            for (let i = 0; i < sortedArticles.length; i++) {
                const currentArticle = sortedArticles[i]
                const articleHTML = articleModule.createArticleHTML(currentArticle, userId, currentArticle.user.username)
                printToDOM(articleHTML, "#" + articleContainer.id)
            }
        })
    }

    const reloadEvents = () => {
        eventContainer.innerHTML = ""
        return APIManager.fetchWithExpandedUserInfo("events", userId).then(function (events) {
            const sortedEvents = events.sort((a, b) => a.date - b.date)
            for (let i = 0; i < sortedEvents.length; i++) {
                const currentEvent = sortedEvents[i]
                const eventHTML = eventsModule.createEventHTML(currentEvent, userId, i, currentEvent.user.username)
                printToDOM(eventHTML, "#" + eventContainer.id)
            }
        })
    }

    const reloadTasks = () => {
        taskContainer.innerHTML = ""
        return APIManager.fetchWithExpandedUserInfo("tasks", userId).then(function (tasks) {
            const completedTasks = tasks.filter(taskToCheck => taskToCheck.is_complete === false)
            const sortedTasks = completedTasks.sort((a, b) => a.completion_date - b.completion_date)
            for (let i = 0; i < sortedTasks.length; i++) {
                const currentTask = sortedTasks[i]
                const taskHTML = tasksModule.taskToHTML(currentTask, userId)
                printToDOM(taskHTML, "#" + taskContainer.id)
            }
        })
    }

    const reloadFriends = () => {
        friendContainer.innerHTML = ""
    }

    reloadChats().then(reloadArticles).then(reloadEvents).then(reloadTasks).then(reloadFriends)
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
    friendsListener()

    dashboardContainer.addEventListener("click", function (event) {
        if (event.target.nodeName === "BUTTON" || event.target.nodeName === "INPUT") {
            const targetList = event.target.id.split("--");
            if (targetList[0] === "chats" && targetList[1] === "cancel") {
                reloadChats()
            }
            if (targetList[0] === "articles" && targetList[1] === "cancel") {
                reloadArticles()
            }
            if (targetList[0] === "events" && targetList[1] === "cancel") {
                reloadEvents()
            }
            if (targetList[0] === "tasks" && targetList[1] === "cancel") {
                reloadTasks()
            }
        }
    })
}

export default dashboardRefreshional



