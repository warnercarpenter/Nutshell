/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/

import timeConverter from "./timestampparser";
import APIManager from "./APIManager";

const eventsModule = {
    buildEntryForm: eventId => {
        return `<section id="eventForm">
            <input type="hidden" id="eventId" value="${eventId}"></input>
            <fieldset>
                <label for="eventName">Name of the event:</label>
                <input type="text" name="eventName" id="eventName"></input>
            </fieldset>
            <fieldset>
                <label for="eventDate">Date of the event:</label>
                <input type="date" name="eventDate" id="eventDate"></input>
                <input type="time" name="eventTime" id="eventTime"></input>
            </fieldset>
            <fieldset>
                <label for="eventLocation">Location of the event:</label>
                <input type="text" name="eventLocation" id="eventLocation"></input>
            </fieldset>
            <button onsubmit="return false" id="events--create">Create New Event</button>
            <button id="events--cancel">Cancel</button>
        </section>`;
    },
    createEventObject: () => {
        const userId = parseInt(sessionStorage.getItem('userId'));
        let name = document.querySelector("#eventName").value;
        let date = document.querySelector("#eventDate").value;
        let time = document.querySelector("#eventTime").value;
        let location = document.querySelector("#eventLocation").value;

        let concat_datetime = `${date} ${time}`;
        let datetime = new Date(concat_datetime);
        let timestamp = datetime.getTime();

        const eventObject = {
            name: name,
            date: timestamp,
            location: location,
            userId: userId
        };

        return eventObject;
    },
    editEventObject: eventId => {
        APIManager.getAnyById("events", eventId)
        .then(
        editingObject => {
            let newHTMLString = eventsModule.buildEntryForm(eventId);
            document.querySelector("#formSection").innerHTML = newHTMLString;
            let oldtime = timeConverter(editingObject.date);

            document.querySelector("#eventName").value = editingObject.name;
                        //document.querySelector("#eventDate").value = oldtime;
            document.querySelector("#eventLocation").value = editingObject.location;
            document.querySelector("#events--create").textContent = "Save Changes";
            document.querySelector("#events--create").id = "events--editing";
        })
    },
    createEventHTML: (eventObject, userId, checker, username) => {
        let time = timeConverter(eventObject.date)
        let baseHTML = ""
        if (checker === 0) {
            baseHTML = '<section class="nextEvent">';
        } else {
            baseHTML = '<section>';
        }
        baseHTML +=  `<section class="events" id="event--${eventObject.id}">
        <div class="eventName">${eventObject.name}</div>
        <p class="eventTime">Time: ${time}</p>
        <p>Location: ${eventObject.location}</p>
        <p class="eventSubText">by ${username}</p>
        </section>`;

        if (eventObject.userId === userId) {
            baseHTML += `
                <button id="events--edit--${eventObject.id}">Edit</button>
                <button id="events--delete--${eventObject.id}">Delete</button>
            `
        };

        baseHTML += "</section><hr/>"

        return baseHTML;
    },
};

export default eventsModule;