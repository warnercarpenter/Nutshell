const friendsModule = {
    buildFriendsForm: () => {
        return `
            <div id="friendsForm">
                First name:</br>
                <input id="friendFirstName" type="text"></input></br>
                Last name:</br>
                <input id="friendLastName" type="text"></input></br>
                <button id="friends--create">Add friend</button>
                <button id="friends--cancel">Cancel</button>
            </div>
        `
    },
    buildFriendsObject: () => {
        const friendsObject = {}
        friendsObject.text = document.getElementById("chat--textInput").value
        friendsObject.timestamp = parseInt(Date.now())
        friendsObject.userId = parseInt(sessionStorage.getItem('userId'))
        return friendsObject
    },
    buildFriendsHTML: (chatObject, username, userId) => {
    //     const chatTimestamp = timeConverter(chatObject.timestamp)

    //     let baseHTML = `
    //         <div class="chats" id="chat--${chatObject.id}">
    //             <div class="chatTextContent">${chatObject.text}</div>
    //             <p class="chatSubText">by ${username}<br/>Posted on ${chatTimestamp}</p>
    //     `

    //     if (chatObject.userId === userId) {
    //         baseHTML += `
    //             <button id="chats--edit--${chatObject.id}">Edit</button>
    //         `
    //     }

    //     baseHTML += "</div><hr/>"

    //     return baseHTML
    }
}

export default friendsModule