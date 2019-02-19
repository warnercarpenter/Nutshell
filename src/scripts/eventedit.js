import APIManager from "./APIManager";
import dashboardRefreshional from "./dashboardRefreshional";
import monthConverter from "./monthConverter"

const eventEdit = () => {
    const eventDisplay = document.getElementById("eventDisplay")
    eventDisplay.addEventListener("click", function(event) {
        if (event.target.id.split("--")[1] === "edit") {
            const eventId = parseInt(event.target.id.split("--")[2])
            let eventObject = ""
            APIManager.fetchWithoutUserInfo("events").then(function(events) {
                eventObject = events.find(event => event.id === eventId)
                const date = new Date(eventObject.date);
                const stringDate = date.toString()
                const year = stringDate.split(" ")[3]
                const month = monthConverter(stringDate.split(" ")[1])
                const day = stringDate.split(" ")[2]
                const time = stringDate.split(" ")[4]
                eventDisplay.innerHTML = `
                    <div>Edit event name</div><input type="text" id="eventNameEdit" value="${eventObject.name}"></input>
                    <div>Edit event location</div><input type="text" id="eventLocationEdit" value="${eventObject.location}"></input>
                    <div>Edit event date</div><input type="date" id="eventDateEdit" value="${year}-${month}-${day}"}></input>
                    <div>Edit event time</div><input type="time" id="eventTimeEdit" value="${time}"}></input>
                <button id="eventEditSave">Save</button>
                <button id="eventEditCancel">Cancel</button>`

                document.getElementById("eventNameEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("eventEditSave").click();
                    }
                  });
                document.getElementById("eventLocationEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("eventEditSave").click();
                    }
                  });
                document.getElementById("eventDateEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("eventEditSave").click();
                    }
                  });
                document.getElementById("eventTimeEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("eventEditSave").click();
                    }
                  });

                document.getElementById("eventEditSave").addEventListener("click", function(event) {
                    const eventDateTime = document.getElementById("eventDateEdit").value + " " + document.getElementById("eventTimeEdit").value
                    eventObject.name = document.getElementById("eventNameEdit").value
                    eventObject.location = document.getElementById("eventLocationEdit").value
                    eventObject.date = new Date(eventDateTime).getTime()
                    APIManager.Put("events", eventId, eventObject).then(dashboardRefreshional)
                })

                document.getElementById("eventEditCancel").addEventListener("click", function(event) {
                    dashboardRefreshional()
                })
            })
        }
    })
}

export default eventEdit