import APIManager from "./APIManager";

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
        const friendFirstName = document.querySelector("#friendFirstName").value
        const friendLastName = document.querySelector("#friendLastName").value
        let duplicateCheck = false
        let initiateUserId = sessionStorage.userId
        let friendedUserId = ""
        APIManager.getUsers()
            .then((usersArray) => {
                usersArray.forEach(user => {
                    if (user.first_name === friendFirstName && user.last_name === friendLastName)
                    {
                        friendedUserId = user.userId
                     }

                });
            })
            .then (()=> APIManager.fetchWithoutUserInfo("friends"))
            .then((friendsArray) => {
                friendsArray.forEach(friend => {
                    if (friend.userId === initiateUserId && friend.friendedUser === friendedUserId) {
                        duplicateCheck = true
                    }
                })
                if (duplicateCheck) {
                    alert("It looks like you are already friends!")
                }
                else {
                    let newFriendObject = {
                        userId: initiateUserId,
                        friendedUser: friendedUserId
                    }
                    return newFriendObject
                }
            });
    }
}

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


export default friendsModule