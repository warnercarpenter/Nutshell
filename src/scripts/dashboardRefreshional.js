import APIManager from "./APIManager"
import printToDOM from "./printToDOM";
import chatsModule from "./chats";
import articleModule from "./article"

const dashboardRefreshional = () => {
    // NEED TO BE CHANGED TO const userId = Window.sessionStorage.getItem('userId');
    const userId = 1
    //
    const chatContainer = document.getElementById("chatDisplay")
    const articleContainer = document.getElementById("articleDisplay")
    const eventContainer = document.getElementById("eventDisplay")
    const taskContainer = document.getElementById("taskDisplay")
    const friendContainer = document.getElementById("friendDisplay")
    chatContainer.innerHTML = ""
    articleContainer.innerHTML = ""
    eventContainer.innerHTML = ""
    taskContainer.innerHTML = ""
    friendContainer.innerHTML = ""
    APIManager.fetchWithExpandedUserInfo("chats", userId).then(function(chats) {
        for (let i = 0; i < chats.length; i++) {
            const currentMessage = chats[i]
            const messageHTML = chatsModule.buildChatsHTML(currentMessage, userId)
            printToDOM(messageHTML, "#" + chatContainer.id)
        }
    })
    APIManager.fetchWithExpandedUserInfo("articles", userId).then(function(articles) {
        for (let i = 0; i < articles.length; i++) {
            const currentArticle = articles[i]
            const articleHTML = articleModule.createArticleHTML(currentArticle, userId)
            printToDOM(articleHTML, "#" + articleContainer.id)
        }
    })
}

export default dashboardRefreshional