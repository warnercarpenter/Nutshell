(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const APIManager = {
  getByUserId: (desiredDatabase, userId) => {
    return fetch(`http://localhost:8088/${desiredDatabase}?_userId=${userId}`).then(res => res.json());
  },
  delete: (desiredDatabase, objectId) => {
    return fetch(`http://127.0.0.1:8088/${desiredDatabase}/${objectId}`, {
      method: "DELETE"
    });
  },
  Post: (desiredDatabase, objectToPost) => {
    return fetch(`http://localhost:8088/${desiredDatabase}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToPost)
    }).then(res => res.json());
  },
  Put: (desiredDatabase, objectId, editedObject) => {
    return fetch(`http://localhost:8088/${desiredDatabase}/${objectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedObject)
    }).then(res => res.json());
  },
  fetchWithExpandedUserInfo: (desiredDatabase, userId) => {
    return fetch(`http://localhost:8088/${desiredDatabase}?_expand=user&userId=${userId}`).then(res => res.json());
  }
};
var _default = APIManager;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _APIManager = _interopRequireDefault(require("./APIManager"));

var _printToDOM = _interopRequireDefault(require("./printToDOM"));

var _eventsModule = _interopRequireDefault(require("./eventsModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Task: listen to the body of the page for clicks, and call other methods based on the target of the click
*/
const clickBubbler = {
  listener: () => {
    document.querySelector("#dashboardContainer").addEventListener("click", event => {
      if (event.target.nodeName === "BUTTON") {
        const targetList = event.target.id.split("--");
        const where = targetList[0] + "Display";
        let newObject = {};

        if (targetList[1] === "add") {
          let newHTMLstring = "";
          newHTMLstring = _eventsModule.default.buildEntryForm();
          (0, _printToDOM.default)(newHTMLstring, "#dashboardContainer");
        } else if (targetList[1] === "create") {
          // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
          if (targetList[0] === "events") {
            newObject = _eventsModule.default.createEventObject();
          } // then call the api create method and pass it the new object and the module name


          _APIManager.default.Post(targetList[0], newObject) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
          .then(objectArray => {
            let newHTMLstring = "";
            objectArray.forEach(element => {
              if (targetList[0] === "events") {
                newHTMLstring += _eventsModule.default.createEventHTML(element);
              }
            }); // call printToDom() and pass it the new HTML string

            (0, _printToDOM.default)(newHTMLstring, where);
          });
        } else if (targetList[1] === "edit") {
          // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
          if (targetList[0] === "events") {
            newObject = _eventsModule.default.createEventObject();
          } // then call the api edit method and pass it the new object, the module name, and the original object id
          //desiredDatabase, objectId, editedObject


          let eventId = document.querySelector("#eventId");

          _APIManager.default.Put(targetList[0], eventId, newObject) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
          .then(objectArray => {
            let newHTMLstring = "";
            objectArray.forEach(element => {
              if (targetList[0] === "events") {
                newHTMLstring += _eventsModule.default.createEventHTML(element);
              }
            }); // call printToDom() and pass it the new HTML string

            (0, _printToDOM.default)(newHTMLstring, where);
          });
        } else if (targetList[1] === "delete") {
          // call the api delete method and pass it the module name and the original object id
          let eventId = document.querySelector("#eventId");

          _APIManager.default.delete(targetList[0], eventId) // .then() and call the api list method, passing it the correct module and userid
          .then(() => {
            _APIManager.default.getByUserId(targetList[0], Window.sessionStorage.getItem('userId')) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
            .then(objectArray => {
              let newHTMLstring = "";
              objectArray.forEach(element => {
                if (targetList[0] === "events") {
                  newHTMLstring += _eventsModule.default.createEventHTML(element);
                }
              }); // call printToDom() and pass it the new HTML string

              (0, _printToDOM.default)(newHTMLstring, where);
            });
          });
        }
      }
    });
  }
};
var _default = clickBubbler;
exports.default = _default;

},{"./APIManager":1,"./eventsModule":3,"./printToDOM":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timestampparser = _interopRequireDefault(require("./timestampparser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
Author: Panya
Task: handles all functions specific to the events listing in Nutshell
*/
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
    let location = document.querySelector("#eventLocation").value; // const userId = Window.sessionStorage.getItem('userId');

    const userId = 1; // eventId = document.querySelector("#eventId").value;

    const eventObject = {
      name: name,
      date: date,
      location: location,
      userId: userId
    };
    return eventObject; // if (eventId !== "") {
    // } else {
    // }
  },
  createEventHTML: eventObject => {
    let time = (0, _timestampparser.default)(eventObject.date);
    return `<section class="events" id="event--${eventObject.id}">
        <div class="eventName">${eventObject.name}</div>
        <div>${time}</div>
        <div>${eventObject.location}</div>
        </section>`;
  }
};
var _default = eventsModule;
exports.default = _default;

},{"./timestampparser":6}],4:[function(require,module,exports){
"use strict";

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import event listeners module from "./eventlisteners"
// hello world
_eventListeners.default.listener();

},{"./eventListeners":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const printToDOM = (what, where) => {
  document.querySelector(`${where}`).innerHTML += what;
};

var _default = printToDOM;
exports.default = _default;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function timeConverter(timestamp) {
  var a = new Date(parseInt(timestamp));
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
  return time;
}

;
var _default = timeConverter;
exports.default = _default;

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3RpbWVzdGFtcHBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0NBLE1BQU0sVUFBVSxHQUFHO0FBQ2YsRUFBQSxXQUFXLEVBQUUsQ0FBQyxlQUFELEVBQWtCLE1BQWxCLEtBQTZCO0FBQ3RDLFdBQU8sS0FBSyxDQUFHLHlCQUF3QixlQUFnQixZQUFXLE1BQU8sRUFBN0QsQ0FBTCxDQUNGLElBREUsQ0FDRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEVixDQUFQO0FBR0gsR0FMYztBQU1mLEVBQUEsTUFBTSxFQUFFLENBQUMsZUFBRCxFQUFrQixRQUFsQixLQUErQjtBQUNuQyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsSUFBRyxRQUFTLEVBQXRELEVBQXlEO0FBQzdELE1BQUEsTUFBTSxFQUFFO0FBRHFELEtBQXpELENBQVo7QUFHSixHQVZlO0FBV2hCLEVBQUEsSUFBSSxFQUFFLENBQUMsZUFBRCxFQUFrQixZQUFsQixLQUFtQztBQUN4QyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsRUFBMUMsRUFBNkM7QUFDckQsTUFBQSxNQUFNLEVBQUUsTUFENkM7QUFFckQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUY0QztBQUtyRCxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFlBQWY7QUFMK0MsS0FBN0MsQ0FBTCxDQU9GLElBUEUsQ0FPRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFQVixDQUFQO0FBUUEsR0FwQmU7QUFxQmYsRUFB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RUFBbUMsU0FBbkMsSUFBZ0QsSUFBaEQ7QUFDSCxDQUZEOztlQUtlLFU7Ozs7Ozs7Ozs7O0FDTGYsU0FBUyxhQUFULENBQXdCLFNBQXhCLEVBQW1DO0FBQy9CLE1BQUksQ0FBQyxHQUFHLElBQUksSUFBSixDQUFTLFFBQVEsQ0FBQyxTQUFELENBQWpCLENBQVI7QUFDQSxNQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUQsRUFBTyxLQUFQLEVBQWEsS0FBYixFQUFtQixLQUFuQixFQUF5QixLQUF6QixFQUErQixLQUEvQixFQUFxQyxLQUFyQyxFQUEyQyxLQUEzQyxFQUFpRCxLQUFqRCxFQUF1RCxLQUF2RCxFQUE2RCxLQUE3RCxFQUFtRSxLQUFuRSxDQUFiO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQUYsRUFBWDtBQUNBLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBRixFQUFELENBQWxCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQUYsRUFBWDtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFGLEVBQVg7QUFDQSxNQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBRixFQUFWO0FBQ0EsTUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQVAsR0FBYSxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCLElBQTNCLEdBQWtDLEdBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQS9DLEdBQXFELEdBQWhFO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBQUE7ZUFFYyxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBBUElNYW5hZ2VyID0ge1xuICAgIGdldEJ5VXNlcklkOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fdXNlcklkPSR7dXNlcklkfWApXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICAgIH0sXG4gICAgZGVsZXRlOiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gICB9LFxuICAgUG9zdDogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0VG9Qb3N0KSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9YCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvYmplY3RUb1Bvc3QpXG4gICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICB9LFxuICAgIFB1dDooZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCwgZWRpdGVkT2JqZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVkaXRlZE9iamVjdClcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfSxcbiAgICBmZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fZXhwYW5kPXVzZXImdXNlcklkPSR7dXNlcklkfWApXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJTWFuYWdlciIsIi8qXG5BdXRob3I6IFBhbnlhXG5UYXNrOiBsaXN0ZW4gdG8gdGhlIGJvZHkgb2YgdGhlIHBhZ2UgZm9yIGNsaWNrcywgYW5kIGNhbGwgb3RoZXIgbWV0aG9kcyBiYXNlZCBvbiB0aGUgdGFyZ2V0IG9mIHRoZSBjbGlja1xuKi9cblxuaW1wb3J0IEFQSU1hbmFnZXIgZnJvbSBcIi4vQVBJTWFuYWdlclwiO1xuaW1wb3J0IHByaW50VG9ET00gZnJvbSBcIi4vcHJpbnRUb0RPTVwiO1xuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIjtcblxuY29uc3QgY2xpY2tCdWJibGVyID0ge1xuICAgIGxpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGFzaGJvYXJkQ29udGFpbmVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIkJVVFRPTlwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0TGlzdCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdoZXJlID0gdGFyZ2V0TGlzdFswXSArIFwiRGlzcGxheVwiO1xuICAgICAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBldmVudHNNb2R1bGUuYnVpbGRFbnRyeUZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCBcIiNkYXNoYm9hcmRDb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0TGlzdFswXSA9PT0gXCJldmVudHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgY3JlYXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbmV3IG9iamVjdCBhbmQgdGhlIG1vZHVsZSBuYW1lXG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuUG9zdCh0YXJnZXRMaXN0WzBdLCBuZXdPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRMaXN0WzBdID09PSBcImV2ZW50c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHByaW50VG9Eb20oKSBhbmQgcGFzcyBpdCB0aGUgbmV3IEhUTUwgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiZWRpdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0TGlzdFswXSA9PT0gXCJldmVudHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgZWRpdCBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG5ldyBvYmplY3QsIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcbiAgICAgICAgICAgICAgICAgICAgLy9kZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkLCBlZGl0ZWRPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIik7XG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuUHV0KHRhcmdldExpc3RbMF0sIGV2ZW50SWQsIG5ld09iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxuICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldExpc3RbMF0gPT09IFwiZXZlbnRzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludFRvRE9NKG5ld0hUTUxzdHJpbmcsIHdoZXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJkZWxldGVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBhcGkgZGVsZXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbW9kdWxlIG5hbWUgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIik7XG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuZGVsZXRlKHRhcmdldExpc3RbMF0sIGV2ZW50SWQpXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGFwaSBsaXN0IG1ldGhvZCwgcGFzc2luZyBpdCB0aGUgY29ycmVjdCBtb2R1bGUgYW5kIHVzZXJpZFxuICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLmdldEJ5VXNlcklkKHRhcmdldExpc3RbMF0sIFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBjcmVhdGUgSFRNTCBtZXRob2QgZnJvbSB0aGUgY29ycmVjdCBtb2R1bGUsIHVzaW5nIHRoZSByZXR1cm5lZCBQcm9taXNlIGZyb20gYXBpIG1ldGhvZCB0byBmaWxsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldExpc3RbMF0gPT09IFwiZXZlbnRzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGlja0J1YmJsZXI7IiwiLypcbkF1dGhvcjogUGFueWFcblRhc2s6IGhhbmRsZXMgYWxsIGZ1bmN0aW9ucyBzcGVjaWZpYyB0byB0aGUgZXZlbnRzIGxpc3RpbmcgaW4gTnV0c2hlbGxcbiovXG5cbmltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xuXG5jb25zdCBldmVudHNNb2R1bGUgPSB7XG4gICAgYnVpbGRFbnRyeUZvcm06IGV2ZW50SWQgPT4ge1xuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiZXZlbnRGb3JtXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJldmVudElkXCIgdmFsdWU9XCIke2V2ZW50SWR9XCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnROYW1lXCI+TmFtZSBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXZlbnROYW1lXCIgaWQ9XCJldmVudE5hbWVcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnREYXRlXCI+RGF0ZSBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lXCIgbmFtZT1cImV2ZW50RGF0ZVwiIGlkPVwiZXZlbnREYXRlXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50TG9jYXRpb25cIj5Mb2NhdGlvbiBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXZlbnRMb2NhdGlvblwiIGlkPVwiZXZlbnRMb2NhdGlvblwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tY3JlYXRlXCI+Q3JlYXRlIE5ldyBFdmVudDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+YDtcbiAgICB9LFxuICAgIGNyZWF0ZUV2ZW50T2JqZWN0OiBldmVudElkID0+IHtcbiAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50TmFtZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50RGF0ZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudExvY2F0aW9uXCIpLnZhbHVlO1xuICAgICAgICAvLyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IDE7XG4gICAgICAgIC8vIGV2ZW50SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIikudmFsdWU7XG5cbiAgICAgICAgY29uc3QgZXZlbnRPYmplY3QgPSB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZlbnRPYmplY3Q7XG4gICAgICAgIC8vIGlmIChldmVudElkICE9PSBcIlwiKSB7XG5cbiAgICAgICAgLy8gfSBlbHNlIHtcblxuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBjcmVhdGVFdmVudEhUTUw6IGV2ZW50T2JqZWN0ID0+IHtcbiAgICAgICAgbGV0IHRpbWUgPSB0aW1lQ29udmVydGVyKGV2ZW50T2JqZWN0LmRhdGUpO1xuICAgICAgICByZXR1cm4gYDxzZWN0aW9uIGNsYXNzPVwiZXZlbnRzXCIgaWQ9XCJldmVudC0tJHtldmVudE9iamVjdC5pZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50TmFtZVwiPiR7ZXZlbnRPYmplY3QubmFtZX08L2Rpdj5cbiAgICAgICAgPGRpdj4ke3RpbWV9PC9kaXY+XG4gICAgICAgIDxkaXY+JHtldmVudE9iamVjdC5sb2NhdGlvbn08L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzTW9kdWxlOyIsIi8vIGltcG9ydCBldmVudCBsaXN0ZW5lcnMgbW9kdWxlIGZyb20gXCIuL2V2ZW50bGlzdGVuZXJzXCJcblxuLy8gaGVsbG8gd29ybGRcblxuaW1wb3J0IGxpc3RlbmVycyBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiO1xuXG5saXN0ZW5lcnMubGlzdGVuZXIoKTsiLCJjb25zdCBwcmludFRvRE9NID0gKHdoYXQsIHdoZXJlKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHt3aGVyZX1gKS5pbm5lckhUTUwgKz0gd2hhdFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHByaW50VG9ET007XG4iLCJmdW5jdGlvbiB0aW1lQ29udmVydGVyICh0aW1lc3RhbXApIHtcbiAgICB2YXIgYSA9IG5ldyBEYXRlKHBhcnNlSW50KHRpbWVzdGFtcCkpO1xuICAgIHZhciBtb250aHMgPSBbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xuICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xuICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xuICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XG4gICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XG4gICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xuICAgIHZhciB0aW1lID0gZGF0ZSArICcgJyArIG1vbnRoICsgJyAnICsgeWVhciArICcgJyArIGhvdXIgKyAnOicgKyBtaW47XG4gICAgcmV0dXJuIHRpbWU7XG4gIH07XG5cbiAgZXhwb3J0IGRlZmF1bHQgdGltZUNvbnZlcnRlcjsiXX0=
