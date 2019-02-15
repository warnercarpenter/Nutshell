import timeConverter from "./timestampparser";

const chatsModule = {
    buildChatsForm: (chatId) => {
        return `
            <div id="chatsForm">
                <input type="hidden" name="chatId" value="${chatId}"></input>
                Enter your message:</br>
                <textarea rows="4" cols="50" name="chatMessage" id="chat--textInput"></textarea></br>
                <button id="chat--submit">Submit</button>
            </div>
        `
    },
    buildChatsObject: () => {
        const chatsObject = {}
        chatsObject.text = document.getElementById("chat--textInput").value
        chatsObject.timestamp = Date.now()
        chatsObject.userId = Window.sessionStorage.getItem('userId')
        return chatsObject
    },
    buildChatsHTML: (chatObject, userId) => {
        const chatTimestamp = timeConverter(chatObject.timestamp)

        let baseHTML = `
            <div class="chats" id="chat--${chatObject.id}"
                <p class="chatTextContent">${chatObject.text}</p>
                <p class="chatSubText">Posted by ${chatObject.user.username} on ${chatTimestamp}</p>
        `

        if (chatObject.userId === userId) {
            baseHTML += `
                <button id="chats--edit--${chatObject.id}">Edit</button>
                <button id="chats--delete--${chatObject.id}">Delete</button>
            `
        }

        baseHTML += "</div><hr/>"

        return baseHTML
    }
}

export default chatsModule