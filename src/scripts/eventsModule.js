/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/

const eventsModule = {
    buildEntryForm: () => {
        return `<form id="eventForm">
            <fieldset>
                <label for="eventName">Name of the event:</label>
                <input type="text" name="eventName" id="eventName"></input>
            </fieldset>
            <fieldset>
                <label for="eventDate"></label>
                <input type="datetime" name="eventDate" id="eventDate"></input>
            </fieldset>
            <fieldset>
                <label for="eventLocation"></label>
                <input type="text" name="eventLocation" id="eventLocation"></input>
            </fieldset>
        </form>`;
    },
    collectValues: () => {},
    createEventObject: () => {},
    createEventHTML: () => {},
}

export default eventsModule;