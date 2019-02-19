/*
Author: Panya
Task: listen to the body of the page for clicks, and call other methods based on the target of the click
*/

import APIManager from "./APIManager";
import eventsModule from "./eventsModule";
import chatsModule from "./chats";
import tasksModule from "./task";
import articleModule from "./article";
import registrationLoginHandler from "./registration";
import dashboardRefreshional from "./dashboardRefreshional";
import landing from "./logout";

const clickBubbler = {
    listener: () => {
        document.querySelector("#listenerBlock").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON" || event.target.nodeName === "INPUT") {
                const targetList = event.target.id.split("--");
                let newObject = {};
                let targetId = "";
                if (targetList[1] === "cancel") {
                    dashboardRefreshional()
                }
                if (targetList[1] === "add") {
                    let newHTMLstring = "";
                    switch (targetList[0]) {
                        case 'event':
                            newHTMLstring = eventsModule.buildEntryForm();
                            document.querySelector("#eventDisplay").innerHTML = newHTMLstring;
                            break;
                        case 'chat':
                            newHTMLstring = chatsModule.buildChatsForm();
                            document.querySelector("#chatDisplay").innerHTML = newHTMLstring;
                            break;
                        case 'task':
                            newHTMLstring = tasksModule.taskForm();
                            document.querySelector("#taskDisplay").innerHTML = newHTMLstring;
                            break;
                        case 'article':
                            newHTMLstring = articleModule.buildArticleForm();
                            document.querySelector("#articleDisplay").innerHTML = newHTMLstring;
                            break;
                    }
                } else if (targetList[1] === "create") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    switch (targetList[0]) {
                        case 'events':
                            newObject = eventsModule.createEventObject();
                            break;
                        case 'chats':
                            newObject = chatsModule.buildChatsObject();
                            break;
                        case 'tasks':
                            newObject = tasksModule.captureFormValues();
                            break;
                        case 'articles':
                            newObject = articleModule.createArticleObject();
                            break;
                        case 'friends':
                            newObject = friendsModule.createFriendsObject();
                            break;
                    }
                    // then call the api create method and pass it the new object and the module name
                    APIManager.Post(targetList[0], newObject)
                        // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                        .then(
                            objectArray => {
                                document.querySelector("#formSection").innerHTML = "";
                                dashboardRefreshional();
                            })
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    switch (targetList[0]) {
                        case 'events':
                            targetId = targetList[2];
                            break;
                        case 'tasks':
                            targetId = targetList[2];
                            break;
                        case 'articles':
                            targetId = targetList[2];
                            break;
                    }
                    APIManager.delete(targetList[0], targetId)
                        // .then() and call the api list method, passing it the correct module and userid
                        .then(
                            () => {
                                dashboardRefreshional();
                            })
                } else if (targetList[1] === "editing") {
                    switch (targetList[0]) {
                        case 'events':
                            targetId = parseInt(document.querySelector("#eventId").value);
                            newObject = eventsModule.createEventObject();
                            break;
                        case 'chats':
                            targetId = document.querySelector("#chatId");
                            break;
                        case 'tasks':
                            targetId = document.querySelector("#objectId");
                            break;
                        case 'articles':
                            targetId = parseInt(document.querySelector("#articleId").value);
                            newObject = articleModule.createArticleObject();
                            break;
                    }
                    // then call the api edit method and pass it the new object, the module name, and the original object id
                    //desiredDatabase, objectId, editedObject
                    APIManager.Put(targetList[0], targetId, newObject)
                        // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                        .then(
                            objectArray => {
                                dashboardRefreshional();
                                document.querySelector("#formSection").innerHTML = "";
                            }
                        )
                }
            }
        })
    },
    firstLoad: () => {
        document.querySelector("#listenToMe").addEventListener("click", event => {
            if (event.target.nodeName === "A") {
                const targetList = event.target.id.split("--");
                if (targetList[0] === "register") {
                    const HTMLcode = registrationLoginHandler.buildRegistrationForm();
                    document.querySelector("#formSection").innerHTML = HTMLcode;
                    clickBubbler.register();
                } else {
                    const HTMLcode = registrationLoginHandler.buildLoginForm();
                    document.querySelector("#formSection").innerHTML = HTMLcode;
                    clickBubbler.login();
                }
            }
        })
    },
    login: () => {
        document.querySelector("#login").addEventListener("click",
            event => {
                const newObject = registrationLoginHandler.createLoginObject();
                APIManager.getUsers()
                    .then(
                        userList => {
                            let login_match = false;
                            userList.forEach(element => {
                                if (newObject.username === element.username && newObject.password === element.password) {
                                    login_match = true;
                                    sessionStorage.setItem("userId", element.id);
                                    document.querySelector("#formSection").innerHTML = "";
                                    dashboardRefreshional();
                                    clickBubbler.listener();
                                    clickBubbler.logout();
                                }
                            })
                            if (login_match === false) {
                                document.querySelector("#dashboardContainer").innerHTML += "The username or password does not match; please try again";
                            }
                        });
            })
    },
    register: () => {
        document.querySelector("#registration--create").addEventListener("click",
            () => {
                let username = document.querySelector("#username").value
                let email = document.querySelector("#email").value

                const createUser = () => {
                    const newObject = registrationLoginHandler.createRegistrationObject();
                    APIManager.Post("users", newObject)
                        .then(
                            objectArray => {
                                let userId = objectArray.id;
                                sessionStorage.setItem("userId", userId);
                                document.querySelector("#formSection").innerHTML = "";
                                dashboardRefreshional();
                                clickBubbler.listener();
                                clickBubbler.logout();
                            }
                        )
                }

                const registrationDuplicateCheck = () => {
                    APIManager.getUsers().then((userArray) => {
                        let checker = false
                        for (let i = 0; i < userArray.length; i++) {
                            const element = userArray[i];
                            if (element.username === username || element.email === email) {
                                checker = true
                            }
                        }
                        if (checker) {
                            alert("This user has already been registered! Try a different username or email.")
                        } else {
                            createUser()
                        }
                    })
                }

                registrationDuplicateCheck()
            })
    },
    logout: () => {
        document.querySelector("#logoutButton").addEventListener("click",
            () => {
                if (nutshellLogo.classList.contains("centeredLogo") === false) {
                    nutshellLogo.classList.toggle("centeredLogo")
                }
                if (headerRight.classList.contains("hidden") === false) {
                    headerRight.classList.toggle("hidden")
                }
                sessionStorage.removeItem("userId");
                landing();
            })
    }
}

export default clickBubbler;