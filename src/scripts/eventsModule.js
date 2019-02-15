/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/

import timeConverter from "./timestampparser";

const eventsModule = {
    buildEntryForm: eventId => {
        return `<form id="eventForm">
            <input type="hidden" name="eventId" value="${eventId}"></input>
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
    createEventObject: eventId => {
        let name = document.querySelector("#eventName").value;
        let date = document.querySelector("#eventDate").value;
        let location = document.querySelector("#eventLocation").value;
        const userId = Window.sessionStorage.getItem('userId');
        // eventId = document.querySelector("#eventId").value;

        const eventObject = {
            name: name,
            date: date,
            location: location,
            userId: userId
        }

        return eventObject;
        // if (eventId !== "") {

        // } else {

        // }
    },
    createEventHTML: (eventObject, userId) => {
        let time = timeConverter(eventObject.date)
        let baseHTML =  `<section class="events" id="event--${eventObject.id}">
        <div class="eventName">${eventObject.name}</div>
        <p>${time}</p>
        <p>${eventObject.location}</p>
        </section>`;

        if (eventObject.userId === userId) {
            baseHTML += `
                <button id="events--edit--${eventObject.id}">Edit</button>
                <button id="events--delete--${eventObject.id}">Delete</button>
            `
        }

        baseHTML += "<hr/>"

        return baseHTML
    },
}

export default eventsModule;