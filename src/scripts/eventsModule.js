/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/

import timeConverter from "./timestampparser";
import APIManager from "./APIManager";

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
                <input type="date" name="eventDate" id="eventDate"></input>
                <input type="time" name="eventTime" id="eventTime"></input>
            </fieldset>
            <fieldset>
                <label for="eventLocation">Location of the event:</label>
                <input type="text" name="eventLocation" id="eventLocation"></input>
            </fieldset>
            <button id="events--create">Create New Event</button>
        </form>`;
    },
    createEventObject: eventId => {
        const userId = parseInt(sessionStorage.getItem('userId'));
        if (eventId === undefined) {
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
        } else {
            //eventId = document.querySelector("#eventId").value;
            APIManager.getUsAnyById("events", eventId)
            .then(
                editingObject => {
                    let newHTMLString = eventsModule.buildEntryForm(eventId);
                    document.querySelector("#formSection").innerHTML = newHTMLString;
                    let oldtime = timeConverter(eventObject.date);

                    document.querySelector("#eventName").value = editingObject.name;
                    //document.querySelector("#eventDate").value = oldtime;
                    document.querySelector("#eventLocation").value = editingObject.location;

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
                })
        }
    },
    createEventHTML: (eventObject, userId) => {
        let time = timeConverter(eventObject.date);
        let baseHTML =  `<section class="events" id="event--${eventObject.id}">
        <div class="eventName">${eventObject.name}</div>
        <p class="eventTime">Time: ${time}</p>
        <p>Location: ${eventObject.location}</p>
        </section>`;

        if (eventObject.userId === userId) {
            baseHTML += `
                <button id="events--edit--${eventObject.id}">Edit</button>
                <button id="events--delete--${eventObject.id}">Delete</button>
            `
        };

        baseHTML += "<hr/>";

        return baseHTML;
    },
};

export default eventsModule;