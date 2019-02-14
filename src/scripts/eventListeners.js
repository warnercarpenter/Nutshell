/*
Author: Panya
Task: listen to the body of the page for clicks, and call other methods based on the target of the click
*/

const clickBubbler = {
    listener: () => {
        document.querySelector("#dashboardContainer").addEventListener("click", event => {
            if (event.target === "button") {
                const targetList = event.target.id.split("--");
                if (targetList[1] === "create") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events') 
                    // then call the api create method and pass it the new object and the module name
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    // call printToDom() and pass it the new HTML string
                } else if (targetList[1] === "edit") {
                    // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events') 
                    // then call the api edit method and pass it the new object, the module name, and the original object id
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    // call printToDom() and pass it the new HTML string
                } else if (targetList[1] === "delete") {
                    // call the api delete method and pass it the module name and the original object id
                    // .then() and call the api list method, passing it the correct module and userid
                    // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
                    // call printToDom() and pass it the new HTML string
                }
            }
        })
    }
}

export default clickBubbler;