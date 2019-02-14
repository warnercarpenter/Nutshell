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
                        case 'chat':
                            newObject = chatsModule.buildChatsObject();
                            break;
                        case 'task':
                            newObject = tasksModule.captureFormValues();
                            break;
                        case 'article':
                            newObject = articleModule.createArticleObject();
                            break;
                    }
                    // then call the api create method and pass it the new object and the module name
                    APIManager.Post(targetList[0], newObject)
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    .then(
                        objectArray => {
                            let newHTMLstring = "";
                            objectArray.forEach(element => {
                                switch (targetList[0]) {
                                    case 'events':
                                        newHTMLstring += eventsModule.createEventHTML(element);
                                        break;
                                    case 'chat':
                                        newHTMLstring += chatsModule.buildChatsHTML(element);
                                        break;
                                    case 'task':
                                        newHTMLstring += tasksModule.taskToHTML(element);
                                        break;
                                    case 'article':
                                        newHTMLstring += articleModule.createArticleHTML(element);
                                        break;
                                }
                            });
                            // call printToDom() and pass it the new HTML string
                            printToDOM(newHTMLstring, where);
                        }
                    )
                } else if (targetList[1] === "edit") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    switch (targetList[0]) {
                        case 'events':
                            newObject = eventsModule.createEventObject();
                            targetId = document.querySelector("#eventId");
                            break;
                        case 'chat':
                            newObject = chatsModule.buildChatsObject();
                            targetId = document.querySelector("#chatId");
                            break;
                        case 'task':
                            newObject = tasksModule.captureFormValues();
                            targetId = document.querySelector("#objectId");
                            break;
                        case 'article':
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
                            let newHTMLstring = "";
                            objectArray.forEach(element => {
                                switch (targetList[0]) {
                                    case 'events':
                                        newHTMLstring += eventsModule.createEventHTML(element);
                                        break;
                                    case 'chat':
                                        newHTMLstring += chatsModule.buildChatsHTML(element);
                                        break;
                                    case 'task':
                                        newHTMLstring += tasksModule.taskToHTML(element);
                                        break;
                                    case 'article':
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
                        case 'chat':
                            targetId = document.querySelector("#chatId");
                            break;
                        case 'task':
                            targetId = document.querySelector("#objectId");
                            break;
                        case 'article':
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
                                    let newHTMLstring = "";
                                    objectArray.forEach(element => {
                                        switch (targetList[0]) {
                                            case 'events':
                                                newHTMLstring += eventsModule.createEventHTML(element);
                                                break;
                                            case 'chat':
                                                newHTMLstring += chatsModule.buildChatsHTML(element);
                                                break;
                                            case 'task':
                                                newHTMLstring += tasksModule.taskToHTML(element);
                                                break;
                                            case 'article':
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
    }
}

export default clickBubbler;