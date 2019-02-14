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
        chatsObject.userID = Window.sessionStorage.getItem('userId');
        return chatsObject
    },
    buildChatsHTML: (chatObject) => {
        timestamp = String(new Date(chatObject.timestamp))
        cutTimestamp = timestamp.split(" ")
        cutTimestamp.length = 4
        cutTimestamp.splice(0, 1, `${cutTimestamp[0]}.`)
        cutTimestamp.splice(1, 1, `${cutTimestamp[1]},`)
        formattedTimestamp = cutTimestamp.join(" ")

        return `
            <div id="chat--${chatObject.id}"
                <p class="chatTextContent">${chatObject.text}</p>
                <p class="chatSubText">Posted by ${chatObject.user.username} on ${formattedTimestamp}</p>
            </div>
        `
    }
}

export default chatsModule