/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/

const eventsModule = {
    buildEntryForm: () => {
        return `<form id="eventForm">
            <input type="hidden" name="eventId" value=""></input>
            <fieldset>
                <label for="eventName">Name of the event:</label>
                <input type="text" name="eventName" id="eventName"></input>
            </fieldset>
            <fieldset>
                <label for="eventDate">Date of the event:</label>
                <input type="datetime" name="eventDate" id="eventDate"></input>
            </fieldset>
            <fieldset>
                <label for="eventLocation">Location of the event:</label>
                <input type="text" name="eventLocation" id="eventLocation"></input>
            </fieldset>
            <button id="events--create">Create New Event</button>
        </form>`;
    },
    createEventObject: () => {
        let name = document.querySelector("#eventName").value;
        let date = document.querySelector("#eventDate").value;
        let location = document.querySelector("#eventLocation").value;
        const userId = Window.sessionStorage.getItem('userId');
        const eventId = document.querySelector("#eventId").value;

        const eventObject = {
            name: name,
            date: date,
            location: location,
            userId: userId
        }

        if (eventId !== "") {

        } else {

        }
    },
    createEventHTML: () => {},
}

export default eventsModule;