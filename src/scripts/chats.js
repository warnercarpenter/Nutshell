import timeConverter from "./timestampparser";

const chatsModule = {
    buildChatsForm: (chatId) => {
        return `
            <div id="chatsForm">
                <input type="hidden" name="chatId" value="${chatId}"></input>
                Enter your message:</br>
                <textarea rows="4" cols="50" name="chatMessage" id="chat--textInput"></textarea></br>
                <button id="chats--create">Submit</button>
            </div>
        `
    },
    buildChatsObject: () => {
        const chatsObject = {}
        chatsObject.text = document.getElementById("chat--textInput").value
        chatsObject.timestamp = Date.now()
        // chatsObject.userId = Window.sessionStorage.getItem('userId')
        chatsObject.userId = 1;
        return chatsObject
    },
    buildChatsHTML: (chatObject, username, userId) => {
        const chatTimestamp = timeConverter(chatObject.timestamp)

        let baseHTML = `
            <div class="chats" id="chat--${chatObject.id}">
                <div class="chatTextContent">${chatObject.text}</div>
                <p class="chatSubText">Posted by ${username} on ${chatTimestamp}</p>
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