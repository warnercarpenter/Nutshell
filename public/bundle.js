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
const articleModule = {
  buildArticleForm: articleId => {
    return `<form id="articleForm">
            <input type="hidden" name="articleId" value="${articleId}"></input>
            <fieldset>
                <label for="articleTitle">Article Title:</label>
                <input type="text" name="articleTitle" id="articleTitle"></input>
            </fieldset>
            <fieldset>
                <label for="articleSummary">Article Summary:</label>
                <input type="text" name="articleSummary" id="articleSummary"></input>
            </fieldset>
            <fieldset>
                <label for="articleURL">Article URL:</label>
                <input type="text" name="articleURL" id="articleURL"></input>
            </fieldset>
            <button id="articles--create">Post Your Article</button>
        </form>`;
  },
  createArticleObject: () => {
    let title = document.querySelector("#articleTitle").value;
    let summary = document.querySelector("#articleSummary").value;
    let url = document.querySelector("#articleURL").value; // const userId = Window.sessionStorage.getItem('userId');

    const userId = 1; // let articleId = document.querySelector("#articleId").value;

    const articleObject = {
      title: title,
      summary: summary,
      url: url,
      timestamp: Date.now(),
      userId: userId
    };
    return articleObject;
  },
  createArticleHTML: (articleObject, userId) => {
    let baseHTML = `<section class="articles" id="article--${articleObject.id}">
        <div class="articleTitle">${articleObject.title}</div>
        <p>${articleObject.summary}</p>
        <p><a href="http://${articleObject.url}" target="_blank">${articleObject.url}</a></p>
        `;

    if (articleObject.userId === userId) {
      baseHTML += `
                <button id="articles--edit--${articleObject.id}">Edit</button>
                <button id="articles--delete--${articleObject.id}">Delete</button>
            `;
    }

    baseHTML += "</section><hr/>";
    return baseHTML;
  }
};
var _default = articleModule;
exports.default = _default;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timestampparser = _interopRequireDefault(require("./timestampparser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chatsModule = {
  buildChatsForm: chatId => {
    return `
            <div id="chatsForm">
                <input type="hidden" name="chatId" value="${chatId}"></input>
                Enter your message:</br>
                <textarea rows="4" cols="50" name="chatMessage" id="chat--textInput"></textarea></br>
                <button id="chats--create">Submit</button>
            </div>
        `;
  },
  buildChatsObject: () => {
    const chatsObject = {};
    chatsObject.text = document.getElementById("chat--textInput").value;
    chatsObject.timestamp = Date.now(); // chatsObject.userId = Window.sessionStorage.getItem('userId')

    chatsObject.userId = 1;
    return chatsObject;
  },
  buildChatsHTML: (chatObject, userId) => {
    const chatTimestamp = (0, _timestampparser.default)(chatObject.timestamp);
    let baseHTML = `
            <div class="chats" id="chat--${chatObject.id}"
                <p class="chatTextContent">${chatObject.text}</p>
                <p class="chatSubText">Posted by ${chatObject.user.username} on ${chatTimestamp}</p>
        `;

    if (chatObject.userId === userId) {
      baseHTML += `
                <button id="chats--edit--${chatObject.id}">Edit</button>
                <button id="chats--delete--${chatObject.id}">Delete</button>
            `;
    }

    baseHTML += "</div><hr/>";
    return baseHTML;
  }
};
var _default = chatsModule;
exports.default = _default;

},{"./timestampparser":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _APIManager = _interopRequireDefault(require("./APIManager"));

var _printToDOM = _interopRequireDefault(require("./printToDOM"));

var _chats = _interopRequireDefault(require("./chats"));

var _article = _interopRequireDefault(require("./article"));

var _eventsModule = _interopRequireDefault(require("./eventsModule"));

var _task = _interopRequireDefault(require("./task"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dashboardRefreshional = () => {
  // NEED TO BE CHANGED TO const userId = Window.sessionStorage.getItem('userId');
  const userId = 1; //

  const chatContainer = document.getElementById("chatDisplay");
  const articleContainer = document.getElementById("articleDisplay");
  const eventContainer = document.getElementById("eventDisplay");
  const taskContainer = document.getElementById("taskDisplay");
  const friendContainer = document.getElementById("friendDisplay");
  chatContainer.innerHTML = "";
  articleContainer.innerHTML = "";
  eventContainer.innerHTML = "";
  taskContainer.innerHTML = "";
  friendContainer.innerHTML = "";

  _APIManager.default.fetchWithExpandedUserInfo("chats", userId).then(function (chats) {
    for (let i = 0; i < chats.length; i++) {
      const currentMessage = chats[i];

      const messageHTML = _chats.default.buildChatsHTML(currentMessage, userId);

      (0, _printToDOM.default)(messageHTML, "#" + chatContainer.id);
    }
  });

  _APIManager.default.fetchWithExpandedUserInfo("articles", userId).then(function (articles) {
    for (let i = 0; i < articles.length; i++) {
      const currentArticle = articles[i];

      const articleHTML = _article.default.createArticleHTML(currentArticle, userId);

      (0, _printToDOM.default)(articleHTML, "#" + articleContainer.id);
    }
  });

  _APIManager.default.fetchWithExpandedUserInfo("events", userId).then(function (events) {
    for (let i = 0; i < events.length; i++) {
      const currentEvent = events[i];

      const eventHTML = _eventsModule.default.createEventHTML(currentEvent, userId);

      (0, _printToDOM.default)(eventHTML, "#" + eventContainer.id);
    }
  });

  _APIManager.default.fetchWithExpandedUserInfo("tasks", userId).then(function (tasks) {
    for (let i = 0; i < tasks.length; i++) {
      const currentTask = tasks[i];

      const taskHTML = _task.default.taskToHTML(currentTask, userId);

      (0, _printToDOM.default)(taskHTML, "#" + taskContainer.id);
    }
  });
};

var _default = dashboardRefreshional;
exports.default = _default;

},{"./APIManager":1,"./article":2,"./chats":3,"./eventsModule":6,"./printToDOM":8,"./task":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _APIManager = _interopRequireDefault(require("./APIManager"));

var _printToDOM = _interopRequireDefault(require("./printToDOM"));

var _eventsModule = _interopRequireDefault(require("./eventsModule"));

var _chats = _interopRequireDefault(require("./chats"));

var _task = _interopRequireDefault(require("./task"));

var _article = _interopRequireDefault(require("./article"));

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
        const where = `#${targetList[0]}Display`;
        let newObject = {};
        let targetId = "";

        if (targetList[1] === "add") {
          let newHTMLstring = "";

          switch (targetList[0]) {
            case 'event':
              newHTMLstring = _eventsModule.default.buildEntryForm();
              break;

            case 'chat':
              newHTMLstring = _chats.default.buildChatsForm();
              break;

            case 'task':
              newHTMLstring = _task.default.taskForm();
              break;

            case 'article':
              newHTMLstring = _article.default.buildArticleForm();
              break;
          }

          document.querySelector("#dashboardContainer").innerHTML = newHTMLstring;
        } else if (targetList[1] === "create") {
          // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
          switch (targetList[0]) {
            case 'events':
              newObject = _eventsModule.default.createEventObject();
              break;

            case 'chats':
              newObject = _chats.default.buildChatsObject();
              break;

            case 'tasks':
              newObject = _task.default.captureFormValues();
              break;

            case 'articles':
              newObject = _article.default.createArticleObject();
              break;
          } // then call the api create method and pass it the new object and the module name


          _APIManager.default.Post(targetList[0], newObject) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
          .then(objectArray => {
            let newHTMLstring = "";

            switch (targetList[0]) {
              case 'events':
                newHTMLstring += _eventsModule.default.createEventHTML(objectArray);
                break;

              case 'chats':
                newHTMLstring += _chats.default.buildChatsHTML(objectArray);
                break;

              case 'tasks':
                newHTMLstring += _task.default.taskToHTML(objectArray);
                break;

              case 'articles':
                newHTMLstring += _article.default.createArticleHTML(objectArray);
                break;
            } // call printToDom() and pass it the new HTML string


            (0, _printToDOM.default)(newHTMLstring, where);
          });
        } else if (targetList[1] === "edit") {
          // call the correct object factory based on targetList[0], which should contain the module name (i.e. 'events')
          switch (targetList[0]) {
            case 'events':
              newObject = _eventsModule.default.createEventObject();
              targetId = document.querySelector("#eventId");
              break;

            case 'chats':
              newObject = _chats.default.buildChatsObject();
              targetId = document.querySelector("#chatId");
              break;

            case 'tasks':
              newObject = _task.default.captureFormValues();
              targetId = document.querySelector("#objectId");
              break;

            case 'articles':
              newObject = _article.default.createArticleObject();
              targetId = document.querySelector("#articleId");
              break;
          } // then call the api edit method and pass it the new object, the module name, and the original object id
          //desiredDatabase, objectId, editedObject


          _APIManager.default.Put(targetList[0], targetId, newObject) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
          .then(objectArray => {
            let newHTMLstring = "";
            objectArray.forEach(element => {
              switch (targetList[0]) {
                case 'events':
                  newHTMLstring += _eventsModule.default.createEventHTML(element);
                  break;

                case 'chats':
                  newHTMLstring += _chats.default.buildChatsHTML(element);
                  break;

                case 'tasks':
                  newHTMLstring += _task.default.taskToHTML(element);
                  break;

                case 'articles':
                  newHTMLstring += _article.default.createArticleHTML(element);
                  break;
              }
            }); // call printToDom() and pass it the new HTML string

            (0, _printToDOM.default)(newHTMLstring, where);
          });
        } else if (targetList[1] === "delete") {
          // call the api delete method and pass it the module name and the original object id
          switch (targetList[0]) {
            case 'events':
              targetId = document.querySelector("#eventId");
              break;

            case 'chats':
              targetId = document.querySelector("#chatId");
              break;

            case 'tasks':
              targetId = document.querySelector("#objectId");
              break;

            case 'articles':
              targetId = document.querySelector("#articleId");
              break;
          }

          _APIManager.default.delete(targetList[0], eventId) // .then() and call the api list method, passing it the correct module and userid
          .then(() => {
            _APIManager.default.getByUserId(targetList[0], 1) // .then() and call the create HTML method from the correct module, using the returned Promise from api method to fill it
            .then(objectArray => {
              let newHTMLstring = "";
              objectArray.forEach(element => {
                switch (targetList[0]) {
                  case 'events':
                    newHTMLstring += _eventsModule.default.createEventHTML(element);
                    break;

                  case 'chats':
                    newHTMLstring += _chats.default.buildChatsHTML(element);
                    break;

                  case 'tasks':
                    newHTMLstring += _task.default.taskToHTML(element);
                    break;

                  case 'articles':
                    newHTMLstring += _article.default.createArticleHTML(element);
                    break;
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

},{"./APIManager":1,"./article":2,"./chats":3,"./eventsModule":6,"./printToDOM":8,"./task":9}],6:[function(require,module,exports){
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
  createEventHTML: (eventObject, userId) => {
    let time = (0, _timestampparser.default)(eventObject.date);
    let baseHTML = `<section class="events" id="event--${eventObject.id}">
        <div class="eventName">${eventObject.name}</div>
        <p>${time}</p>
        <p>${eventObject.location}</p>
        </section>`;

    if (eventObject.userId === userId) {
      baseHTML += `
                <button id="events--edit--${eventObject.id}">Edit</button>
                <button id="events--delete--${eventObject.id}">Delete</button>
            `;
    }

    baseHTML += "<hr/>";
    return baseHTML;
  }
};
var _default = eventsModule;
exports.default = _default;

},{"./timestampparser":10}],7:[function(require,module,exports){
"use strict";

var _dashboardRefreshional = _interopRequireDefault(require("./dashboardRefreshional"));

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import event listeners module from "./eventlisteners"
// hello world
(0, _dashboardRefreshional.default)();

_eventListeners.default.listener();

},{"./dashboardRefreshional":4,"./eventListeners":5}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timestampparser = _interopRequireDefault(require("./timestampparser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tasksModule = {
  taskToHTML: function (taskObject, userId) {
    const taskTimestamp = (0, _timestampparser.default)(taskObject.completion_date);
    let baseHTML = `
            <section class="tasks" id="task--${taskObject.id}>
            <div class="taskName">${taskObject.name}</div>
            <p id="completion_date">${taskTimestamp}</p>
            <label for="is_complete" id="task_complete">${taskObject.is_complete}</label>
        `;

    if (taskObject.userId === userId) {
      baseHTML += `
                <button id="tasks--edit--${taskObject.id}">Edit</button>
                <button id="tasks--delete--${taskObject.id}">Delete</button>
            `;
    }

    baseHTML += "</section><hr/>";
    return baseHTML;
  },
  taskForm: function (objectId) {
    return `
        <fieldset>
            <input type="hidden" id="userId" value="${objectId}"><br>
            <label for="name">Name of task: </label><br>
            <input type="text" placeholder="Task name" id="taskName">
        </fieldset>
            <label for="completion_date">Date to be completed by: </label><br>
            <input type="date" id="taskDate">
        <fieldset>
            <label>Is task complete: </label><br>
            <input type="checkbox" id="taskComplete" value="Yes">Yes<br>
            <input type="checkbox" id="taskComplete" value="No">No<br>
        </fieldset>
        <fieldset>
            <button id="tasks--create">Submit</button>
        </fieldset>
        `;
  },
  captureFormValues: function () {
    const taskObject = {
      name: document.querySelector("#taskName").value,
      completion_date: document.querySelector("#taskDate").value,
      is_complete: document.querySelector("#taskComplete").value,
      //userId: Window.sessionStorage.getItem("userId")
      userId: 1
    };
    return taskObject;
  }
};
var _default = tasksModule;
exports.default = _default;

},{"./timestampparser":10}],10:[function(require,module,exports){
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

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3Rhc2suanMiLCIuLi9zY3JpcHRzL3RpbWVzdGFtcHBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0NBLE1BQU0sVUFBVSxHQUFHO0FBQ2YsRUFBQSxXQUFXLEVBQUUsQ0FBQyxlQUFELEVBQWtCLE1BQWxCLEtBQTZCO0FBQ3RDLFdBQU8sS0FBSyxDQUFHLHlCQUF3QixlQUFnQixZQUFXLE1BQU8sRUFBN0QsQ0FBTCxDQUNGLElBREUsQ0FDRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEVixDQUFQO0FBR0gsR0FMYztBQU1mLEVBQUEsTUFBTSxFQUFFLENBQUMsZUFBRCxFQUFrQixRQUFsQixLQUErQjtBQUNuQyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsSUFBRyxRQUFTLEVBQXRELEVBQXlEO0FBQzdELE1BQUEsTUFBTSxFQUFFO0FBRHFELEtBQXpELENBQVo7QUFHSixHQVZlO0FBV2hCLEVBQUEsSUFBSSxFQUFFLENBQUMsZUFBRCxFQUFrQixZQUFsQixLQUFtQztBQUN4QyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsRUFBMUMsRUFBNkM7QUFDckQsTUFBQSxNQUFNLEVBQUUsTUFENkM7QUFFckQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUY0QztBQUtyRCxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFlBQWY7QUFMK0MsS0FBN0MsQ0FBTCxDQU9GLElBUEUsQ0FPRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFQVixDQUFQO0FBUUEsR0FwQmU7QUFxQmYsRUFBQSxHQUFHLEVBQUMsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLEVBQTRCLFlBQTVCLEtBQTZDO0FBQzdDLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixJQUFHLFFBQVMsRUFBdEQsRUFBeUQ7QUFDakUsTUFBQSxNQUFNLEVBQUUsS0FEeUQ7QUFFakUsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUZ3RDtBQUtqRSxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFlBQWY7QUFMMkQsS0FBekQsQ0FBTCxDQU9OLElBUE0sQ0FPRCxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFQTixDQUFQO0FBUUgsR0E5QmM7QUErQmYsRUFBQSx5QkFBeUIsRUFBRSxDQUFDLGVBQUQsRUFBa0IsTUFBbEIsS0FBNkI7QUFDcEQsV0FBTyxLQUFLLENBQUcseUJBQXdCLGVBQWdCLHdCQUF1QixNQUFPLEVBQXpFLENBQUwsQ0FDRixJQURFLENBQ0csR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFKLEVBRFYsQ0FBUDtBQUdIO0FBbkNjLENBQW5CO2VBc0NlLFU7Ozs7Ozs7Ozs7QUN2Q2YsTUFBTSxhQUFhLEdBQUc7QUFDbEIsRUFBQSxnQkFBZ0IsRUFBRyxTQUFELElBQWU7QUFDN0IsV0FBUTsyREFDMkMsU0FBVTs7Ozs7Ozs7Ozs7Ozs7Z0JBRDdEO0FBZ0JILEdBbEJpQjtBQW1CbEIsRUFBQSxtQkFBbUIsRUFBRSxNQUFNO0FBQ3ZCLFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDLEtBQXBEO0FBQ0EsUUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsaUJBQXZCLEVBQTBDLEtBQXhEO0FBQ0EsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBaEQsQ0FIdUIsQ0FJdkI7O0FBQ0EsVUFBTSxNQUFNLEdBQUcsQ0FBZixDQUx1QixDQU12Qjs7QUFFQSxVQUFNLGFBQWEsR0FBRztBQUNsQixNQUFBLEtBQUssRUFBRSxLQURXO0FBRWxCLE1BQUEsT0FBTyxFQUFFLE9BRlM7QUFHbEIsTUFBQSxHQUFHLEVBQUUsR0FIYTtBQUlsQixNQUFBLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBTCxFQUpPO0FBS2xCLE1BQUEsTUFBTSxFQUFFO0FBTFUsS0FBdEI7QUFRQSxXQUFPLGFBQVA7QUFFSCxHQXJDaUI7QUFzQ2xCLEVBQUEsaUJBQWlCLEVBQUUsQ0FBQyxhQUFELEVBQWdCLE1BQWhCLEtBQTJCO0FBQzFDLFFBQUksUUFBUSxHQUFJLDBDQUF5QyxhQUFhLENBQUMsRUFBRztvQ0FDOUMsYUFBYSxDQUFDLEtBQU07YUFDM0MsYUFBYSxDQUFDLE9BQVE7NkJBQ04sYUFBYSxDQUFDLEdBQUkscUJBQW9CLGFBQWEsQ0FBQyxHQUFJO1NBSDdFOztBQU1BLFFBQUksYUFBYSxDQUFDLE1BQWQsS0FBeUIsTUFBN0IsRUFBcUM7QUFDakMsTUFBQSxRQUFRLElBQUs7OENBQ3FCLGFBQWEsQ0FBQyxFQUFHO2dEQUNmLGFBQWEsQ0FBQyxFQUFHO2FBRnJEO0FBSUg7O0FBRUQsSUFBQSxRQUFRLElBQUksaUJBQVo7QUFFQSxXQUFPLFFBQVA7QUFDSDtBQXZEaUIsQ0FBdEI7ZUEwRGUsYTs7Ozs7Ozs7Ozs7QUMxRGY7Ozs7QUFFQSxNQUFNLFdBQVcsR0FBRztBQUNoQixFQUFBLGNBQWMsRUFBRyxNQUFELElBQVk7QUFDeEIsV0FBUTs7NERBRTRDLE1BQU87Ozs7O1NBRjNEO0FBUUgsR0FWZTtBQVdoQixFQUFBLGdCQUFnQixFQUFFLE1BQU07QUFDcEIsVUFBTSxXQUFXLEdBQUcsRUFBcEI7QUFDQSxJQUFBLFdBQVcsQ0FBQyxJQUFaLEdBQW1CLFFBQVEsQ0FBQyxjQUFULENBQXdCLGlCQUF4QixFQUEyQyxLQUE5RDtBQUNBLElBQUEsV0FBVyxDQUFDLFNBQVosR0FBd0IsSUFBSSxDQUFDLEdBQUwsRUFBeEIsQ0FIb0IsQ0FJcEI7O0FBQ0EsSUFBQSxXQUFXLENBQUMsTUFBWixHQUFxQixDQUFyQjtBQUNBLFdBQU8sV0FBUDtBQUNILEdBbEJlO0FBbUJoQixFQUFBLGNBQWMsRUFBRSxDQUFDLFVBQUQsRUFBYSxNQUFiLEtBQXdCO0FBQ3BDLFVBQU0sYUFBYSxHQUFHLDhCQUFjLFVBQVUsQ0FBQyxTQUF6QixDQUF0QjtBQUVBLFFBQUksUUFBUSxHQUFJOzJDQUNtQixVQUFVLENBQUMsRUFBRzs2Q0FDWixVQUFVLENBQUMsSUFBSzttREFDVixVQUFVLENBQUMsSUFBWCxDQUFnQixRQUFTLE9BQU0sYUFBYztTQUh4Rjs7QUFNQSxRQUFJLFVBQVUsQ0FBQyxNQUFYLEtBQXNCLE1BQTFCLEVBQWtDO0FBQzlCLE1BQUEsUUFBUSxJQUFLOzJDQUNrQixVQUFVLENBQUMsRUFBRzs2Q0FDWixVQUFVLENBQUMsRUFBRzthQUYvQztBQUlIOztBQUVELElBQUEsUUFBUSxJQUFJLGFBQVo7QUFFQSxXQUFPLFFBQVA7QUFDSDtBQXRDZSxDQUFwQjtlQXlDZSxXOzs7Ozs7Ozs7OztBQzNDZjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU0scUJBQXFCLEdBQUcsTUFBTTtBQUNoQztBQUNBLFFBQU0sTUFBTSxHQUFHLENBQWYsQ0FGZ0MsQ0FHaEM7O0FBQ0EsUUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBdEI7QUFDQSxRQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGdCQUF4QixDQUF6QjtBQUNBLFFBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGNBQXhCLENBQXZCO0FBQ0EsUUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBdEI7QUFDQSxRQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixlQUF4QixDQUF4QjtBQUNBLEVBQUEsYUFBYSxDQUFDLFNBQWQsR0FBMEIsRUFBMUI7QUFDQSxFQUFBLGdCQUFnQixDQUFDLFNBQWpCLEdBQTZCLEVBQTdCO0FBQ0EsRUFBQSxjQUFjLENBQUMsU0FBZixHQUEyQixFQUEzQjtBQUNBLEVBQUEsYUFBYSxDQUFDLFNBQWQsR0FBMEIsRUFBMUI7QUFDQSxFQUFBLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixFQUE1Qjs7QUFDQSxzQkFBVyx5QkFBWCxDQUFxQyxPQUFyQyxFQUE4QyxNQUE5QyxFQUFzRCxJQUF0RCxDQUEyRCxVQUFTLEtBQVQsRUFBZ0I7QUFDdkUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBMUIsRUFBa0MsQ0FBQyxFQUFuQyxFQUF1QztBQUNuQyxZQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBRCxDQUE1Qjs7QUFDQSxZQUFNLFdBQVcsR0FBRyxlQUFZLGNBQVosQ0FBMkIsY0FBM0IsRUFBMkMsTUFBM0MsQ0FBcEI7O0FBQ0EsK0JBQVcsV0FBWCxFQUF3QixNQUFNLGFBQWEsQ0FBQyxFQUE1QztBQUNIO0FBQ0osR0FORDs7QUFPQSxzQkFBVyx5QkFBWCxDQUFxQyxVQUFyQyxFQUFpRCxNQUFqRCxFQUF5RCxJQUF6RCxDQUE4RCxVQUFTLFFBQVQsRUFBbUI7QUFDN0UsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBN0IsRUFBcUMsQ0FBQyxFQUF0QyxFQUEwQztBQUN0QyxZQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBRCxDQUEvQjs7QUFDQSxZQUFNLFdBQVcsR0FBRyxpQkFBYyxpQkFBZCxDQUFnQyxjQUFoQyxFQUFnRCxNQUFoRCxDQUFwQjs7QUFDQSwrQkFBVyxXQUFYLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUMsRUFBL0M7QUFDSDtBQUNKLEdBTkQ7O0FBT0Esc0JBQVcseUJBQVgsQ0FBcUMsUUFBckMsRUFBK0MsTUFBL0MsRUFBdUQsSUFBdkQsQ0FBNEQsVUFBUyxNQUFULEVBQWlCO0FBQ3pFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQTNCLEVBQW1DLENBQUMsRUFBcEMsRUFBd0M7QUFDcEMsWUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUQsQ0FBM0I7O0FBQ0EsWUFBTSxTQUFTLEdBQUcsc0JBQWEsZUFBYixDQUE2QixZQUE3QixFQUEyQyxNQUEzQyxDQUFsQjs7QUFDQSwrQkFBVyxTQUFYLEVBQXNCLE1BQU0sY0FBYyxDQUFDLEVBQTNDO0FBQ0g7QUFDSixHQU5EOztBQU9BLHNCQUFXLHlCQUFYLENBQXFDLE9BQXJDLEVBQThDLE1BQTlDLEVBQXNELElBQXRELENBQTJELFVBQVMsS0FBVCxFQUFnQjtBQUN2RSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUExQixFQUFrQyxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFlBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFELENBQXpCOztBQUNBLFlBQU0sUUFBUSxHQUFHLGNBQVksVUFBWixDQUF1QixXQUF2QixFQUFvQyxNQUFwQyxDQUFqQjs7QUFDQSwrQkFBVyxRQUFYLEVBQXFCLE1BQU0sYUFBYSxDQUFDLEVBQXpDO0FBQ0g7QUFDSixHQU5EO0FBT0gsQ0ExQ0Q7O2VBNENlLHFCOzs7Ozs7Ozs7OztBQzlDZjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVZBOzs7O0FBWUEsTUFBTSxZQUFZLEdBQUc7QUFDakIsRUFBQSxRQUFRLEVBQUUsTUFBTTtBQUNaLElBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUJBQXZCLEVBQThDLGdCQUE5QyxDQUErRCxPQUEvRCxFQUF3RSxLQUFLLElBQUk7QUFDN0UsVUFBSSxLQUFLLENBQUMsTUFBTixDQUFhLFFBQWIsS0FBMEIsUUFBOUIsRUFBd0M7QUFDcEMsY0FBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxFQUFiLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsY0FBTSxLQUFLLEdBQUksSUFBRyxVQUFVLENBQUMsQ0FBRCxDQUFJLFNBQWhDO0FBQ0EsWUFBSSxTQUFTLEdBQUcsRUFBaEI7QUFDQSxZQUFJLFFBQVEsR0FBRyxFQUFmOztBQUNBLFlBQUksVUFBVSxDQUFDLENBQUQsQ0FBVixLQUFrQixLQUF0QixFQUE2QjtBQUN6QixjQUFJLGFBQWEsR0FBRyxFQUFwQjs7QUFDQSxrQkFBUSxVQUFVLENBQUMsQ0FBRCxDQUFsQjtBQUNJLGlCQUFLLE9BQUw7QUFDSSxjQUFBLGFBQWEsR0FBRyxzQkFBYSxjQUFiLEVBQWhCO0FBQ0E7O0FBQ0osaUJBQUssTUFBTDtBQUNJLGNBQUEsYUFBYSxHQUFHLGVBQVksY0FBWixFQUFoQjtBQUNBOztBQUNKLGlCQUFLLE1BQUw7QUFDSSxjQUFBLGFBQWEsR0FBRyxjQUFZLFFBQVosRUFBaEI7QUFDQTs7QUFDSixpQkFBSyxTQUFMO0FBQ0ksY0FBQSxhQUFhLEdBQUcsaUJBQWMsZ0JBQWQsRUFBaEI7QUFDQTtBQVpSOztBQWNBLFVBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIscUJBQXZCLEVBQThDLFNBQTlDLEdBQTBELGFBQTFEO0FBQ0gsU0FqQkQsTUFpQk8sSUFBSSxVQUFVLENBQUMsQ0FBRCxDQUFWLEtBQWtCLFFBQXRCLEVBQWdDO0FBQ25DO0FBQ0Esa0JBQVEsVUFBVSxDQUFDLENBQUQsQ0FBbEI7QUFDSSxpQkFBSyxRQUFMO0FBQ0ksY0FBQSxTQUFTLEdBQUcsc0JBQWEsaUJBQWIsRUFBWjtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxlQUFZLGdCQUFaLEVBQVo7QUFDQTs7QUFDSixpQkFBSyxPQUFMO0FBQ0ksY0FBQSxTQUFTLEdBQUcsY0FBWSxpQkFBWixFQUFaO0FBQ0E7O0FBQ0osaUJBQUssVUFBTDtBQUNJLGNBQUEsU0FBUyxHQUFHLGlCQUFjLG1CQUFkLEVBQVo7QUFDQTtBQVpSLFdBRm1DLENBZ0JuQzs7O0FBQ0EsOEJBQVcsSUFBWCxDQUFnQixVQUFVLENBQUMsQ0FBRCxDQUExQixFQUErQixTQUEvQixFQUNBO0FBREEsV0FFQyxJQUZELENBR0ksV0FBVyxJQUFJO0FBQ1gsZ0JBQUksYUFBYSxHQUFHLEVBQXBCOztBQUNBLG9CQUFRLFVBQVUsQ0FBQyxDQUFELENBQWxCO0FBQ0ksbUJBQUssUUFBTDtBQUNJLGdCQUFBLGFBQWEsSUFBSSxzQkFBYSxlQUFiLENBQTZCLFdBQTdCLENBQWpCO0FBQ0E7O0FBQ0osbUJBQUssT0FBTDtBQUNJLGdCQUFBLGFBQWEsSUFBSSxlQUFZLGNBQVosQ0FBMkIsV0FBM0IsQ0FBakI7QUFDQTs7QUFDSixtQkFBSyxPQUFMO0FBQ0ksZ0JBQUEsYUFBYSxJQUFJLGNBQVksVUFBWixDQUF1QixXQUF2QixDQUFqQjtBQUNBOztBQUNKLG1CQUFLLFVBQUw7QUFDSSxnQkFBQSxhQUFhLElBQUksaUJBQWMsaUJBQWQsQ0FBZ0MsV0FBaEMsQ0FBakI7QUFDQTtBQVpSLGFBRlcsQ0FnQlg7OztBQUNBLHFDQUFXLGFBQVgsRUFBMEIsS0FBMUI7QUFDSCxXQXJCTDtBQXNCSCxTQXZDTSxNQXVDQSxJQUFJLFVBQVUsQ0FBQyxDQUFELENBQVYsS0FBa0IsTUFBdEIsRUFBOEI7QUFDakM7QUFDQSxrQkFBUSxVQUFVLENBQUMsQ0FBRCxDQUFsQjtBQUNJLGlCQUFLLFFBQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxzQkFBYSxpQkFBYixFQUFaO0FBQ0EsY0FBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBWDtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxlQUFZLGdCQUFaLEVBQVo7QUFDQSxjQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUFYO0FBQ0E7O0FBQ0osaUJBQUssT0FBTDtBQUNJLGNBQUEsU0FBUyxHQUFHLGNBQVksaUJBQVosRUFBWjtBQUNBLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLENBQVg7QUFDQTs7QUFDSixpQkFBSyxVQUFMO0FBQ0ksY0FBQSxTQUFTLEdBQUcsaUJBQWMsbUJBQWQsRUFBWjtBQUNBLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQVg7QUFDQTtBQWhCUixXQUZpQyxDQW9CakM7QUFDQTs7O0FBQ0EsOEJBQVcsR0FBWCxDQUFlLFVBQVUsQ0FBQyxDQUFELENBQXpCLEVBQThCLFFBQTlCLEVBQXdDLFNBQXhDLEVBQ0E7QUFEQSxXQUVDLElBRkQsQ0FHSSxXQUFXLElBQUk7QUFDWCxnQkFBSSxhQUFhLEdBQUcsRUFBcEI7QUFDQSxZQUFBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLE9BQU8sSUFBSTtBQUMzQixzQkFBUSxVQUFVLENBQUMsQ0FBRCxDQUFsQjtBQUNJLHFCQUFLLFFBQUw7QUFDSSxrQkFBQSxhQUFhLElBQUksc0JBQWEsZUFBYixDQUE2QixPQUE3QixDQUFqQjtBQUNBOztBQUNKLHFCQUFLLE9BQUw7QUFDSSxrQkFBQSxhQUFhLElBQUksZUFBWSxjQUFaLENBQTJCLE9BQTNCLENBQWpCO0FBQ0E7O0FBQ0oscUJBQUssT0FBTDtBQUNJLGtCQUFBLGFBQWEsSUFBSSxjQUFZLFVBQVosQ0FBdUIsT0FBdkIsQ0FBakI7QUFDQTs7QUFDSixxQkFBSyxVQUFMO0FBQ0ksa0JBQUEsYUFBYSxJQUFJLGlCQUFjLGlCQUFkLENBQWdDLE9BQWhDLENBQWpCO0FBQ0E7QUFaUjtBQWNILGFBZkQsRUFGVyxDQWtCWDs7QUFDQSxxQ0FBVyxhQUFYLEVBQTBCLEtBQTFCO0FBQ0gsV0F2Qkw7QUF5QkgsU0EvQ00sTUErQ0EsSUFBSSxVQUFVLENBQUMsQ0FBRCxDQUFWLEtBQWtCLFFBQXRCLEVBQWdDO0FBQ25DO0FBQ0Esa0JBQVEsVUFBVSxDQUFDLENBQUQsQ0FBbEI7QUFDSSxpQkFBSyxRQUFMO0FBQ0ksY0FBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBWDtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUFYO0FBQ0E7O0FBQ0osaUJBQUssT0FBTDtBQUNJLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLENBQVg7QUFDQTs7QUFDSixpQkFBSyxVQUFMO0FBQ0ksY0FBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBWDtBQUNBO0FBWlI7O0FBY0EsOEJBQVcsTUFBWCxDQUFrQixVQUFVLENBQUMsQ0FBRCxDQUE1QixFQUFpQyxPQUFqQyxFQUNBO0FBREEsV0FFQyxJQUZELENBR0ksTUFBTTtBQUNGLGdDQUFXLFdBQVgsQ0FBdUIsVUFBVSxDQUFDLENBQUQsQ0FBakMsRUFBc0MsQ0FBdEMsRUFDQTtBQURBLGFBRUMsSUFGRCxDQUdJLFdBQVcsSUFBSTtBQUNYLGtCQUFJLGFBQWEsR0FBRyxFQUFwQjtBQUNBLGNBQUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsT0FBTyxJQUFJO0FBQzNCLHdCQUFRLFVBQVUsQ0FBQyxDQUFELENBQWxCO0FBQ0ksdUJBQUssUUFBTDtBQUNJLG9CQUFBLGFBQWEsSUFBSSxzQkFBYSxlQUFiLENBQTZCLE9BQTdCLENBQWpCO0FBQ0E7O0FBQ0osdUJBQUssT0FBTDtBQUNJLG9CQUFBLGFBQWEsSUFBSSxlQUFZLGNBQVosQ0FBMkIsT0FBM0IsQ0FBakI7QUFDQTs7QUFDSix1QkFBSyxPQUFMO0FBQ0ksb0JBQUEsYUFBYSxJQUFJLGNBQVksVUFBWixDQUF1QixPQUF2QixDQUFqQjtBQUNBOztBQUNKLHVCQUFLLFVBQUw7QUFDSSxvQkFBQSxhQUFhLElBQUksaUJBQWMsaUJBQWQsQ0FBZ0MsT0FBaEMsQ0FBakI7QUFDQTtBQVpSO0FBY0YsZUFmRixFQUZXLENBa0JYOztBQUNBLHVDQUFXLGFBQVgsRUFBMEIsS0FBMUI7QUFDSCxhQXZCTDtBQXlCSCxXQTdCTDtBQStCSDtBQUNKO0FBQ0osS0E5SkQ7QUErSkg7QUFqS2dCLENBQXJCO2VBb0tlLFk7Ozs7Ozs7Ozs7O0FDM0tmOzs7O0FBTEE7Ozs7QUFPQSxNQUFNLFlBQVksR0FBRztBQUNqQixFQUFBLGNBQWMsRUFBRSxPQUFPLElBQUk7QUFDdkIsV0FBUTt5REFDeUMsT0FBUTs7Ozs7Ozs7Ozs7Ozs7Z0JBRHpEO0FBZ0JILEdBbEJnQjtBQW1CakIsRUFBQSxpQkFBaUIsRUFBRSxPQUFPLElBQUk7QUFDMUIsUUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsRUFBcUMsS0FBaEQ7QUFDQSxRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxLQUFoRDtBQUNBLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixFQUF5QyxLQUF4RCxDQUgwQixDQUkxQjs7QUFDQSxVQUFNLE1BQU0sR0FBRyxDQUFmLENBTDBCLENBTTFCOztBQUVBLFVBQU0sV0FBVyxHQUFHO0FBQ2hCLE1BQUEsSUFBSSxFQUFFLElBRFU7QUFFaEIsTUFBQSxJQUFJLEVBQUUsSUFGVTtBQUdoQixNQUFBLFFBQVEsRUFBRSxRQUhNO0FBSWhCLE1BQUEsTUFBTSxFQUFFO0FBSlEsS0FBcEI7QUFPQSxXQUFPLFdBQVAsQ0FmMEIsQ0FnQjFCO0FBRUE7QUFFQTtBQUNILEdBeENnQjtBQXlDakIsRUFBQSxlQUFlLEVBQUUsQ0FBQyxXQUFELEVBQWMsTUFBZCxLQUF5QjtBQUN0QyxRQUFJLElBQUksR0FBRyw4QkFBYyxXQUFXLENBQUMsSUFBMUIsQ0FBWDtBQUNBLFFBQUksUUFBUSxHQUFLLHNDQUFxQyxXQUFXLENBQUMsRUFBRztpQ0FDNUMsV0FBVyxDQUFDLElBQUs7YUFDckMsSUFBSzthQUNMLFdBQVcsQ0FBQyxRQUFTO21CQUgxQjs7QUFNQSxRQUFJLFdBQVcsQ0FBQyxNQUFaLEtBQXVCLE1BQTNCLEVBQW1DO0FBQy9CLE1BQUEsUUFBUSxJQUFLOzRDQUNtQixXQUFXLENBQUMsRUFBRzs4Q0FDYixXQUFXLENBQUMsRUFBRzthQUZqRDtBQUlIOztBQUVELElBQUEsUUFBUSxJQUFJLE9BQVo7QUFFQSxXQUFPLFFBQVA7QUFDSDtBQTNEZ0IsQ0FBckI7ZUE4RGUsWTs7Ozs7O0FDckVmOztBQU1BOzs7O0FBSkE7QUFFQTtBQUlBOztBQUVBLHdCQUFVLFFBQVY7Ozs7Ozs7Ozs7QUNWQSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUQsRUFBTyxLQUFQLEtBQWlCO0FBQ2hDLEVBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBd0IsR0FBRSxLQUFNLEVBQWhDLEVBQW1DLFNBQW5DLElBQWdELElBQWhEO0FBQ0gsQ0FGRDs7ZUFLZSxVOzs7Ozs7Ozs7OztBQ0xmOzs7O0FBRUEsTUFBTSxXQUFXLEdBQUc7QUFDaEIsRUFBQSxVQUFVLEVBQUUsVUFBVSxVQUFWLEVBQXNCLE1BQXRCLEVBQThCO0FBQ3RDLFVBQU0sYUFBYSxHQUFHLDhCQUFjLFVBQVUsQ0FBQyxlQUF6QixDQUF0QjtBQUNBLFFBQUksUUFBUSxHQUFJOytDQUN1QixVQUFVLENBQUMsRUFBRztvQ0FDekIsVUFBVSxDQUFDLElBQUs7c0NBQ2QsYUFBYzswREFDTSxVQUFVLENBQUMsV0FBWTtTQUp6RTs7QUFPQSxRQUFJLFVBQVUsQ0FBQyxNQUFYLEtBQXNCLE1BQTFCLEVBQWtDO0FBQzlCLE1BQUEsUUFBUSxJQUFLOzJDQUNrQixVQUFVLENBQUMsRUFBRzs2Q0FDWixVQUFVLENBQUMsRUFBRzthQUYvQztBQUlIOztBQUVELElBQUEsUUFBUSxJQUFJLGlCQUFaO0FBRUEsV0FBTyxRQUFQO0FBQ0gsR0FwQmU7QUFxQmhCLEVBQUEsUUFBUSxFQUFFLFVBQVUsUUFBVixFQUFvQjtBQUMxQixXQUFROztzREFFc0MsUUFBUzs7Ozs7Ozs7Ozs7Ozs7U0FGdkQ7QUFpQkgsR0F2Q2U7QUF3Q2hCLEVBQUEsaUJBQWlCLEVBQUUsWUFBWTtBQUMzQixVQUFNLFVBQVUsR0FBRztBQUNmLE1BQUEsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLEVBQW9DLEtBRDNCO0FBRWYsTUFBQSxlQUFlLEVBQUUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkIsRUFBb0MsS0FGdEM7QUFHZixNQUFBLFdBQVcsRUFBRSxRQUFRLENBQUMsYUFBVCxDQUF1QixlQUF2QixFQUF3QyxLQUh0QztBQUlmO0FBQ0EsTUFBQSxNQUFNLEVBQUU7QUFMTyxLQUFuQjtBQU9BLFdBQU8sVUFBUDtBQUNIO0FBakRlLENBQXBCO2VBb0RlLFc7Ozs7Ozs7Ozs7O0FDdERmLFNBQVMsYUFBVCxDQUF3QixTQUF4QixFQUFtQztBQUMvQixNQUFJLENBQUMsR0FBRyxJQUFJLElBQUosQ0FBUyxRQUFRLENBQUMsU0FBRCxDQUFqQixDQUFSO0FBQ0EsTUFBSSxNQUFNLEdBQUcsQ0FBQyxLQUFELEVBQU8sS0FBUCxFQUFhLEtBQWIsRUFBbUIsS0FBbkIsRUFBeUIsS0FBekIsRUFBK0IsS0FBL0IsRUFBcUMsS0FBckMsRUFBMkMsS0FBM0MsRUFBaUQsS0FBakQsRUFBdUQsS0FBdkQsRUFBNkQsS0FBN0QsRUFBbUUsS0FBbkUsQ0FBYjtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFGLEVBQVg7QUFDQSxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQUYsRUFBRCxDQUFsQjtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFGLEVBQVg7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBRixFQUFYO0FBQ0EsTUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQUYsRUFBVjtBQUNBLE1BQUksSUFBSSxHQUFHLElBQUksR0FBRyxHQUFQLEdBQWEsS0FBYixHQUFxQixHQUFyQixHQUEyQixJQUEzQixHQUFrQyxHQUFsQyxHQUF3QyxJQUF4QyxHQUErQyxHQUEvQyxHQUFxRCxHQUFoRTtBQUNBLFNBQU8sSUFBUDtBQUNEOztBQUFBO2VBRWMsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxyXG5jb25zdCBBUElNYW5hZ2VyID0ge1xyXG4gICAgZ2V0QnlVc2VySWQ6IChkZXNpcmVkRGF0YWJhc2UsIHVzZXJJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmZXRjaCAoYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0/X3VzZXJJZD0ke3VzZXJJZH1gKVxyXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuXHJcbiAgICB9LFxyXG4gICAgZGVsZXRlOiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovLzEyNy4wLjAuMTo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxyXG4gICAgICAgIH0pXHJcbiAgIH0sXHJcbiAgIFBvc3Q6IChkZXNpcmVkRGF0YWJhc2UsIG9iamVjdFRvUG9zdCkgPT4ge1xyXG4gICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9YCwge1xyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9Qb3N0KVxyXG4gICAgfSlcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgfSxcclxuICAgIFB1dDooZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCwgZWRpdGVkT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9LyR7b2JqZWN0SWR9YCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVkaXRlZE9iamVjdClcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgfSxcclxuICAgIGZldGNoV2l0aEV4cGFuZGVkVXNlckluZm86IChkZXNpcmVkRGF0YWJhc2UsIHVzZXJJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmZXRjaCAoYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0/X2V4cGFuZD11c2VyJnVzZXJJZD0ke3VzZXJJZH1gKVxyXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFQSU1hbmFnZXIiLCJjb25zdCBhcnRpY2xlTW9kdWxlID0ge1xyXG4gICAgYnVpbGRBcnRpY2xlRm9ybTogKGFydGljbGVJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJhcnRpY2xlRm9ybVwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJhcnRpY2xlSWRcIiB2YWx1ZT1cIiR7YXJ0aWNsZUlkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlVGl0bGVcIj5BcnRpY2xlIFRpdGxlOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVRpdGxlXCIgaWQ9XCJhcnRpY2xlVGl0bGVcIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVN1bW1hcnlcIj5BcnRpY2xlIFN1bW1hcnk6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlU3VtbWFyeVwiIGlkPVwiYXJ0aWNsZVN1bW1hcnlcIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVVSTFwiPkFydGljbGUgVVJMOjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVVSTFwiIGlkPVwiYXJ0aWNsZVVSTFwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tY3JlYXRlXCI+UG9zdCBZb3VyIEFydGljbGU8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+YFxyXG4gICAgfSxcclxuICAgIGNyZWF0ZUFydGljbGVPYmplY3Q6ICgpID0+IHtcclxuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVUaXRsZVwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgc3VtbWFyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVN1bW1hcnlcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IHVybCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVVSTFwiKS52YWx1ZTtcclxuICAgICAgICAvLyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XHJcbiAgICAgICAgY29uc3QgdXNlcklkID0gMTtcclxuICAgICAgICAvLyBsZXQgYXJ0aWNsZUlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIikudmFsdWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgc3VtbWFyeTogc3VtbWFyeSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnRpY2xlT2JqZWN0XHJcblxyXG4gICAgfSxcclxuICAgIGNyZWF0ZUFydGljbGVIVE1MOiAoYXJ0aWNsZU9iamVjdCwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYDxzZWN0aW9uIGNsYXNzPVwiYXJ0aWNsZXNcIiBpZD1cImFydGljbGUtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYXJ0aWNsZVRpdGxlXCI+JHthcnRpY2xlT2JqZWN0LnRpdGxlfTwvZGl2PlxyXG4gICAgICAgIDxwPiR7YXJ0aWNsZU9iamVjdC5zdW1tYXJ5fTwvcD5cclxuICAgICAgICA8cD48YSBocmVmPVwiaHR0cDovLyR7YXJ0aWNsZU9iamVjdC51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcnRpY2xlT2JqZWN0LnVybH08L2E+PC9wPlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKGFydGljbGVPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1lZGl0LS0ke2FydGljbGVPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1kZWxldGUtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L3NlY3Rpb24+PGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH0sXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFydGljbGVNb2R1bGUiLCJpbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcclxuXHJcbmNvbnN0IGNoYXRzTW9kdWxlID0ge1xyXG4gICAgYnVpbGRDaGF0c0Zvcm06IChjaGF0SWQpID0+IHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdHNGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjaGF0SWRcIiB2YWx1ZT1cIiR7Y2hhdElkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgICAgICBFbnRlciB5b3VyIG1lc3NhZ2U6PC9icj5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiNFwiIGNvbHM9XCI1MFwiIG5hbWU9XCJjaGF0TWVzc2FnZVwiIGlkPVwiY2hhdC0tdGV4dElucHV0XCI+PC90ZXh0YXJlYT48L2JyPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1jcmVhdGVcIj5TdWJtaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYFxyXG4gICAgfSxcclxuICAgIGJ1aWxkQ2hhdHNPYmplY3Q6ICgpID0+IHtcclxuICAgICAgICBjb25zdCBjaGF0c09iamVjdCA9IHt9XHJcbiAgICAgICAgY2hhdHNPYmplY3QudGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhdC0tdGV4dElucHV0XCIpLnZhbHVlXHJcbiAgICAgICAgY2hhdHNPYmplY3QudGltZXN0YW1wID0gRGF0ZS5ub3coKVxyXG4gICAgICAgIC8vIGNoYXRzT2JqZWN0LnVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKVxyXG4gICAgICAgIGNoYXRzT2JqZWN0LnVzZXJJZCA9IDE7XHJcbiAgICAgICAgcmV0dXJuIGNoYXRzT2JqZWN0XHJcbiAgICB9LFxyXG4gICAgYnVpbGRDaGF0c0hUTUw6IChjaGF0T2JqZWN0LCB1c2VySWQpID0+IHtcclxuICAgICAgICBjb25zdCBjaGF0VGltZXN0YW1wID0gdGltZUNvbnZlcnRlcihjaGF0T2JqZWN0LnRpbWVzdGFtcClcclxuXHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdHNcIiBpZD1cImNoYXQtLSR7Y2hhdE9iamVjdC5pZH1cIlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjaGF0VGV4dENvbnRlbnRcIj4ke2NoYXRPYmplY3QudGV4dH08L3A+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNoYXRTdWJUZXh0XCI+UG9zdGVkIGJ5ICR7Y2hhdE9iamVjdC51c2VyLnVzZXJuYW1lfSBvbiAke2NoYXRUaW1lc3RhbXB9PC9wPlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKGNoYXRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1lZGl0LS0ke2NoYXRPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1kZWxldGUtLSR7Y2hhdE9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L2Rpdj48aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjaGF0c01vZHVsZSIsImltcG9ydCBBUElNYW5hZ2VyIGZyb20gXCIuL0FQSU1hbmFnZXJcIlxyXG5pbXBvcnQgcHJpbnRUb0RPTSBmcm9tIFwiLi9wcmludFRvRE9NXCI7XHJcbmltcG9ydCBjaGF0c01vZHVsZSBmcm9tIFwiLi9jaGF0c1wiO1xyXG5pbXBvcnQgYXJ0aWNsZU1vZHVsZSBmcm9tIFwiLi9hcnRpY2xlXCJcclxuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIlxyXG5pbXBvcnQgdGFza3NNb2R1bGUgZnJvbSBcIi4vdGFza1wiXHJcblxyXG5jb25zdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgPSAoKSA9PiB7XHJcbiAgICAvLyBORUVEIFRPIEJFIENIQU5HRUQgVE8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xyXG4gICAgY29uc3QgdXNlcklkID0gMVxyXG4gICAgLy9cclxuICAgIGNvbnN0IGNoYXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXREaXNwbGF5XCIpXHJcbiAgICBjb25zdCBhcnRpY2xlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpY2xlRGlzcGxheVwiKVxyXG4gICAgY29uc3QgZXZlbnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW50RGlzcGxheVwiKVxyXG4gICAgY29uc3QgdGFza0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFza0Rpc3BsYXlcIilcclxuICAgIGNvbnN0IGZyaWVuZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJpZW5kRGlzcGxheVwiKVxyXG4gICAgY2hhdENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBhcnRpY2xlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIGV2ZW50Q29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIHRhc2tDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgZnJpZW5kQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImNoYXRzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihjaGF0cykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudE1lc3NhZ2UgPSBjaGF0c1tpXVxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlSFRNTCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGN1cnJlbnRNZXNzYWdlLCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00obWVzc2FnZUhUTUwsIFwiI1wiICsgY2hhdENvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiYXJ0aWNsZXNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGFydGljbGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QXJ0aWNsZSA9IGFydGljbGVzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IGFydGljbGVIVE1MID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChjdXJyZW50QXJ0aWNsZSwgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKGFydGljbGVIVE1MLCBcIiNcIiArIGFydGljbGVDb250YWluZXIuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImV2ZW50c1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oZXZlbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEV2ZW50ID0gZXZlbnRzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50SFRNTCA9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoY3VycmVudEV2ZW50LCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00oZXZlbnRIVE1MLCBcIiNcIiArIGV2ZW50Q29udGFpbmVyLmlkKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJ0YXNrc1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24odGFza3MpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrID0gdGFza3NbaV1cclxuICAgICAgICAgICAgY29uc3QgdGFza0hUTUwgPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGN1cnJlbnRUYXNrLCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00odGFza0hUTUwsIFwiI1wiICsgdGFza0NvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwiLCIvKlxyXG5BdXRob3I6IFBhbnlhXHJcblRhc2s6IGxpc3RlbiB0byB0aGUgYm9keSBvZiB0aGUgcGFnZSBmb3IgY2xpY2tzLCBhbmQgY2FsbCBvdGhlciBtZXRob2RzIGJhc2VkIG9uIHRoZSB0YXJnZXQgb2YgdGhlIGNsaWNrXHJcbiovXHJcblxyXG5pbXBvcnQgQVBJTWFuYWdlciBmcm9tIFwiLi9BUElNYW5hZ2VyXCI7XHJcbmltcG9ydCBwcmludFRvRE9NIGZyb20gXCIuL3ByaW50VG9ET01cIjtcclxuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIjtcclxuaW1wb3J0IGNoYXRzTW9kdWxlIGZyb20gXCIuL2NoYXRzXCI7XHJcbmltcG9ydCB0YXNrc01vZHVsZSBmcm9tIFwiLi90YXNrXCI7XHJcbmltcG9ydCBhcnRpY2xlTW9kdWxlIGZyb20gXCIuL2FydGljbGVcIjtcclxuXHJcbmNvbnN0IGNsaWNrQnViYmxlciA9IHtcclxuICAgIGxpc3RlbmVyOiAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXNoYm9hcmRDb250YWluZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJCVVRUT05cIikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0TGlzdCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2hlcmUgPSBgIyR7dGFyZ2V0TGlzdFswXX1EaXNwbGF5YDtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRJZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJhZGRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IGV2ZW50c01vZHVsZS5idWlsZEVudHJ5Rm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNGb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFzayc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gdGFza3NNb2R1bGUudGFza0Zvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBhcnRpY2xlTW9kdWxlLmJ1aWxkQXJ0aWNsZUZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rhc2hib2FyZENvbnRhaW5lclwiKS5pbm5lckhUTUwgPSBuZXdIVE1Mc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImNyZWF0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgY29ycmVjdCBvYmplY3QgZmFjdG9yeSBiYXNlZCBvbiB0YXJnZXRMaXN0WzBdLCB3aGljaCBzaG91bGQgY29udGFpbiB0aGUgbW9kdWxlIG5hbWUgKGkuZS4gJ2V2ZW50cycpXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gdGFza3NNb2R1bGUuY2FwdHVyZUZvcm1WYWx1ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGNhbGwgdGhlIGFwaSBjcmVhdGUgbWV0aG9kIGFuZCBwYXNzIGl0IHRoZSBuZXcgb2JqZWN0IGFuZCB0aGUgbW9kdWxlIG5hbWVcclxuICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLlBvc3QodGFyZ2V0TGlzdFswXSwgbmV3T2JqZWN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKG9iamVjdEFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKG9iamVjdEFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwob2JqZWN0QXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChvYmplY3RBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiZWRpdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgY29ycmVjdCBvYmplY3QgZmFjdG9yeSBiYXNlZCBvbiB0YXJnZXRMaXN0WzBdLCB3aGljaCBzaG91bGQgY29udGFpbiB0aGUgbW9kdWxlIG5hbWUgKGkuZS4gJ2V2ZW50cycpXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0SWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gdGFza3NNb2R1bGUuY2FwdHVyZUZvcm1WYWx1ZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvYmplY3RJZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgZWRpdCBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG5ldyBvYmplY3QsIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcclxuICAgICAgICAgICAgICAgICAgICAvL2Rlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQsIGVkaXRlZE9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuUHV0KHRhcmdldExpc3RbMF0sIHRhcmdldElkLCBuZXdPYmplY3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiZGVsZXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBhcGkgZGVsZXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbW9kdWxlIG5hbWUgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0SWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29iamVjdElkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5kZWxldGUodGFyZ2V0TGlzdFswXSwgZXZlbnRJZClcclxuICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBhcGkgbGlzdCBtZXRob2QsIHBhc3NpbmcgaXQgdGhlIGNvcnJlY3QgbW9kdWxlIGFuZCB1c2VyaWRcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5nZXRCeVVzZXJJZCh0YXJnZXRMaXN0WzBdLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVIVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHByaW50VG9Eb20oKSBhbmQgcGFzcyBpdCB0aGUgbmV3IEhUTUwgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsaWNrQnViYmxlcjsiLCIvKlxyXG5BdXRob3I6IFBhbnlhXHJcblRhc2s6IGhhbmRsZXMgYWxsIGZ1bmN0aW9ucyBzcGVjaWZpYyB0byB0aGUgZXZlbnRzIGxpc3RpbmcgaW4gTnV0c2hlbGxcclxuKi9cclxuXHJcbmltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xyXG5cclxuY29uc3QgZXZlbnRzTW9kdWxlID0ge1xyXG4gICAgYnVpbGRFbnRyeUZvcm06IGV2ZW50SWQgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJldmVudEZvcm1cIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZXZlbnRJZFwiIHZhbHVlPVwiJHtldmVudElkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudE5hbWVcIj5OYW1lIG9mIHRoZSBldmVudDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImV2ZW50TmFtZVwiIGlkPVwiZXZlbnROYW1lXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50RGF0ZVwiPkRhdGUgb2YgdGhlIGV2ZW50OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lXCIgbmFtZT1cImV2ZW50RGF0ZVwiIGlkPVwiZXZlbnREYXRlXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50TG9jYXRpb25cIj5Mb2NhdGlvbiBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJldmVudExvY2F0aW9uXCIgaWQ9XCJldmVudExvY2F0aW9uXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tY3JlYXRlXCI+Q3JlYXRlIE5ldyBFdmVudDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5gO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUV2ZW50T2JqZWN0OiBldmVudElkID0+IHtcclxuICAgICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnROYW1lXCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudERhdGVcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudExvY2F0aW9uXCIpLnZhbHVlO1xyXG4gICAgICAgIC8vIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcclxuICAgICAgICBjb25zdCB1c2VySWQgPSAxO1xyXG4gICAgICAgIC8vIGV2ZW50SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIikudmFsdWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50T2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICBkYXRlOiBkYXRlLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXZlbnRPYmplY3Q7XHJcbiAgICAgICAgLy8gaWYgKGV2ZW50SWQgIT09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZUV2ZW50SFRNTDogKGV2ZW50T2JqZWN0LCB1c2VySWQpID0+IHtcclxuICAgICAgICBsZXQgdGltZSA9IHRpbWVDb252ZXJ0ZXIoZXZlbnRPYmplY3QuZGF0ZSlcclxuICAgICAgICBsZXQgYmFzZUhUTUwgPSAgYDxzZWN0aW9uIGNsYXNzPVwiZXZlbnRzXCIgaWQ9XCJldmVudC0tJHtldmVudE9iamVjdC5pZH1cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnROYW1lXCI+JHtldmVudE9iamVjdC5uYW1lfTwvZGl2PlxyXG4gICAgICAgIDxwPiR7dGltZX08L3A+XHJcbiAgICAgICAgPHA+JHtldmVudE9iamVjdC5sb2NhdGlvbn08L3A+XHJcbiAgICAgICAgPC9zZWN0aW9uPmA7XHJcblxyXG4gICAgICAgIGlmIChldmVudE9iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xyXG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1lZGl0LS0ke2V2ZW50T2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJldmVudHMtLWRlbGV0ZS0tJHtldmVudE9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfSxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzTW9kdWxlOyIsImltcG9ydCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgZnJvbSBcIi4vZGFzaGJvYXJkUmVmcmVzaGlvbmFsXCI7XHJcblxyXG4vLyBpbXBvcnQgZXZlbnQgbGlzdGVuZXJzIG1vZHVsZSBmcm9tIFwiLi9ldmVudGxpc3RlbmVyc1wiXHJcblxyXG4vLyBoZWxsbyB3b3JsZFxyXG5cclxuaW1wb3J0IGxpc3RlbmVycyBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiO1xyXG5cclxuZGFzaGJvYXJkUmVmcmVzaGlvbmFsKClcclxuXHJcbmxpc3RlbmVycy5saXN0ZW5lcigpO1xyXG4iLCJjb25zdCBwcmludFRvRE9NID0gKHdoYXQsIHdoZXJlKSA9PiB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3doZXJlfWApLmlubmVySFRNTCArPSB3aGF0XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcmludFRvRE9NO1xyXG4iLCJpbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcclxuXHJcbmNvbnN0IHRhc2tzTW9kdWxlID0ge1xyXG4gICAgdGFza1RvSFRNTDogZnVuY3Rpb24gKHRhc2tPYmplY3QsIHVzZXJJZCkge1xyXG4gICAgICAgIGNvbnN0IHRhc2tUaW1lc3RhbXAgPSB0aW1lQ29udmVydGVyKHRhc2tPYmplY3QuY29tcGxldGlvbl9kYXRlKVxyXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGBcclxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ0YXNrc1wiIGlkPVwidGFzay0tJHt0YXNrT2JqZWN0LmlkfT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2tOYW1lXCI+JHt0YXNrT2JqZWN0Lm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgIDxwIGlkPVwiY29tcGxldGlvbl9kYXRlXCI+JHt0YXNrVGltZXN0YW1wfTwvcD5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlzX2NvbXBsZXRlXCIgaWQ9XCJ0YXNrX2NvbXBsZXRlXCI+JHt0YXNrT2JqZWN0LmlzX2NvbXBsZXRlfTwvbGFiZWw+XHJcbiAgICAgICAgYFxyXG5cclxuICAgICAgICBpZiAodGFza09iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xyXG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWVkaXQtLSR7dGFza09iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWRlbGV0ZS0tJHt0YXNrT2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvc2VjdGlvbj48aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfSxcclxuICAgIHRhc2tGb3JtOiBmdW5jdGlvbiAob2JqZWN0SWQpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInVzZXJJZFwiIHZhbHVlPVwiJHtvYmplY3RJZH1cIj48YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZSBvZiB0YXNrOiA8L2xhYmVsPjxicj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUYXNrIG5hbWVcIiBpZD1cInRhc2tOYW1lXCI+XHJcbiAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNvbXBsZXRpb25fZGF0ZVwiPkRhdGUgdG8gYmUgY29tcGxldGVkIGJ5OiA8L2xhYmVsPjxicj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJ0YXNrRGF0ZVwiPlxyXG4gICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgPGxhYmVsPklzIHRhc2sgY29tcGxldGU6IDwvbGFiZWw+PGJyPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ0YXNrQ29tcGxldGVcIiB2YWx1ZT1cIlllc1wiPlllczxicj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidGFza0NvbXBsZXRlXCIgdmFsdWU9XCJOb1wiPk5vPGJyPlxyXG4gICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWNyZWF0ZVwiPlN1Ym1pdDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgYFxyXG4gICAgfSxcclxuICAgIGNhcHR1cmVGb3JtVmFsdWVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgdGFza09iamVjdCA9IHtcclxuICAgICAgICAgICAgbmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrTmFtZVwiKS52YWx1ZSxcclxuICAgICAgICAgICAgY29tcGxldGlvbl9kYXRlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2tEYXRlXCIpLnZhbHVlLFxyXG4gICAgICAgICAgICBpc19jb21wbGV0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrQ29tcGxldGVcIikudmFsdWUsXHJcbiAgICAgICAgICAgIC8vdXNlcklkOiBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKVxyXG4gICAgICAgICAgICB1c2VySWQ6IDFcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRhc2tPYmplY3RcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgdGFza3NNb2R1bGUiLCJmdW5jdGlvbiB0aW1lQ29udmVydGVyICh0aW1lc3RhbXApIHtcclxuICAgIHZhciBhID0gbmV3IERhdGUocGFyc2VJbnQodGltZXN0YW1wKSk7XHJcbiAgICB2YXIgbW9udGhzID0gWydKYW4nLCdGZWInLCdNYXInLCdBcHInLCdNYXknLCdKdW4nLCdKdWwnLCdBdWcnLCdTZXAnLCdPY3QnLCdOb3YnLCdEZWMnXTtcclxuICAgIHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG4gICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XHJcbiAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgdmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcbiAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XHJcbiAgICB2YXIgdGltZSA9IGRhdGUgKyAnICcgKyBtb250aCArICcgJyArIHllYXIgKyAnICcgKyBob3VyICsgJzonICsgbWluO1xyXG4gICAgcmV0dXJuIHRpbWU7XHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQgdGltZUNvbnZlcnRlcjsiXX0=
