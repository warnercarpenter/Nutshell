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
    console.log(articleObject.url);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3Rhc2suanMiLCIuLi9zY3JpcHRzL3RpbWVzdGFtcHBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0NBLE1BQU0sVUFBVSxHQUFHO0FBQ2YsRUFBQSxXQUFXLEVBQUUsQ0FBQyxlQUFELEVBQWtCLE1BQWxCLEtBQTZCO0FBQ3RDLFdBQU8sS0FBSyxDQUFHLHlCQUF3QixlQUFnQixZQUFXLE1BQU8sRUFBN0QsQ0FBTCxDQUNGLElBREUsQ0FDRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEVixDQUFQO0FBR0gsR0FMYztBQU1mLEVBQUEsTUFBTSxFQUFFLENBQUMsZUFBRCxFQUFrQixRQUFsQixLQUErQjtBQUNuQyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsSUFBRyxRQUFTLEVBQXRELEVBQXlEO0FBQzdELE1BQUEsTUFBTSxFQUFFO0FBRHFELEtBQXpELENBQVo7QUFHSixHQVZlO0FBV2hCLEVBQUEsSUFBSSxFQUFFLENBQUMsZUFBRCxFQUFrQixZQUFsQixLQUFtQztBQUN4QyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsRUFBMUMsRUFBNkM7QUFDckQsTUFBQSxNQUFNLEVBQUUsTUFENkM7QUFFckQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUY0QztBQUtyRCxNQUFBLElBQUksRUFBRSxJQUFJLENB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LE1BQUEsZUFBZSxFQUFFLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLEVBQW9DLEtBRnRDO0FBR2YsTUFBQSxXQUFXLEVBQUUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0MsS0FIdEM7QUFJZjtBQUNBLE1BQUEsTUFBTSxFQUFFO0FBTE8sS0FBbkI7QUFPQSxXQUFPLFVBQVA7QUFDSDtBQWpEZSxDQUFwQjtlQW9EZSxXOzs7Ozs7Ozs7OztBQ3REZixTQUFTLGFBQVQsQ0FBd0IsU0FBeEIsRUFBbUM7QUFDL0IsTUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFKLENBQVMsUUFBUSxDQUFDLFNBQUQsQ0FBakIsQ0FBUjtBQUNBLE1BQUksTUFBTSxHQUFHLENBQUMsS0FBRCxFQUFPLEtBQVAsRUFBYSxLQUFiLEVBQW1CLEtBQW5CLEVBQXlCLEtBQXpCLEVBQStCLEtBQS9CLEVBQXFDLEtBQXJDLEVBQTJDLEtBQTNDLEVBQWlELEtBQWpELEVBQXVELEtBQXZELEVBQTZELEtBQTdELEVBQW1FLEtBQW5FLENBQWI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsV0FBRixFQUFYO0FBQ0EsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFGLEVBQUQsQ0FBbEI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsT0FBRixFQUFYO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQUYsRUFBWDtBQUNBLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFGLEVBQVY7QUFDQSxNQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBUCxHQUFhLEtBQWIsR0FBcUIsR0FBckIsR0FBMkIsSUFBM0IsR0FBa0MsR0FBbEMsR0FBd0MsSUFBeEMsR0FBK0MsR0FBL0MsR0FBcUQsR0FBaEU7QUFDQSxTQUFPLElBQVA7QUFDRDs7QUFBQTtlQUVjLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuY29uc3QgQVBJTWFuYWdlciA9IHtcclxuICAgIGdldEJ5VXNlcklkOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P191c2VySWQ9JHt1c2VySWR9YClcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcblxyXG4gICAgfSxcclxuICAgIGRlbGV0ZTogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KVxyXG4gICB9LFxyXG4gICBQb3N0OiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RUb1Bvc3QpID0+IHtcclxuICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfWAsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9iamVjdFRvUG9zdClcclxuICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgIH0sXHJcbiAgICBQdXQ6KGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQsIGVkaXRlZE9iamVjdCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShlZGl0ZWRPYmplY3QpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgIH0sXHJcbiAgICBmZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P19leHBhbmQ9dXNlciZ1c2VySWQ9JHt1c2VySWR9YClcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBUElNYW5hZ2VyIiwiY29uc3QgYXJ0aWNsZU1vZHVsZSA9IHtcclxuICAgIGJ1aWxkQXJ0aWNsZUZvcm06IChhcnRpY2xlSWQpID0+IHtcclxuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiYXJ0aWNsZUZvcm1cIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiYXJ0aWNsZUlkXCIgdmFsdWU9XCIke2FydGljbGVJZH1cIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVRpdGxlXCI+QXJ0aWNsZSBUaXRsZTo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVUaXRsZVwiIGlkPVwiYXJ0aWNsZVRpdGxlXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVTdW1tYXJ5XCI+QXJ0aWNsZSBTdW1tYXJ5OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVN1bW1hcnlcIiBpZD1cImFydGljbGVTdW1tYXJ5XCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVVUkxcIj5BcnRpY2xlIFVSTDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVVUkxcIiBpZD1cImFydGljbGVVUkxcIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWNyZWF0ZVwiPlBvc3QgWW91ciBBcnRpY2xlPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPmBcclxuICAgIH0sXHJcbiAgICBjcmVhdGVBcnRpY2xlT2JqZWN0OiAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlVGl0bGVcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IHN1bW1hcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVTdW1tYXJ5XCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCB1cmwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVVUkxcIikudmFsdWU7XHJcbiAgICAgICAgLy8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xyXG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IDE7XHJcbiAgICAgICAgLy8gbGV0IGFydGljbGVJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBjb25zdCBhcnRpY2xlT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6IHN1bW1hcnksXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJ0aWNsZU9iamVjdFxyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVBcnRpY2xlSFRNTDogKGFydGljbGVPYmplY3QsIHVzZXJJZCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGFydGljbGVPYmplY3QudXJsKVxyXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGA8c2VjdGlvbiBjbGFzcz1cImFydGljbGVzXCIgaWQ9XCJhcnRpY2xlLS0ke2FydGljbGVPYmplY3QuaWR9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFydGljbGVUaXRsZVwiPiR7YXJ0aWNsZU9iamVjdC50aXRsZX08L2Rpdj5cclxuICAgICAgICA8cD4ke2FydGljbGVPYmplY3Quc3VtbWFyeX08L3A+XHJcbiAgICAgICAgPHA+PGEgaHJlZj1cImh0dHA6Ly8ke2FydGljbGVPYmplY3QudXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJ0aWNsZU9iamVjdC51cmx9PC9hPjwvcD5cclxuICAgICAgICBgXHJcblxyXG4gICAgICAgIGlmIChhcnRpY2xlT2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XHJcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tZWRpdC0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tZGVsZXRlLS0ke2FydGljbGVPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9zZWN0aW9uPjxoci8+XCJcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXHJcbiAgICB9LFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcnRpY2xlTW9kdWxlIiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XHJcblxyXG5jb25zdCBjaGF0c01vZHVsZSA9IHtcclxuICAgIGJ1aWxkQ2hhdHNGb3JtOiAoY2hhdElkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXRzRm9ybVwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY2hhdElkXCIgdmFsdWU9XCIke2NoYXRJZH1cIj48L2lucHV0PlxyXG4gICAgICAgICAgICAgICAgRW50ZXIgeW91ciBtZXNzYWdlOjwvYnI+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cIjRcIiBjb2xzPVwiNTBcIiBuYW1lPVwiY2hhdE1lc3NhZ2VcIiBpZD1cImNoYXQtLXRleHRJbnB1dFwiPjwvdGV4dGFyZWE+PC9icj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tY3JlYXRlXCI+U3VibWl0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGBcclxuICAgIH0sXHJcbiAgICBidWlsZENoYXRzT2JqZWN0OiAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2hhdHNPYmplY3QgPSB7fVxyXG4gICAgICAgIGNoYXRzT2JqZWN0LnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtLXRleHRJbnB1dFwiKS52YWx1ZVxyXG4gICAgICAgIGNoYXRzT2JqZWN0LnRpbWVzdGFtcCA9IERhdGUubm93KClcclxuICAgICAgICAvLyBjaGF0c09iamVjdC51c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJylcclxuICAgICAgICBjaGF0c09iamVjdC51c2VySWQgPSAxO1xyXG4gICAgICAgIHJldHVybiBjaGF0c09iamVjdFxyXG4gICAgfSxcclxuICAgIGJ1aWxkQ2hhdHNIVE1MOiAoY2hhdE9iamVjdCwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2hhdFRpbWVzdGFtcCA9IHRpbWVDb252ZXJ0ZXIoY2hhdE9iamVjdC50aW1lc3RhbXApXHJcblxyXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRzXCIgaWQ9XCJjaGF0LS0ke2NoYXRPYmplY3QuaWR9XCJcclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2hhdFRleHRDb250ZW50XCI+JHtjaGF0T2JqZWN0LnRleHR9PC9wPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjaGF0U3ViVGV4dFwiPlBvc3RlZCBieSAke2NoYXRPYmplY3QudXNlci51c2VybmFtZX0gb24gJHtjaGF0VGltZXN0YW1wfTwvcD5cclxuICAgICAgICBgXHJcblxyXG4gICAgICAgIGlmIChjaGF0T2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XHJcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tZWRpdC0tJHtjaGF0T2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tZGVsZXRlLS0ke2NoYXRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9kaXY+PGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2hhdHNNb2R1bGUiLCJpbXBvcnQgQVBJTWFuYWdlciBmcm9tIFwiLi9BUElNYW5hZ2VyXCJcclxuaW1wb3J0IHByaW50VG9ET00gZnJvbSBcIi4vcHJpbnRUb0RPTVwiO1xyXG5pbXBvcnQgY2hhdHNNb2R1bGUgZnJvbSBcIi4vY2hhdHNcIjtcclxuaW1wb3J0IGFydGljbGVNb2R1bGUgZnJvbSBcIi4vYXJ0aWNsZVwiXHJcbmltcG9ydCBldmVudHNNb2R1bGUgZnJvbSBcIi4vZXZlbnRzTW9kdWxlXCJcclxuaW1wb3J0IHRhc2tzTW9kdWxlIGZyb20gXCIuL3Rhc2tcIlxyXG5cclxuY29uc3QgZGFzaGJvYXJkUmVmcmVzaGlvbmFsID0gKCkgPT4ge1xyXG4gICAgLy8gTkVFRCBUTyBCRSBDSEFOR0VEIFRPIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcclxuICAgIGNvbnN0IHVzZXJJZCA9IDFcclxuICAgIC8vXHJcbiAgICBjb25zdCBjaGF0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0RGlzcGxheVwiKVxyXG4gICAgY29uc3QgYXJ0aWNsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJ0aWNsZURpc3BsYXlcIilcclxuICAgIGNvbnN0IGV2ZW50Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJldmVudERpc3BsYXlcIilcclxuICAgIGNvbnN0IHRhc2tDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhc2tEaXNwbGF5XCIpXHJcbiAgICBjb25zdCBmcmllbmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyaWVuZERpc3BsYXlcIilcclxuICAgIGNoYXRDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgYXJ0aWNsZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBldmVudENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICB0YXNrQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIGZyaWVuZENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJjaGF0c1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oY2hhdHMpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRNZXNzYWdlID0gY2hhdHNbaV1cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZUhUTUwgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChjdXJyZW50TWVzc2FnZSwgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKG1lc3NhZ2VIVE1MLCBcIiNcIiArIGNoYXRDb250YWluZXIuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImFydGljbGVzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihhcnRpY2xlcykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEFydGljbGUgPSBhcnRpY2xlc1tpXVxyXG4gICAgICAgICAgICBjb25zdCBhcnRpY2xlSFRNTCA9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwoY3VycmVudEFydGljbGUsIHVzZXJJZClcclxuICAgICAgICAgICAgcHJpbnRUb0RPTShhcnRpY2xlSFRNTCwgXCIjXCIgKyBhcnRpY2xlQ29udGFpbmVyLmlkKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJldmVudHNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGV2ZW50cykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudCA9IGV2ZW50c1tpXVxyXG4gICAgICAgICAgICBjb25zdCBldmVudEhUTUwgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGN1cnJlbnRFdmVudCwgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKGV2ZW50SFRNTCwgXCIjXCIgKyBldmVudENvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwidGFza3NcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKHRhc2tzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VGFzayA9IHRhc2tzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IHRhc2tIVE1MID0gdGFza3NNb2R1bGUudGFza1RvSFRNTChjdXJyZW50VGFzaywgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKHRhc2tIVE1MLCBcIiNcIiArIHRhc2tDb250YWluZXIuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIiwiLypcclxuQXV0aG9yOiBQYW55YVxyXG5UYXNrOiBsaXN0ZW4gdG8gdGhlIGJvZHkgb2YgdGhlIHBhZ2UgZm9yIGNsaWNrcywgYW5kIGNhbGwgb3RoZXIgbWV0aG9kcyBiYXNlZCBvbiB0aGUgdGFyZ2V0IG9mIHRoZSBjbGlja1xyXG4qL1xyXG5cclxuaW1wb3J0IEFQSU1hbmFnZXIgZnJvbSBcIi4vQVBJTWFuYWdlclwiO1xyXG5pbXBvcnQgcHJpbnRUb0RPTSBmcm9tIFwiLi9wcmludFRvRE9NXCI7XHJcbmltcG9ydCBldmVudHNNb2R1bGUgZnJvbSBcIi4vZXZlbnRzTW9kdWxlXCI7XHJcbmltcG9ydCBjaGF0c01vZHVsZSBmcm9tIFwiLi9jaGF0c1wiO1xyXG5pbXBvcnQgdGFza3NNb2R1bGUgZnJvbSBcIi4vdGFza1wiO1xyXG5pbXBvcnQgYXJ0aWNsZU1vZHVsZSBmcm9tIFwiLi9hcnRpY2xlXCI7XHJcblxyXG5jb25zdCBjbGlja0J1YmJsZXIgPSB7XHJcbiAgICBsaXN0ZW5lcjogKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGFzaGJvYXJkQ29udGFpbmVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiQlVUVE9OXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldExpc3QgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdoZXJlID0gYCMke3RhcmdldExpc3RbMF19RGlzcGxheWA7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3T2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SWQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiYWRkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBldmVudHNNb2R1bGUuYnVpbGRFbnRyeUZvcm0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzRm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2snOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IHRhc2tzTW9kdWxlLnRhc2tGb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gYXJ0aWNsZU1vZHVsZS5idWlsZEFydGljbGVGb3JtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXNoYm9hcmRDb250YWluZXJcIikuaW5uZXJIVE1MID0gbmV3SFRNTHN0cmluZztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJjcmVhdGVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c09iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IHRhc2tzTW9kdWxlLmNhcHR1cmVGb3JtVmFsdWVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgY3JlYXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbmV3IG9iamVjdCBhbmQgdGhlIG1vZHVsZSBuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5Qb3N0KHRhcmdldExpc3RbMF0sIG5ld09iamVjdClcclxuICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBjcmVhdGUgSFRNTCBtZXRob2QgZnJvbSB0aGUgY29ycmVjdCBtb2R1bGUsIHVzaW5nIHRoZSByZXR1cm5lZCBQcm9taXNlIGZyb20gYXBpIG1ldGhvZCB0byBmaWxsIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChvYmplY3RBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChvYmplY3RBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKG9iamVjdEFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwob2JqZWN0QXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImVkaXRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRJZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdElkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IHRhc2tzTW9kdWxlLmNhcHR1cmVGb3JtVmFsdWVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb2JqZWN0SWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gY2FsbCB0aGUgYXBpIGVkaXQgbWV0aG9kIGFuZCBwYXNzIGl0IHRoZSBuZXcgb2JqZWN0LCB0aGUgbW9kdWxlIG5hbWUsIGFuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IGlkXHJcbiAgICAgICAgICAgICAgICAgICAgLy9kZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkLCBlZGl0ZWRPYmplY3RcclxuICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLlB1dCh0YXJnZXRMaXN0WzBdLCB0YXJnZXRJZCwgbmV3T2JqZWN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gdGFza3NNb2R1bGUudGFza1RvSFRNTChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImRlbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgYXBpIGRlbGV0ZSBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG1vZHVsZSBuYW1lIGFuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IGlkXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRJZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdElkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvYmplY3RJZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuZGVsZXRlKHRhcmdldExpc3RbMF0sIGV2ZW50SWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgYXBpIGxpc3QgbWV0aG9kLCBwYXNzaW5nIGl0IHRoZSBjb3JyZWN0IG1vZHVsZSBhbmQgdXNlcmlkXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuZ2V0QnlVc2VySWQodGFyZ2V0TGlzdFswXSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludFRvRE9NKG5ld0hUTUxzdHJpbmcsIHdoZXJlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGlja0J1YmJsZXI7IiwiLypcclxuQXV0aG9yOiBQYW55YVxyXG5UYXNrOiBoYW5kbGVzIGFsbCBmdW5jdGlvbnMgc3BlY2lmaWMgdG8gdGhlIGV2ZW50cyBsaXN0aW5nIGluIE51dHNoZWxsXHJcbiovXHJcblxyXG5pbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcclxuXHJcbmNvbnN0IGV2ZW50c01vZHVsZSA9IHtcclxuICAgIGJ1aWxkRW50cnlGb3JtOiBldmVudElkID0+IHtcclxuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiZXZlbnRGb3JtXCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImV2ZW50SWRcIiB2YWx1ZT1cIiR7ZXZlbnRJZH1cIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnROYW1lXCI+TmFtZSBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJldmVudE5hbWVcIiBpZD1cImV2ZW50TmFtZVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudERhdGVcIj5EYXRlIG9mIHRoZSBldmVudDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRldGltZVwiIG5hbWU9XCJldmVudERhdGVcIiBpZD1cImV2ZW50RGF0ZVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudExvY2F0aW9uXCI+TG9jYXRpb24gb2YgdGhlIGV2ZW50OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXZlbnRMb2NhdGlvblwiIGlkPVwiZXZlbnRMb2NhdGlvblwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJldmVudHMtLWNyZWF0ZVwiPkNyZWF0ZSBOZXcgRXZlbnQ8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+YDtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVFdmVudE9iamVjdDogZXZlbnRJZCA9PiB7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50TmFtZVwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnREYXRlXCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBsb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRMb2NhdGlvblwiKS52YWx1ZTtcclxuICAgICAgICAvLyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XHJcbiAgICAgICAgY29uc3QgdXNlcklkID0gMTtcclxuICAgICAgICAvLyBldmVudElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudE9iamVjdCA9IHtcclxuICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50T2JqZWN0O1xyXG4gICAgICAgIC8vIGlmIChldmVudElkICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcbiAgICBjcmVhdGVFdmVudEhUTUw6IChldmVudE9iamVjdCwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSB0aW1lQ29udmVydGVyKGV2ZW50T2JqZWN0LmRhdGUpXHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gIGA8c2VjdGlvbiBjbGFzcz1cImV2ZW50c1wiIGlkPVwiZXZlbnQtLSR7ZXZlbnRPYmplY3QuaWR9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50TmFtZVwiPiR7ZXZlbnRPYmplY3QubmFtZX08L2Rpdj5cclxuICAgICAgICA8cD4ke3RpbWV9PC9wPlxyXG4gICAgICAgIDxwPiR7ZXZlbnRPYmplY3QubG9jYXRpb259PC9wPlxyXG4gICAgICAgIDwvc2VjdGlvbj5gO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tZWRpdC0tJHtldmVudE9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1kZWxldGUtLSR7ZXZlbnRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH0sXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50c01vZHVsZTsiLCJpbXBvcnQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIGZyb20gXCIuL2Rhc2hib2FyZFJlZnJlc2hpb25hbFwiO1xyXG5cclxuLy8gaW1wb3J0IGV2ZW50IGxpc3RlbmVycyBtb2R1bGUgZnJvbSBcIi4vZXZlbnRsaXN0ZW5lcnNcIlxyXG5cclxuLy8gaGVsbG8gd29ybGRcclxuXHJcbmltcG9ydCBsaXN0ZW5lcnMgZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnNcIjtcclxuXHJcbmRhc2hib2FyZFJlZnJlc2hpb25hbCgpXHJcblxyXG5saXN0ZW5lcnMubGlzdGVuZXIoKTtcclxuIiwiY29uc3QgcHJpbnRUb0RPTSA9ICh3aGF0LCB3aGVyZSkgPT4ge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHt3aGVyZX1gKS5pbm5lckhUTUwgKz0gd2hhdFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpbnRUb0RPTTtcclxuIiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XHJcblxyXG5jb25zdCB0YXNrc01vZHVsZSA9IHtcclxuICAgIHRhc2tUb0hUTUw6IGZ1bmN0aW9uICh0YXNrT2JqZWN0LCB1c2VySWQpIHtcclxuICAgICAgICBjb25zdCB0YXNrVGltZXN0YW1wID0gdGltZUNvbnZlcnRlcih0YXNrT2JqZWN0LmNvbXBsZXRpb25fZGF0ZSlcclxuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidGFza3NcIiBpZD1cInRhc2stLSR7dGFza09iamVjdC5pZH0+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrTmFtZVwiPiR7dGFza09iamVjdC5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICA8cCBpZD1cImNvbXBsZXRpb25fZGF0ZVwiPiR7dGFza1RpbWVzdGFtcH08L3A+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpc19jb21wbGV0ZVwiIGlkPVwidGFza19jb21wbGV0ZVwiPiR7dGFza09iamVjdC5pc19jb21wbGV0ZX08L2xhYmVsPlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKHRhc2tPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1lZGl0LS0ke3Rhc2tPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1kZWxldGUtLSR7dGFza09iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L3NlY3Rpb24+PGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH0sXHJcbiAgICB0YXNrRm9ybTogZnVuY3Rpb24gKG9iamVjdElkKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJ1c2VySWRcIiB2YWx1ZT1cIiR7b2JqZWN0SWR9XCI+PGJyPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWUgb2YgdGFzazogPC9sYWJlbD48YnI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGFzayBuYW1lXCIgaWQ9XCJ0YXNrTmFtZVwiPlxyXG4gICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb21wbGV0aW9uX2RhdGVcIj5EYXRlIHRvIGJlIGNvbXBsZXRlZCBieTogPC9sYWJlbD48YnI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIGlkPVwidGFza0RhdGVcIj5cclxuICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxsYWJlbD5JcyB0YXNrIGNvbXBsZXRlOiA8L2xhYmVsPjxicj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidGFza0NvbXBsZXRlXCIgdmFsdWU9XCJZZXNcIj5ZZXM8YnI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInRhc2tDb21wbGV0ZVwiIHZhbHVlPVwiTm9cIj5Obzxicj5cclxuICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1jcmVhdGVcIj5TdWJtaXQ8L2J1dHRvbj5cclxuICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgIGBcclxuICAgIH0sXHJcbiAgICBjYXB0dXJlRm9ybVZhbHVlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHRhc2tPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza05hbWVcIikudmFsdWUsXHJcbiAgICAgICAgICAgIGNvbXBsZXRpb25fZGF0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrRGF0ZVwiKS52YWx1ZSxcclxuICAgICAgICAgICAgaXNfY29tcGxldGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza0NvbXBsZXRlXCIpLnZhbHVlLFxyXG4gICAgICAgICAgICAvL3VzZXJJZDogV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VySWRcIilcclxuICAgICAgICAgICAgdXNlcklkOiAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXNrT2JqZWN0XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRhc2tzTW9kdWxlIiwiZnVuY3Rpb24gdGltZUNvbnZlcnRlciAodGltZXN0YW1wKSB7XHJcbiAgICB2YXIgYSA9IG5ldyBEYXRlKHBhcnNlSW50KHRpbWVzdGFtcCkpO1xyXG4gICAgdmFyIG1vbnRocyA9IFsnSmFuJywnRmViJywnTWFyJywnQXByJywnTWF5JywnSnVuJywnSnVsJywnQXVnJywnU2VwJywnT2N0JywnTm92JywnRGVjJ107XHJcbiAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcclxuICAgIHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG4gICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcclxuICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG4gICAgdmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG4gICAgdmFyIHRpbWUgPSBkYXRlICsgJyAnICsgbW9udGggKyAnICcgKyB5ZWFyICsgJyAnICsgaG91ciArICc6JyArIG1pbjtcclxuICAgIHJldHVybiB0aW1lO1xyXG4gIH07XHJcblxyXG4gIGV4cG9ydCBkZWZhdWx0IHRpbWVDb252ZXJ0ZXI7Il19
