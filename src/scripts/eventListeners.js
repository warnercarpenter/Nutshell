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

const clickBubbler = {
    listener: () => {
        document.querySelector("#listenerBlock").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON") {
                const targetList = event.target.id.split("--");
                let newObject = {};
                let targetId = "";
                if (targetList[1] === "add") {
                    let newHTMLstring = "";
                    switch (targetList[0]) {
                        case 'event':
                            newHTMLstring = eventsModule.buildEntryForm();
                            break;
                        case 'chat':
                            newHTMLstring = chatsModule.buildChatsForm();
                            break;
                        case 'task':
                            newHTMLstring = tasksModule.taskForm();
                            break;
                        case 'article':
                            newHTMLstring = articleModule.buildArticleForm();
                            break;
                    }
                    document.querySelector("#formSection").innerHTML = newHTMLstring;
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
                    }
                    // then call the api create method and pass it the new object and the module name
                    APIManager.Post(targetList[0], newObject)
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    .then(
                        objectArray => {
                            dashboardRefreshional();
                        })
                } else if (targetList[1] === "edit") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    switch (targetList[0]) {
                        case 'events':
                            targetId = targetList[2];
                            eventsModule.editEventObject(targetId);
                            break;
                        case 'chats':
                            targetId = document.querySelector("#chatId");
                            newObject = chatsModule.buildChatsObject(targetId);
                            break;
                        case 'tasks':
                            targetId = document.querySelector("#objectId");
                            newObject = tasksModule.captureFormValues(targetId);
                            break;
                        case 'articles':
                            targetId = targetList[2];
                            articleModule.articleEdit(targetId);
                            break;
                    }
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    switch (targetList[0]) {
                        case 'events':
                            targetId = document.querySelector("#eventId");
                            break;
                        case 'tasks':
                            targetId = document.querySelector("#objectId");
                            break;
                        case 'articles':
                            targetId = document.querySelector("#articleId");
                            break;
                    }
                    APIManager.delete(targetList[0], eventId)
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
                    userList.forEach(element => {
                        if (newObject.username === element.username && newObject.password === element.password ) {
                            sessionStorage.setItem("userId", element.id);
                            dashboardRefreshional();
                        } else {
                            document.querySelector("#dashboardContainer").innerHTML += "The username or password does not match; please try again";
                        }
                })
            });
        })
    },
    register: () => {
        document.querySelector("#registration--create").addEventListener("click",
        () => {
            const newObject = registrationLoginHandler.createRegistrationObject();
            APIManager.Post("users", newObject)
            .then(
                objectArray => {
                    let userId = objectArray.id;
                    sessionStorage.setItem("userId", userId);
                    dashboardRefreshional();
                }
            )
        });
    }
}

export default clickBubbler;