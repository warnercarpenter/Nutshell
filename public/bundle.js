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

},{"./timestampparser":11}],4:[function(require,module,exports){
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

},{"./APIManager":1,"./article":2,"./chats":3,"./eventsModule":6,"./printToDOM":8,"./task":10}],5:[function(require,module,exports){
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

var _registration = _interopRequireDefault(require("./registration"));

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
            location.reload(true);
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
            location.reload(true);
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
              location.reload(true);
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
  },
  register: () => {
    document.querySelector("#registration--create").addEventListener("click", event => {
      const newObject = _registration.default.createRegistrationObject();

      _APIManager.default.Post("users", newObject).then(objectArray => {
        let userId = objectArray.id;
        sessionStorage.setItem("userId", userId);
      });
    });
  }
};
var _default = clickBubbler;
exports.default = _default;

},{"./APIManager":1,"./article":2,"./chats":3,"./eventsModule":6,"./printToDOM":8,"./registration":9,"./task":10}],6:[function(require,module,exports){
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
                <input type="date" name="eventDate" id="eventDate"></input>
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

},{"./timestampparser":11}],7:[function(require,module,exports){
"use strict";

var _dashboardRefreshional = _interopRequireDefault(require("./dashboardRefreshional"));

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

var _registration = _interopRequireDefault(require("./registration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import event listeners module from "./eventlisteners"
// hello world
let userId = sessionStorage.getItem("userId");

if (userId !== null) {
  (0, _dashboardRefreshional.default)();

  _eventListeners.default.listener();
} else {
  const HTMLcode = _registration.default.buildRegistrationForm();

  document.querySelector("#dashboardContainer").innerHTML = HTMLcode;

  _eventListeners.default.register();
}

},{"./dashboardRefreshional":4,"./eventListeners":5,"./registration":9}],8:[function(require,module,exports){
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
const registrationHandler = {
  buildRegistrationForm: () => {
    return `<form id="registrationForm">
        <fieldset>
            <label for="email">Email:</label>
            <input type="text" name="email" id="email"></input>
        </fieldset>
        <fieldset>
            <label for="username">Username:</label>
            <input type="text" name="username" id="username"></input>
        </fieldset>
        <fieldset>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password"></input>
        </fieldset>
        <fieldset>
            <label for="firstName">First Name:</label>
            <input type="text" name="firstName" id="firstName"></input>
        </fieldset>
        <fieldset>
            <label for="lastName">Last Name:</label>
            <input type="text" name="lastName" id="lastName"></input>
        <button id="registration--create">Register</button>
        `;
  },
  createRegistrationObject: () => {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let firstName = document.querySelector("#firstName").value;
    let lastName = document.querySelector("#lastName").value;
    let email = document.querySelector("#email").value;
    const userObject = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      email: email
    };
    return userObject;
  }
};
var _default = registrationHandler;
exports.default = _default;

},{}],10:[function(require,module,exports){
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

},{"./timestampparser":11}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3JlZ2lzdHJhdGlvbi5qcyIsIi4uL3NjcmlwdHMvdGFzay5qcyIsIi4uL3NjcmlwdHMvdGltZXN0YW1wcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0EsTUFBTSxVQUFVLEdBQUc7QUFDZixFQUFBLFdBQVcsRUFBRSxDQUFDLGVBQUQsRUFBa0IsTUFBbEIsS0FBNkI7QUFDdEMsV0FBTyxLQUFLLENBQUcseUJBQXdCLGVBQWdCLFlBQVcsTUFBTyxFQUE3RCxDQUFMLENBQ0YsSUFERSxDQUNHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQURWLENBQVA7QUFHSCxHQUxjO0FBTWYsRUFBQSxNQUFNLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLEtBQStCO0FBQ25DLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixJQUFHLFFBQVMsRUFBdEQsRUFBeUQ7QUFDN0QsTUFBQSxNQUFNLEVBQUU7QUFEcUQsS0FBekQsQ0FBWjtBQUdKLEdBVmU7QUFXaEIsRUFBQSxJQUFJLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLEtBQW1DO0FBQ3hDLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixFQUExQyxFQUE2QztBQUNyRCxNQUFBLE1BQU0sRUFBRSxNQUQ2QztBQUVyRCxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRjRD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LEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFGLEVBQUQsQ0FBbEI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsT0FBRixFQUFYO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQUYsRUFBWDtBQUNBLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFGLEVBQVY7QUFDQSxNQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBUCxHQUFhLEtBQWIsR0FBcUIsR0FBckIsR0FBMkIsSUFBM0IsR0FBa0MsR0FBbEMsR0FBd0MsSUFBeEMsR0FBK0MsR0FBL0MsR0FBcUQsR0FBaEU7QUFDQSxTQUFPLElBQVA7QUFDRDs7QUFBQTtlQUVjLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcbmNvbnN0IEFQSU1hbmFnZXIgPSB7XG4gICAgZ2V0QnlVc2VySWQ6IChkZXNpcmVkRGF0YWJhc2UsIHVzZXJJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P191c2VySWQ9JHt1c2VySWR9YClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuXG4gICAgfSxcbiAgICBkZWxldGU6IChkZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkKSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovLzEyNy4wLjAuMTo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcbiAgICAgICAgfSlcbiAgIH0sXG4gICBQb3N0OiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RUb1Bvc3QpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX1gLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9iamVjdFRvUG9zdClcbiAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgIH0sXG4gICAgUHV0OihkZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkLCBlZGl0ZWRPYmplY3QpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9LyR7b2JqZWN0SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZWRpdGVkT2JqZWN0KVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICB9LFxuICAgIGZldGNoV2l0aEV4cGFuZGVkVXNlckluZm86IChkZXNpcmVkRGF0YWJhc2UsIHVzZXJJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P19leHBhbmQ9dXNlciZ1c2VySWQ9JHt1c2VySWR9YClcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBUElNYW5hZ2VyIiwiY29uc3QgYXJ0aWNsZU1vZHVsZSA9IHtcbiAgICBidWlsZEFydGljbGVGb3JtOiAoYXJ0aWNsZUlkKSA9PiB7XG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJhcnRpY2xlRm9ybVwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiYXJ0aWNsZUlkXCIgdmFsdWU9XCIke2FydGljbGVJZH1cIj48L2lucHV0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlVGl0bGVcIj5BcnRpY2xlIFRpdGxlOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVUaXRsZVwiIGlkPVwiYXJ0aWNsZVRpdGxlXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVTdW1tYXJ5XCI+QXJ0aWNsZSBTdW1tYXJ5OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVTdW1tYXJ5XCIgaWQ9XCJhcnRpY2xlU3VtbWFyeVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlVVJMXCI+QXJ0aWNsZSBVUkw6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVVSTFwiIGlkPVwiYXJ0aWNsZVVSTFwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1jcmVhdGVcIj5Qb3N0IFlvdXIgQXJ0aWNsZTwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+YFxuICAgIH0sXG4gICAgY3JlYXRlQXJ0aWNsZU9iamVjdDogKCkgPT4ge1xuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVUaXRsZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IHN1bW1hcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVTdW1tYXJ5XCIpLnZhbHVlO1xuICAgICAgICBsZXQgdXJsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlVVJMXCIpLnZhbHVlO1xuICAgICAgICAvLyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IDE7XG4gICAgICAgIC8vIGxldCBhcnRpY2xlSWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVJZFwiKS52YWx1ZTtcblxuICAgICAgICBjb25zdCBhcnRpY2xlT2JqZWN0ID0ge1xuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgc3VtbWFyeTogc3VtbWFyeSxcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnRpY2xlT2JqZWN0XG5cbiAgICB9LFxuICAgIGNyZWF0ZUFydGljbGVIVE1MOiAoYXJ0aWNsZU9iamVjdCwgdXNlcklkKSA9PiB7XG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGA8c2VjdGlvbiBjbGFzcz1cImFydGljbGVzXCIgaWQ9XCJhcnRpY2xlLS0ke2FydGljbGVPYmplY3QuaWR9XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhcnRpY2xlVGl0bGVcIj4ke2FydGljbGVPYmplY3QudGl0bGV9PC9kaXY+XG4gICAgICAgIDxwPiR7YXJ0aWNsZU9iamVjdC5zdW1tYXJ5fTwvcD5cbiAgICAgICAgPHA+PGEgaHJlZj1cImh0dHA6Ly8ke2FydGljbGVPYmplY3QudXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7YXJ0aWNsZU9iamVjdC51cmx9PC9hPjwvcD5cbiAgICAgICAgYFxuXG4gICAgICAgIGlmIChhcnRpY2xlT2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1lZGl0LS0ke2FydGljbGVPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tZGVsZXRlLS0ke2FydGljbGVPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XG4gICAgICAgICAgICBgXG4gICAgICAgIH1cblxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvc2VjdGlvbj48aHIvPlwiXG5cbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXJ0aWNsZU1vZHVsZSIsImltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xuXG5jb25zdCBjaGF0c01vZHVsZSA9IHtcbiAgICBidWlsZENoYXRzRm9ybTogKGNoYXRJZCkgPT4ge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXRzRm9ybVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNoYXRJZFwiIHZhbHVlPVwiJHtjaGF0SWR9XCI+PC9pbnB1dD5cbiAgICAgICAgICAgICAgICBFbnRlciB5b3VyIG1lc3NhZ2U6PC9icj5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcm93cz1cIjRcIiBjb2xzPVwiNTBcIiBuYW1lPVwiY2hhdE1lc3NhZ2VcIiBpZD1cImNoYXQtLXRleHRJbnB1dFwiPjwvdGV4dGFyZWE+PC9icj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY2hhdHMtLWNyZWF0ZVwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGBcbiAgICB9LFxuICAgIGJ1aWxkQ2hhdHNPYmplY3Q6ICgpID0+IHtcbiAgICAgICAgY29uc3QgY2hhdHNPYmplY3QgPSB7fVxuICAgICAgICBjaGF0c09iamVjdC50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0LS10ZXh0SW5wdXRcIikudmFsdWVcbiAgICAgICAgY2hhdHNPYmplY3QudGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgICAgICAvLyBjaGF0c09iamVjdC51c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJylcbiAgICAgICAgY2hhdHNPYmplY3QudXNlcklkID0gMTtcbiAgICAgICAgcmV0dXJuIGNoYXRzT2JqZWN0XG4gICAgfSxcbiAgICBidWlsZENoYXRzSFRNTDogKGNoYXRPYmplY3QsIHVzZXJJZCkgPT4ge1xuICAgICAgICBjb25zdCBjaGF0VGltZXN0YW1wID0gdGltZUNvbnZlcnRlcihjaGF0T2JqZWN0LnRpbWVzdGFtcClcblxuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdHNcIiBpZD1cImNoYXQtLSR7Y2hhdE9iamVjdC5pZH1cIlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2hhdFRleHRDb250ZW50XCI+JHtjaGF0T2JqZWN0LnRleHR9PC9wPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2hhdFN1YlRleHRcIj5Qb3N0ZWQgYnkgJHtjaGF0T2JqZWN0LnVzZXIudXNlcm5hbWV9IG9uICR7Y2hhdFRpbWVzdGFtcH08L3A+XG4gICAgICAgIGBcblxuICAgICAgICBpZiAoY2hhdE9iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tZWRpdC0tJHtjaGF0T2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY2hhdHMtLWRlbGV0ZS0tJHtjaGF0T2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxuICAgICAgICAgICAgYFxuICAgICAgICB9XG5cbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L2Rpdj48aHIvPlwiXG5cbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjaGF0c01vZHVsZSIsImltcG9ydCBBUElNYW5hZ2VyIGZyb20gXCIuL0FQSU1hbmFnZXJcIlxuaW1wb3J0IHByaW50VG9ET00gZnJvbSBcIi4vcHJpbnRUb0RPTVwiO1xuaW1wb3J0IGNoYXRzTW9kdWxlIGZyb20gXCIuL2NoYXRzXCI7XG5pbXBvcnQgYXJ0aWNsZU1vZHVsZSBmcm9tIFwiLi9hcnRpY2xlXCJcbmltcG9ydCBldmVudHNNb2R1bGUgZnJvbSBcIi4vZXZlbnRzTW9kdWxlXCJcbmltcG9ydCB0YXNrc01vZHVsZSBmcm9tIFwiLi90YXNrXCJcblxuY29uc3QgZGFzaGJvYXJkUmVmcmVzaGlvbmFsID0gKCkgPT4ge1xuICAgIC8vIE5FRUQgVE8gQkUgQ0hBTkdFRCBUTyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XG4gICAgY29uc3QgdXNlcklkID0gMVxuICAgIC8vXG4gICAgY29uc3QgY2hhdENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhdERpc3BsYXlcIilcbiAgICBjb25zdCBhcnRpY2xlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpY2xlRGlzcGxheVwiKVxuICAgIGNvbnN0IGV2ZW50Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJldmVudERpc3BsYXlcIilcbiAgICBjb25zdCB0YXNrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXNrRGlzcGxheVwiKVxuICAgIGNvbnN0IGZyaWVuZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJpZW5kRGlzcGxheVwiKVxuICAgIGNoYXRDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxuICAgIGFydGljbGVDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxuICAgIGV2ZW50Q29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcbiAgICB0YXNrQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcbiAgICBmcmllbmRDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImNoYXRzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihjaGF0cykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50TWVzc2FnZSA9IGNoYXRzW2ldXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlSFRNTCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGN1cnJlbnRNZXNzYWdlLCB1c2VySWQpXG4gICAgICAgICAgICBwcmludFRvRE9NKG1lc3NhZ2VIVE1MLCBcIiNcIiArIGNoYXRDb250YWluZXIuaWQpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImFydGljbGVzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihhcnRpY2xlcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QXJ0aWNsZSA9IGFydGljbGVzW2ldXG4gICAgICAgICAgICBjb25zdCBhcnRpY2xlSFRNTCA9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwoY3VycmVudEFydGljbGUsIHVzZXJJZClcbiAgICAgICAgICAgIHByaW50VG9ET00oYXJ0aWNsZUhUTUwsIFwiI1wiICsgYXJ0aWNsZUNvbnRhaW5lci5pZClcbiAgICAgICAgfVxuICAgIH0pXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiZXZlbnRzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihldmVudHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFdmVudCA9IGV2ZW50c1tpXVxuICAgICAgICAgICAgY29uc3QgZXZlbnRIVE1MID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChjdXJyZW50RXZlbnQsIHVzZXJJZClcbiAgICAgICAgICAgIHByaW50VG9ET00oZXZlbnRIVE1MLCBcIiNcIiArIGV2ZW50Q29udGFpbmVyLmlkKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJ0YXNrc1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24odGFza3MpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRhc2sgPSB0YXNrc1tpXVxuICAgICAgICAgICAgY29uc3QgdGFza0hUTUwgPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGN1cnJlbnRUYXNrLCB1c2VySWQpXG4gICAgICAgICAgICBwcmludFRvRE9NKHRhc2tIVE1MLCBcIiNcIiArIHRhc2tDb250YWluZXIuaWQpXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwiLCIvKlxuQXV0aG9yOiBQYW55YVxuVGFzazogbGlzdGVuIHRvIHRoZSBib2R5IG9mIHRoZSBwYWdlIGZvciBjbGlja3MsIGFuZCBjYWxsIG90aGVyIG1ldGhvZHMgYmFzZWQgb24gdGhlIHRhcmdldCBvZiB0aGUgY2xpY2tcbiovXG5cbmltcG9ydCBBUElNYW5hZ2VyIGZyb20gXCIuL0FQSU1hbmFnZXJcIjtcbmltcG9ydCBwcmludFRvRE9NIGZyb20gXCIuL3ByaW50VG9ET01cIjtcbmltcG9ydCBldmVudHNNb2R1bGUgZnJvbSBcIi4vZXZlbnRzTW9kdWxlXCI7XG5pbXBvcnQgY2hhdHNNb2R1bGUgZnJvbSBcIi4vY2hhdHNcIjtcbmltcG9ydCB0YXNrc01vZHVsZSBmcm9tIFwiLi90YXNrXCI7XG5pbXBvcnQgYXJ0aWNsZU1vZHVsZSBmcm9tIFwiLi9hcnRpY2xlXCI7XG5pbXBvcnQgcmVnaXN0cmF0aW9uSGFuZGxlciBmcm9tIFwiLi9yZWdpc3RyYXRpb25cIjtcblxuY29uc3QgY2xpY2tCdWJibGVyID0ge1xuICAgIGxpc3RlbmVyOiAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGFzaGJvYXJkQ29udGFpbmVyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIkJVVFRPTlwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0TGlzdCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdoZXJlID0gYCMke3RhcmdldExpc3RbMF19RGlzcGxheWA7XG4gICAgICAgICAgICAgICAgbGV0IG5ld09iamVjdCA9IHt9O1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRJZCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiYWRkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gZXZlbnRzTW9kdWxlLmJ1aWxkRW50cnlGb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0Zvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2snOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSB0YXNrc01vZHVsZS50YXNrRm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IGFydGljbGVNb2R1bGUuYnVpbGRBcnRpY2xlRm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGFzaGJvYXJkQ29udGFpbmVyXCIpLmlubmVySFRNTCA9IG5ld0hUTUxzdHJpbmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c09iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IHRhc2tzTW9kdWxlLmNhcHR1cmVGb3JtVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgY3JlYXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbmV3IG9iamVjdCBhbmQgdGhlIG1vZHVsZSBuYW1lXG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuUG9zdCh0YXJnZXRMaXN0WzBdLCBuZXdPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChvYmplY3RBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChvYmplY3RBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKG9iamVjdEFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwob2JqZWN0QXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludFRvRE9NKG5ld0hUTUxzdHJpbmcsIHdoZXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImVkaXRcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBjb3JyZWN0IG9iamVjdCBmYWN0b3J5IGJhc2VkIG9uIHRhcmdldExpc3RbMF0sIHdoaWNoIHNob3VsZCBjb250YWluIHRoZSBtb2R1bGUgbmFtZSAoaS5lLiAnZXZlbnRzJylcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IHRhc2tzTW9kdWxlLmNhcHR1cmVGb3JtVmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29iamVjdElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBjYWxsIHRoZSBhcGkgZWRpdCBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG5ldyBvYmplY3QsIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcbiAgICAgICAgICAgICAgICAgICAgLy9kZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkLCBlZGl0ZWRPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5QdXQodGFyZ2V0TGlzdFswXSwgdGFyZ2V0SWQsIG5ld09iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxuICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGFwaSBkZWxldGUgbWV0aG9kIGFuZCBwYXNzIGl0IHRoZSBtb2R1bGUgbmFtZSBhbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBpZFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb2JqZWN0SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLmRlbGV0ZSh0YXJnZXRMaXN0WzBdLCBldmVudElkKVxuICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBhcGkgbGlzdCBtZXRob2QsIHBhc3NpbmcgaXQgdGhlIGNvcnJlY3QgbW9kdWxlIGFuZCB1c2VyaWRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5nZXRCeVVzZXJJZCh0YXJnZXRMaXN0WzBdLCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gdGFza3NNb2R1bGUudGFza1RvSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHByaW50VG9Eb20oKSBhbmQgcGFzcyBpdCB0aGUgbmV3IEhUTUwgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludFRvRE9NKG5ld0hUTUxzdHJpbmcsIHdoZXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHJlZ2lzdGVyOiAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVnaXN0cmF0aW9uLS1jcmVhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICAgIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld09iamVjdCA9IHJlZ2lzdHJhdGlvbkhhbmRsZXIuY3JlYXRlUmVnaXN0cmF0aW9uT2JqZWN0KCk7XG4gICAgICAgICAgICBBUElNYW5hZ2VyLlBvc3QoXCJ1c2Vyc1wiLCBuZXdPYmplY3QpXG4gICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VySWQgPSBvYmplY3RBcnJheS5pZDtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCB1c2VySWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGlja0J1YmJsZXI7IiwiLypcbkF1dGhvcjogUGFueWFcblRhc2s6IGhhbmRsZXMgYWxsIGZ1bmN0aW9ucyBzcGVjaWZpYyB0byB0aGUgZXZlbnRzIGxpc3RpbmcgaW4gTnV0c2hlbGxcbiovXG5cbmltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xuXG5jb25zdCBldmVudHNNb2R1bGUgPSB7XG4gICAgYnVpbGRFbnRyeUZvcm06IGV2ZW50SWQgPT4ge1xuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiZXZlbnRGb3JtXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJldmVudElkXCIgdmFsdWU9XCIke2V2ZW50SWR9XCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnROYW1lXCI+TmFtZSBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXZlbnROYW1lXCIgaWQ9XCJldmVudE5hbWVcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnREYXRlXCI+RGF0ZSBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBuYW1lPVwiZXZlbnREYXRlXCIgaWQ9XCJldmVudERhdGVcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZXZlbnRMb2NhdGlvblwiPkxvY2F0aW9uIG9mIHRoZSBldmVudDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJldmVudExvY2F0aW9uXCIgaWQ9XCJldmVudExvY2F0aW9uXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1jcmVhdGVcIj5DcmVhdGUgTmV3IEV2ZW50PC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5gO1xuICAgIH0sXG4gICAgY3JlYXRlRXZlbnRPYmplY3Q6IGV2ZW50SWQgPT4ge1xuICAgICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnROYW1lXCIpLnZhbHVlO1xuICAgICAgICBsZXQgZGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnREYXRlXCIpLnZhbHVlO1xuICAgICAgICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50TG9jYXRpb25cIikudmFsdWU7XG4gICAgICAgIC8vIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcbiAgICAgICAgY29uc3QgdXNlcklkID0gMTtcbiAgICAgICAgLy8gZXZlbnRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRJZFwiKS52YWx1ZTtcblxuICAgICAgICBjb25zdCBldmVudE9iamVjdCA9IHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBkYXRlOiBkYXRlLFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBldmVudE9iamVjdDtcbiAgICAgICAgLy8gaWYgKGV2ZW50SWQgIT09IFwiXCIpIHtcblxuICAgICAgICAvLyB9IGVsc2Uge1xuXG4gICAgICAgIC8vIH1cbiAgICB9LFxuICAgIGNyZWF0ZUV2ZW50SFRNTDogKGV2ZW50T2JqZWN0LCB1c2VySWQpID0+IHtcbiAgICAgICAgbGV0IHRpbWUgPSB0aW1lQ29udmVydGVyKGV2ZW50T2JqZWN0LmRhdGUpXG4gICAgICAgIGxldCBiYXNlSFRNTCA9ICBgPHNlY3Rpb24gY2xhc3M9XCJldmVudHNcIiBpZD1cImV2ZW50LS0ke2V2ZW50T2JqZWN0LmlkfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnROYW1lXCI+JHtldmVudE9iamVjdC5uYW1lfTwvZGl2PlxuICAgICAgICA8cD4ke3RpbWV9PC9wPlxuICAgICAgICA8cD4ke2V2ZW50T2JqZWN0LmxvY2F0aW9ufTwvcD5cbiAgICAgICAgPC9zZWN0aW9uPmA7XG5cbiAgICAgICAgaWYgKGV2ZW50T2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tZWRpdC0tJHtldmVudE9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tZGVsZXRlLS0ke2V2ZW50T2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxuICAgICAgICAgICAgYFxuICAgICAgICB9XG5cbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8aHIvPlwiXG5cbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZXZlbnRzTW9kdWxlOyIsImltcG9ydCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgZnJvbSBcIi4vZGFzaGJvYXJkUmVmcmVzaGlvbmFsXCI7XG5cbi8vIGltcG9ydCBldmVudCBsaXN0ZW5lcnMgbW9kdWxlIGZyb20gXCIuL2V2ZW50bGlzdGVuZXJzXCJcblxuLy8gaGVsbG8gd29ybGRcblxuaW1wb3J0IGNsaWNrQnViYmxlciBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiO1xuaW1wb3J0IHJlZ2lzdHJhdGlvbkhhbmRsZXIgZnJvbSBcIi4vcmVnaXN0cmF0aW9uXCI7XG5cbmxldCB1c2VySWQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidXNlcklkXCIpO1xuaWYgKHVzZXJJZCAhPT0gbnVsbCkge1xuICAgIGRhc2hib2FyZFJlZnJlc2hpb25hbCgpXG4gICAgY2xpY2tCdWJibGVyLmxpc3RlbmVyKCk7XG59IGVsc2Uge1xuICAgIGNvbnN0IEhUTUxjb2RlID0gcmVnaXN0cmF0aW9uSGFuZGxlci5idWlsZFJlZ2lzdHJhdGlvbkZvcm0oKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rhc2hib2FyZENvbnRhaW5lclwiKS5pbm5lckhUTUwgPSBIVE1MY29kZTtcbiAgICBjbGlja0J1YmJsZXIucmVnaXN0ZXIoKTtcbn1cblxuIiwiY29uc3QgcHJpbnRUb0RPTSA9ICh3aGF0LCB3aGVyZSkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7d2hlcmV9YCkuaW5uZXJIVE1MICs9IHdoYXRcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBwcmludFRvRE9NO1xuIiwiY29uc3QgcmVnaXN0cmF0aW9uSGFuZGxlciA9IHtcbiAgICBidWlsZFJlZ2lzdHJhdGlvbkZvcm06ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGA8Zm9ybSBpZD1cInJlZ2lzdHJhdGlvbkZvcm1cIj5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVtYWlsXCI+RW1haWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VybmFtZVwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdE5hbWVcIj5GaXJzdCBOYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmlyc3ROYW1lXCIgaWQ9XCJmaXJzdE5hbWVcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibGFzdE5hbWVcIj5MYXN0IE5hbWU6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsYXN0TmFtZVwiIGlkPVwibGFzdE5hbWVcIj48L2lucHV0PlxuICAgICAgICA8YnV0dG9uIGlkPVwicmVnaXN0cmF0aW9uLS1jcmVhdGVcIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgICAgICBgO1xuICAgIH0sXG4gICAgY3JlYXRlUmVnaXN0cmF0aW9uT2JqZWN0OiAoKSA9PiB7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXNlcm5hbWVcIikudmFsdWVcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwYXNzd29yZFwiKS52YWx1ZVxuICAgICAgICBsZXQgZmlyc3ROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmaXJzdE5hbWVcIikudmFsdWVcbiAgICAgICAgbGV0IGxhc3ROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsYXN0TmFtZVwiKS52YWx1ZVxuICAgICAgICBsZXQgZW1haWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VtYWlsXCIpLnZhbHVlXG5cbiAgICAgICAgY29uc3QgdXNlck9iamVjdCA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VyT2JqZWN0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlZ2lzdHJhdGlvbkhhbmRsZXI7IiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XG5cbmNvbnN0IHRhc2tzTW9kdWxlID0ge1xuICAgIHRhc2tUb0hUTUw6IGZ1bmN0aW9uICh0YXNrT2JqZWN0LCB1c2VySWQpIHtcbiAgICAgICAgY29uc3QgdGFza1RpbWVzdGFtcCA9IHRpbWVDb252ZXJ0ZXIodGFza09iamVjdC5jb21wbGV0aW9uX2RhdGUpXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGBcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidGFza3NcIiBpZD1cInRhc2stLSR7dGFza09iamVjdC5pZH0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFza05hbWVcIj4ke3Rhc2tPYmplY3QubmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDxwIGlkPVwiY29tcGxldGlvbl9kYXRlXCI+JHt0YXNrVGltZXN0YW1wfTwvcD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpc19jb21wbGV0ZVwiIGlkPVwidGFza19jb21wbGV0ZVwiPiR7dGFza09iamVjdC5pc19jb21wbGV0ZX08L2xhYmVsPlxuICAgICAgICBgXG5cbiAgICAgICAgaWYgKHRhc2tPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWVkaXQtLSR7dGFza09iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1kZWxldGUtLSR7dGFza09iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9zZWN0aW9uPjxoci8+XCJcblxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcbiAgICB9LFxuICAgIHRhc2tGb3JtOiBmdW5jdGlvbiAob2JqZWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInVzZXJJZFwiIHZhbHVlPVwiJHtvYmplY3RJZH1cIj48YnI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWUgb2YgdGFzazogPC9sYWJlbD48YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRhc2sgbmFtZVwiIGlkPVwidGFza05hbWVcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb21wbGV0aW9uX2RhdGVcIj5EYXRlIHRvIGJlIGNvbXBsZXRlZCBieTogPC9sYWJlbD48YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cInRhc2tEYXRlXCI+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbD5JcyB0YXNrIGNvbXBsZXRlOiA8L2xhYmVsPjxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInRhc2tDb21wbGV0ZVwiIHZhbHVlPVwiWWVzXCI+WWVzPGJyPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidGFza0NvbXBsZXRlXCIgdmFsdWU9XCJOb1wiPk5vPGJyPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWNyZWF0ZVwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICBgXG4gICAgfSxcbiAgICBjYXB0dXJlRm9ybVZhbHVlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB0YXNrT2JqZWN0ID0ge1xuICAgICAgICAgICAgbmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrTmFtZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIGNvbXBsZXRpb25fZGF0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrRGF0ZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIGlzX2NvbXBsZXRlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2tDb21wbGV0ZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIC8vdXNlcklkOiBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKVxuICAgICAgICAgICAgdXNlcklkOiAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhc2tPYmplY3RcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRhc2tzTW9kdWxlIiwiZnVuY3Rpb24gdGltZUNvbnZlcnRlciAodGltZXN0YW1wKSB7XG4gICAgdmFyIGEgPSBuZXcgRGF0ZShwYXJzZUludCh0aW1lc3RhbXApKTtcbiAgICB2YXIgbW9udGhzID0gWydKYW4nLCdGZWInLCdNYXInLCdBcHInLCdNYXknLCdKdW4nLCdKdWwnLCdBdWcnLCdTZXAnLCdPY3QnLCdOb3YnLCdEZWMnXTtcbiAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xuICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICB2YXIgdGltZSA9IGRhdGUgKyAnICcgKyBtb250aCArICcgJyArIHllYXIgKyAnICcgKyBob3VyICsgJzonICsgbWluO1xuICAgIHJldHVybiB0aW1lO1xuICB9O1xuXG4gIGV4cG9ydCBkZWZhdWx0IHRpbWVDb252ZXJ0ZXI7Il19
