/*
Author: Panya
Task: listen to the body of the page for clicks, and call other methods based on the target of the click
*/

import APIManager from "./APIManager";
import printToDOM from "./printToDOM";
import eventsModule from "./eventsModule";
import chatsModule from "./chats";
import tasksModule from "./task";
import articleModule from "./article";
import registrationLoginHandler from "./registration";

const clickBubbler = {
    listener: () => {
        document.querySelector("#dashboardContainer").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON") {
                const targetList = event.target.id.split("--");
                const where = `#${targetList[0]}Display`;
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
                    document.querySelector("#dashboardContainer").innerHTML = newHTMLstring;
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
                            location.reload(true);
                            let newHTMLstring = "";
                            switch (targetList[0]) {
                                case 'events':
                                    newHTMLstring += eventsModule.createEventHTML(objectArray);
                                    break;
                                case 'chats':
                                    newHTMLstring += chatsModule.buildChatsHTML(objectArray);
                                    break;
                                case 'tasks':
                                    newHTMLstring += tasksModule.taskToHTML(objectArray);
                                    break;
                                case 'articles':
                                    newHTMLstring += articleModule.createArticleHTML(objectArray);
                                    break;
                            }
                            // call printToDom() and pass it the new HTML string
                            printToDOM(newHTMLstring, where);
                        })
                } else if (targetList[1] === "edit") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    switch (targetList[0]) {
                        case 'events':
                            newObject = eventsModule.createEventObject();
                            targetId = document.querySelector("#eventId");
                            break;
                        case 'chats':
                            newObject = chatsModule.buildChatsObject();
                            targetId = document.querySelector("#chatId");
                            break;
                        case 'tasks':
                            newObject = tasksModule.captureFormValues();
                            targetId = document.querySelector("#objectId");
                            break;
                        case 'articles':
                            newObject = articleModule.createArticleObject();
                            targetId = document.querySelector("#articleId");
                            break;
                    }
                    // then call the api edit method and pass it the new object, the module name, and the original object id
                    //desiredDatabase, objectId, editedObject
                    APIManager.Put(targetList[0], targetId, newObject)
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    .then(
                        objectArray => {
                            location.reload(true);
                            let newHTMLstring = "";
                            objectArray.forEach(element => {
                                switch (targetList[0]) {
                                    case 'events':
                                        newHTMLstring += eventsModule.createEventHTML(element);
                                        break;
                                    case 'chats':
                                        newHTMLstring += chatsModule.buildChatsHTML(element);
                                        break;
                                    case 'tasks':
                                        newHTMLstring += tasksModule.taskToHTML(element);
                                        break;
                                    case 'articles':
                                        newHTMLstring += articleModule.createArticleHTML(element);
                                        break;
                                }
                            });
                            // call printToDom() and pass it the new HTML string
                            printToDOM(newHTMLstring, where);
                        }
                    )
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    switch (targetList[0]) {
                        case 'events':
                            targetId = document.querySelector("#eventId");
                            break;
                        case 'chats':
                            targetId = document.querySelector("#chatId");
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
                            APIManager.getByUserId(targetList[0], 1)
                            // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                            .then(
                                objectArray => {
                                    location.reload(true);
                                    let newHTMLstring = "";
                                    objectArray.forEach(element => {
                                        switch (targetList[0]) {
                                            case 'events':
                                                newHTMLstring += eventsModule.createEventHTML(element);
                                                break;
                                            case 'chats':
                                                newHTMLstring += chatsModule.buildChatsHTML(element);
                                                break;
                                            case 'tasks':
                                                newHTMLstring += tasksModule.taskToHTML(element);
                                                break;
                                            case 'articles':
                                                newHTMLstring += articleModule.createArticleHTML(element);
                                                break;
                                        }
                                     });
                                    // call printToDom() and pass it the new HTML string
                                    printToDOM(newHTMLstring, where);
                                }
                            )
                        }
                    )
                }
            }
        })
    },
    firstLoad: () => {
        document.querySelector("#dashboardContainer").addEventListener("click", event => {
            const targetList = event.target.id.split("--");
            if (targetList[0] === "register") {
                const HTMLcode = registrationLoginHandler.buildRegistrationForm();
                document.querySelector("#dashboardContainer").innerHTML = HTMLcode;
                clickBubbler.register();
            } else {
                const HTMLcode = registrationLoginHandler.buildLoginForm();
                document.querySelector("#dashboardContainer").innerHTML = HTMLcode;
                
            }
        })
    },
    login: () => {
        document.querySelector("#login").addEventListener("click",
        event => {
            const newObject = registrationLoginHandler.createLoginObject();
            
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
                }
            )
        });
    }
}

export default clickBubbler;