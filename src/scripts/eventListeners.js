import APIManager from "./APIManager";
import eventsModule from "./eventsModule";
import chatsModule from "./chats";
import tasksModule from "./task";
import articleModule from "./article";
import registrationLoginHandler from "./registration";
import dashboardRefreshional from "./dashboardRefreshional";
import landing from "./logout";
import friendsModule from "./friends"
import checkObjectError from "./checkObjectError";

const clickBubbler = {
    listener: () => {
        document.querySelector("#listenerBlock").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON" || event.target.nodeName === "INPUT") {
                const targetList = event.target.id.split("--");
                let newObject = {};
                let targetId = "";
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
                    let hasError = false
                    switch (targetList[0]) {
                        case 'events':
                            newObject = eventsModule.createEventObject();
                            hasError = checkObjectError(newObject)
                            break;
                        case 'chats':
                            newObject = chatsModule.buildChatsObject();
                            hasError = checkObjectError(newObject)
                            break;
                        case 'tasks':
                            newObject = tasksModule.captureFormValues();
                            hasError = checkObjectError(newObject)
                            break;
                        case 'articles':
                            newObject = articleModule.createArticleObject();
                            hasError = checkObjectError(newObject)
                            break;
                        case 'friends':
                            newObject = friendsModule.buildFriendsObject();
                            break;
                    }

                    if (hasError === true) {
                        alert("All fields must be filled!")
                    } else {
                        if (targetList[0] !== "friends") {
                            APIManager.Post(targetList[0], newObject)
                                // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                                .then(
                                    objectArray => {
                                        document.querySelector("#formSection").innerHTML = "";
                                        dashboardRefreshional();
                                    })
                        }
                        else { dashboardRefreshional() }
                    }
                    // then call the api create method and pass it the new object and the module name
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    switch (targetList[0]) {
                        case 'events':
                            targetId = targetList[2];
                            break;
                        case 'articles':
                            targetId = targetList[2];
                            break;
                        case 'friends':
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
                        .then(() => {
                                dashboardRefreshional();
                                document.querySelector("#formSection").innerHTML = "";
                            }
                        )
                } else if (targetList[1] === "complete") {
                    const taskId = parseInt(targetList[2])
                    let objectToComplete = {}
                    APIManager.fetchWithoutUserInfo("tasks").then(function (tasks) {
                        tasks.forEach(task => {
                            if (task.id === taskId) {
                                objectToComplete = task
                            }
                        })
                    })
                        .then(function () {
                            objectToComplete.is_complete = true
                            APIManager.Put("tasks", taskId, objectToComplete).then(dashboardRefreshional)
                        })
                }
            }
        })
    },
    firstLoad: () => {
        document.querySelector("#listenToMe").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON") {
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
                                alert("The username or password does not match; please try again")
                            }
                        });
            })
    },
    register: () => {
        document.querySelector("#registration--create").addEventListener("click",
            () => {
                let username = document.querySelector("#username").value
                let email = document.querySelector("#email").value
                let password = document.querySelector("#password").value
                let firstName = document.querySelector("#firstName").value
                let lastName = document.querySelector("#lastName").value

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

                if (username === "" || email === "" || password === "" || firstName === "" || lastName === "") {
                    alert("All fields must be filled!")
                } else {
                    registrationDuplicateCheck()
                }
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
                if (footer.classList.contains("hidden") === false) {
                    footer.classList.toggle("hidden")
                }
                sessionStorage.removeItem("userId");
                landing();
            })
    }
}

export default clickBubbler;