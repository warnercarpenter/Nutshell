/*
Author: Panya
Task: listen to the body of the page for clicks, and call other methods based on the target of the click
*/

import APIManager from "./APIManager";
import printToDOM from "./printToDOM";
import eventsModule from "./eventsModule";

const clickBubbler = {
    listener: () => {
        document.querySelector("#dashboardContainer").addEventListener("click", event => {
            if (event.target.nodeName === "BUTTON") {
                const targetList = event.target.id.split("--");
                const where = targetList[0] + "Display";
                let newObject = {};
                if (targetList[1] === "add") {
                    let newHTMLstring = "";
                    newHTMLstring = eventsModule.buildEntryForm();
                    printToDOM(newHTMLstring, "#dashboardContainer");
                } else if (targetList[1] === "create") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    if (targetList[0] === "events") {
                        newObject = eventsModule.createEventObject();
                    }
                    // then call the api create method and pass it the new object and the module name
                    APIManager.Post(targetList[0], newObject)
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    .then(
                        objectArray => {
                            let newHTMLstring = "";
                            objectArray.forEach(element => {
                                if (targetList[0] === "events") {
                                    newHTMLstring += eventsModule.createEventHTML(element);
                                }
                            });
                            // call printToDom() and pass it the new HTML string
                            printToDOM(newHTMLstring, where);
                        }
                    )
                } else if (targetList[1] === "edit") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
                    if (targetList[0] === "events") {
                        newObject = eventsModule.createEventObject();
                    }
                    // then call the api edit method and pass it the new object, the module name, and the original object id
                    //desiredDatabase, objectId, editedObject
                    let eventId = document.querySelector("#eventId");
                    APIManager.Put(targetList[0], eventId, newObject)
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    .then(
                        objectArray => {
                            let newHTMLstring = "";
                            objectArray.forEach(element => {
                                if (targetList[0] === "events") {
                                    newHTMLstring += eventsModule.createEventHTML(element);
                                }
                            });
                            // call printToDom() and pass it the new HTML string
                            printToDOM(newHTMLstring, where);
                        }
                    )
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    let eventId = document.querySelector("#eventId");
                    APIManager.delete(targetList[0], eventId)
                    // .then() and call the api list method, passing it the correct module and userid
                    .then(
                        () => {
                            APIManager.getByUserId(targetList[0], Window.sessionStorage.getItem('userId'))
                            // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                            .then(
                                objectArray => {
                                    let newHTMLstring = "";
                                    objectArray.forEach(element => {
                                        if (targetList[0] === "events") {
                                            newHTMLstring += eventsModule.createEventHTML(element);
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