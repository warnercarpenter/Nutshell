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
const registrationLoginHandler = {
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
  },
  buildLoginForm: () => {
    return `<form id="loginForm">
        <fieldset>
            <label for="username">Username:</label>
            <input type="text" name="loginUsername" id="loginUsername"></input>
        </fieldset>
        <fieldset>
            <label for="password">Password:</label>
            <input type="password" name="loginPassword" id="loginPassword"></input>
        </fieldset>
        <fieldset>
        <button id="login">Login</button>
        `;
  },
  createLoginObject: () => {
    let username = document.querySelector("#loginUsername").value;
    let password = document.querySelector("#loginPassword").value;
    const userLoginObject = {
      username: username,
      password: password
    };
    return userLoginObject;
  }
};
var _default = registrationLoginHandler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3JlZ2lzdHJhdGlvbi5qcyIsIi4uL3NjcmlwdHMvdGFzay5qcyIsIi4uL3NjcmlwdHMvdGltZXN0YW1wcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0EsTUFBTSxVQUFVLEdBQUc7QUFDZixFQUFBLFdBQVcsRUFBRSxDQUFDLGVBQUQsRUFBa0IsTUFBbEIsS0FBNkI7QUFDdEMsV0FBTyxLQUFLLENBQUcseUJBQXdCLGVBQWdCLFlBQVcsTUFBTyxFQUE3RCxDQUFMLENBQ0YsSUFERSxDQUNHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQURWLENBQVA7QUFHSCxHQUxjO0FBTWYsRUFBQSxNQUFNLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLEtBQStCO0FBQ25DLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixJQUFHLFFBQVMsRUFBdEQsRUFBeUQ7QUFDN0QsTUFBQSxNQUFNLEVBQUU7QUFEcUQsS0FBekQsQ0FBWjtBQUdKLEdBVmU7QUFXaEIsRUFBQSxJQUFJLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLEtBQW1DO0FBQ3hDLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixFQUExQyxFQUE2QztBQUNyRCxNQUFBLE1BQU0sRUFBRSxNQUQ2QztBQUVyRCxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRjRD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Ozs7Ozs7O0FDdERmLFNBQVMsYUFBVCxDQUF3QixTQUF4QixFQUFtQztBQUMvQixNQUFJLENBQUMsR0FBRyxJQUFJLElBQUosQ0FBUyxRQUFRLENBQUMsU0FBRCxDQUFqQixDQUFSO0FBQ0EsTUFBSSxNQUFNLEdBQUcsQ0FBQyxLQUFELEVBQU8sS0FBUCxFQUFhLEtBQWIsRUFBbUIsS0FBbkIsRUFBeUIsS0FBekIsRUFBK0IsS0FBL0IsRUFBcUMsS0FBckMsRUFBMkMsS0FBM0MsRUFBaUQsS0FBakQsRUFBdUQsS0FBdkQsRUFBNkQsS0FBN0QsRUFBbUUsS0FBbkUsQ0FBYjtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFGLEVBQVg7QUFDQSxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQUYsRUFBRCxDQUFsQjtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFGLEVBQVg7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBRixFQUFYO0FBQ0EsTUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQUYsRUFBVjtBQUNBLE1BQUksSUFBSSxHQUFHLElBQUksR0FBRyxHQUFQLEdBQWEsS0FBYixHQUFxQixHQUFyQixHQUEyQixJQUEzQixHQUFrQyxHQUFsQyxHQUF3QyxJQUF4QyxHQUErQyxHQUEvQyxHQUFxRCxHQUFoRTtBQUNBLFNBQU8sSUFBUDtBQUNEOztBQUFBO2VBRWMsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuY29uc3QgQVBJTWFuYWdlciA9IHtcbiAgICBnZXRCeVVzZXJJZDogKGRlc2lyZWREYXRhYmFzZSwgdXNlcklkKSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaCAoYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0/X3VzZXJJZD0ke3VzZXJJZH1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG5cbiAgICB9LFxuICAgIGRlbGV0ZTogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9LyR7b2JqZWN0SWR9YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIlxuICAgICAgICB9KVxuICAgfSxcbiAgIFBvc3Q6IChkZXNpcmVkRGF0YWJhc2UsIG9iamVjdFRvUG9zdCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfWAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob2JqZWN0VG9Qb3N0KVxuICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgfSxcbiAgICBQdXQ6KGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQsIGVkaXRlZE9iamVjdCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShlZGl0ZWRPYmplY3QpXG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIH0sXG4gICAgZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbzogKGRlc2lyZWREYXRhYmFzZSwgdXNlcklkKSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaCAoYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0/X2V4cGFuZD11c2VyJnVzZXJJZD0ke3VzZXJJZH1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFQSU1hbmFnZXIiLCJjb25zdCBhcnRpY2xlTW9kdWxlID0ge1xuICAgIGJ1aWxkQXJ0aWNsZUZvcm06IChhcnRpY2xlSWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGA8Zm9ybSBpZD1cImFydGljbGVGb3JtXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJhcnRpY2xlSWRcIiB2YWx1ZT1cIiR7YXJ0aWNsZUlkfVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVUaXRsZVwiPkFydGljbGUgVGl0bGU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVRpdGxlXCIgaWQ9XCJhcnRpY2xlVGl0bGVcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVN1bW1hcnlcIj5BcnRpY2xlIFN1bW1hcnk6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVN1bW1hcnlcIiBpZD1cImFydGljbGVTdW1tYXJ5XCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVVUkxcIj5BcnRpY2xlIFVSTDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlVVJMXCIgaWQ9XCJhcnRpY2xlVVJMXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWNyZWF0ZVwiPlBvc3QgWW91ciBBcnRpY2xlPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5gXG4gICAgfSxcbiAgICBjcmVhdGVBcnRpY2xlT2JqZWN0OiAoKSA9PiB7XG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVRpdGxlXCIpLnZhbHVlO1xuICAgICAgICBsZXQgc3VtbWFyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVN1bW1hcnlcIikudmFsdWU7XG4gICAgICAgIGxldCB1cmwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVVUkxcIikudmFsdWU7XG4gICAgICAgIC8vIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcbiAgICAgICAgY29uc3QgdXNlcklkID0gMTtcbiAgICAgICAgLy8gbGV0IGFydGljbGVJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGFydGljbGVPYmplY3QgPSB7XG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBzdW1tYXJ5OiBzdW1tYXJ5LFxuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFydGljbGVPYmplY3RcblxuICAgIH0sXG4gICAgY3JlYXRlQXJ0aWNsZUhUTUw6IChhcnRpY2xlT2JqZWN0LCB1c2VySWQpID0+IHtcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYDxzZWN0aW9uIGNsYXNzPVwiYXJ0aWNsZXNcIiBpZD1cImFydGljbGUtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFydGljbGVUaXRsZVwiPiR7YXJ0aWNsZU9iamVjdC50aXRsZX08L2Rpdj5cbiAgICAgICAgPHA+JHthcnRpY2xlT2JqZWN0LnN1bW1hcnl9PC9wPlxuICAgICAgICA8cD48YSBocmVmPVwiaHR0cDovLyR7YXJ0aWNsZU9iamVjdC51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHthcnRpY2xlT2JqZWN0LnVybH08L2E+PC9wPlxuICAgICAgICBgXG5cbiAgICAgICAgaWYgKGFydGljbGVPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWVkaXQtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1kZWxldGUtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9zZWN0aW9uPjxoci8+XCJcblxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcbiAgICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBhcnRpY2xlTW9kdWxlIiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XG5cbmNvbnN0IGNoYXRzTW9kdWxlID0ge1xuICAgIGJ1aWxkQ2hhdHNGb3JtOiAoY2hhdElkKSA9PiB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdHNGb3JtXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY2hhdElkXCIgdmFsdWU9XCIke2NoYXRJZH1cIj48L2lucHV0PlxuICAgICAgICAgICAgICAgIEVudGVyIHlvdXIgbWVzc2FnZTo8L2JyPlxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiNFwiIGNvbHM9XCI1MFwiIG5hbWU9XCJjaGF0TWVzc2FnZVwiIGlkPVwiY2hhdC0tdGV4dElucHV0XCI+PC90ZXh0YXJlYT48L2JyPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tY3JlYXRlXCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgIH0sXG4gICAgYnVpbGRDaGF0c09iamVjdDogKCkgPT4ge1xuICAgICAgICBjb25zdCBjaGF0c09iamVjdCA9IHt9XG4gICAgICAgIGNoYXRzT2JqZWN0LnRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtLXRleHRJbnB1dFwiKS52YWx1ZVxuICAgICAgICBjaGF0c09iamVjdC50aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgICAgIC8vIGNoYXRzT2JqZWN0LnVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKVxuICAgICAgICBjaGF0c09iamVjdC51c2VySWQgPSAxO1xuICAgICAgICByZXR1cm4gY2hhdHNPYmplY3RcbiAgICB9LFxuICAgIGJ1aWxkQ2hhdHNIVE1MOiAoY2hhdE9iamVjdCwgdXNlcklkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYXRUaW1lc3RhbXAgPSB0aW1lQ29udmVydGVyKGNoYXRPYmplY3QudGltZXN0YW1wKVxuXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0c1wiIGlkPVwiY2hhdC0tJHtjaGF0T2JqZWN0LmlkfVwiXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjaGF0VGV4dENvbnRlbnRcIj4ke2NoYXRPYmplY3QudGV4dH08L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjaGF0U3ViVGV4dFwiPlBvc3RlZCBieSAke2NoYXRPYmplY3QudXNlci51c2VybmFtZX0gb24gJHtjaGF0VGltZXN0YW1wfTwvcD5cbiAgICAgICAgYFxuXG4gICAgICAgIGlmIChjaGF0T2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1lZGl0LS0ke2NoYXRPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0cy0tZGVsZXRlLS0ke2NoYXRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XG4gICAgICAgICAgICBgXG4gICAgICAgIH1cblxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvZGl2Pjxoci8+XCJcblxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNoYXRzTW9kdWxlIiwiaW1wb3J0IEFQSU1hbmFnZXIgZnJvbSBcIi4vQVBJTWFuYWdlclwiXG5pbXBvcnQgcHJpbnRUb0RPTSBmcm9tIFwiLi9wcmludFRvRE9NXCI7XG5pbXBvcnQgY2hhdHNNb2R1bGUgZnJvbSBcIi4vY2hhdHNcIjtcbmltcG9ydCBhcnRpY2xlTW9kdWxlIGZyb20gXCIuL2FydGljbGVcIlxuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIlxuaW1wb3J0IHRhc2tzTW9kdWxlIGZyb20gXCIuL3Rhc2tcIlxuXG5jb25zdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgPSAoKSA9PiB7XG4gICAgLy8gTkVFRCBUTyBCRSBDSEFOR0VEIFRPIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcbiAgICBjb25zdCB1c2VySWQgPSAxXG4gICAgLy9cbiAgICBjb25zdCBjaGF0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0RGlzcGxheVwiKVxuICAgIGNvbnN0IGFydGljbGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFydGljbGVEaXNwbGF5XCIpXG4gICAgY29uc3QgZXZlbnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW50RGlzcGxheVwiKVxuICAgIGNvbnN0IHRhc2tDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhc2tEaXNwbGF5XCIpXG4gICAgY29uc3QgZnJpZW5kQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcmllbmREaXNwbGF5XCIpXG4gICAgY2hhdENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXG4gICAgYXJ0aWNsZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXG4gICAgZXZlbnRDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxuICAgIHRhc2tDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxuICAgIGZyaWVuZENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiY2hhdHNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGNoYXRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRNZXNzYWdlID0gY2hhdHNbaV1cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VIVE1MID0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwoY3VycmVudE1lc3NhZ2UsIHVzZXJJZClcbiAgICAgICAgICAgIHByaW50VG9ET00obWVzc2FnZUhUTUwsIFwiI1wiICsgY2hhdENvbnRhaW5lci5pZClcbiAgICAgICAgfVxuICAgIH0pXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiYXJ0aWNsZXNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGFydGljbGVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRBcnRpY2xlID0gYXJ0aWNsZXNbaV1cbiAgICAgICAgICAgIGNvbnN0IGFydGljbGVIVE1MID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChjdXJyZW50QXJ0aWNsZSwgdXNlcklkKVxuICAgICAgICAgICAgcHJpbnRUb0RPTShhcnRpY2xlSFRNTCwgXCIjXCIgKyBhcnRpY2xlQ29udGFpbmVyLmlkKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJldmVudHNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV2ZW50ID0gZXZlbnRzW2ldXG4gICAgICAgICAgICBjb25zdCBldmVudEhUTUwgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGN1cnJlbnRFdmVudCwgdXNlcklkKVxuICAgICAgICAgICAgcHJpbnRUb0RPTShldmVudEhUTUwsIFwiI1wiICsgZXZlbnRDb250YWluZXIuaWQpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcInRhc2tzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbih0YXNrcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VGFzayA9IHRhc2tzW2ldXG4gICAgICAgICAgICBjb25zdCB0YXNrSFRNTCA9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwoY3VycmVudFRhc2ssIHVzZXJJZClcbiAgICAgICAgICAgIHByaW50VG9ET00odGFza0hUTUwsIFwiI1wiICsgdGFza0NvbnRhaW5lci5pZClcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhc2hib2FyZFJlZnJlc2hpb25hbCIsIi8qXG5BdXRob3I6IFBhbnlhXG5UYXNrOiBsaXN0ZW4gdG8gdGhlIGJvZHkgb2YgdGhlIHBhZ2UgZm9yIGNsaWNrcywgYW5kIGNhbGwgb3RoZXIgbWV0aG9kcyBiYXNlZCBvbiB0aGUgdGFyZ2V0IG9mIHRoZSBjbGlja1xuKi9cblxuaW1wb3J0IEFQSU1hbmFnZXIgZnJvbSBcIi4vQVBJTWFuYWdlclwiO1xuaW1wb3J0IHByaW50VG9ET00gZnJvbSBcIi4vcHJpbnRUb0RPTVwiO1xuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIjtcbmltcG9ydCBjaGF0c01vZHVsZSBmcm9tIFwiLi9jaGF0c1wiO1xuaW1wb3J0IHRhc2tzTW9kdWxlIGZyb20gXCIuL3Rhc2tcIjtcbmltcG9ydCBhcnRpY2xlTW9kdWxlIGZyb20gXCIuL2FydGljbGVcIjtcbmltcG9ydCByZWdpc3RyYXRpb25IYW5kbGVyIGZyb20gXCIuL3JlZ2lzdHJhdGlvblwiO1xuXG5jb25zdCBjbGlja0J1YmJsZXIgPSB7XG4gICAgbGlzdGVuZXI6ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXNoYm9hcmRDb250YWluZXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiQlVUVE9OXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRMaXN0ID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIik7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2hlcmUgPSBgIyR7dGFyZ2V0TGlzdFswXX1EaXNwbGF5YDtcbiAgICAgICAgICAgICAgICBsZXQgbmV3T2JqZWN0ID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldElkID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBldmVudHNNb2R1bGUuYnVpbGRFbnRyeUZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzRm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFzayc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IHRhc2tzTW9kdWxlLnRhc2tGb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gYXJ0aWNsZU1vZHVsZS5idWlsZEFydGljbGVGb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXNoYm9hcmRDb250YWluZXJcIikuaW5uZXJIVE1MID0gbmV3SFRNTHN0cmluZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgY29ycmVjdCBvYmplY3QgZmFjdG9yeSBiYXNlZCBvbiB0YXJnZXRMaXN0WzBdLCB3aGljaCBzaG91bGQgY29udGFpbiB0aGUgbW9kdWxlIG5hbWUgKGkuZS4gJ2V2ZW50cycpXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gdGFza3NNb2R1bGUuY2FwdHVyZUZvcm1WYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGNhbGwgdGhlIGFwaSBjcmVhdGUgbWV0aG9kIGFuZCBwYXNzIGl0IHRoZSBuZXcgb2JqZWN0IGFuZCB0aGUgbW9kdWxlIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5Qb3N0KHRhcmdldExpc3RbMF0sIG5ld09iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxuICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0hUTUxzdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKG9iamVjdEFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKG9iamVjdEFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwob2JqZWN0QXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChvYmplY3RBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiZWRpdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgdGhlIGNvcnJlY3Qgb2JqZWN0IGZhY3RvcnkgYmFzZWQgb24gdGFyZ2V0TGlzdFswXSwgd2hpY2ggc2hvdWxkIGNvbnRhaW4gdGhlIG1vZHVsZSBuYW1lIChpLmUuICdldmVudHMnKVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjaGF0cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c09iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gdGFza3NNb2R1bGUuY2FwdHVyZUZvcm1WYWx1ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb2JqZWN0SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdhcnRpY2xlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0ID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGNhbGwgdGhlIGFwaSBlZGl0IG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbmV3IG9iamVjdCwgdGhlIG1vZHVsZSBuYW1lLCBhbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBpZFxuICAgICAgICAgICAgICAgICAgICAvL2Rlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQsIGVkaXRlZE9iamVjdFxuICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLlB1dCh0YXJnZXRMaXN0WzBdLCB0YXJnZXRJZCwgbmV3T2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBjcmVhdGUgSFRNTCBtZXRob2QgZnJvbSB0aGUgY29ycmVjdCBtb2R1bGUsIHVzaW5nIHRoZSByZXR1cm5lZCBQcm9taXNlIGZyb20gYXBpIG1ldGhvZCB0byBmaWxsIGl0XG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gZXZlbnRzTW9kdWxlLmNyZWF0ZUV2ZW50SFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gdGFza3NNb2R1bGUudGFza1RvSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZUhUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHByaW50VG9Eb20oKSBhbmQgcGFzcyBpdCB0aGUgbmV3IEhUTUwgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldExpc3RbMV0gPT09IFwiZGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgYXBpIGRlbGV0ZSBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG1vZHVsZSBuYW1lIGFuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IGlkXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvYmplY3RJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuZGVsZXRlKHRhcmdldExpc3RbMF0sIGV2ZW50SWQpXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGFwaSBsaXN0IG1ldGhvZCwgcGFzc2luZyBpdCB0aGUgY29ycmVjdCBtb2R1bGUgYW5kIHVzZXJpZFxuICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLmdldEJ5VXNlcklkKHRhcmdldExpc3RbMF0sIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgY3JlYXRlIEhUTUwgbWV0aG9kIGZyb20gdGhlIGNvcnJlY3QgbW9kdWxlLCB1c2luZyB0aGUgcmV0dXJuZWQgUHJvbWlzZSBmcm9tIGFwaSBtZXRob2QgdG8gZmlsbCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFza3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW50VG9ET00obmV3SFRNTHN0cmluZywgd2hlcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgcmVnaXN0ZXI6ICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZWdpc3RyYXRpb24tLWNyZWF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgICAgZXZlbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3T2JqZWN0ID0gcmVnaXN0cmF0aW9uSGFuZGxlci5jcmVhdGVSZWdpc3RyYXRpb25PYmplY3QoKTtcbiAgICAgICAgICAgIEFQSU1hbmFnZXIuUG9zdChcInVzZXJzXCIsIG5ld09iamVjdClcbiAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZCA9IG9iamVjdEFycmF5LmlkO1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHVzZXJJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWNrQnViYmxlcjsiLCIvKlxuQXV0aG9yOiBQYW55YVxuVGFzazogaGFuZGxlcyBhbGwgZnVuY3Rpb25zIHNwZWNpZmljIHRvIHRoZSBldmVudHMgbGlzdGluZyBpbiBOdXRzaGVsbFxuKi9cblxuaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XG5cbmNvbnN0IGV2ZW50c01vZHVsZSA9IHtcbiAgICBidWlsZEVudHJ5Rm9ybTogZXZlbnRJZCA9PiB7XG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJldmVudEZvcm1cIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImV2ZW50SWRcIiB2YWx1ZT1cIiR7ZXZlbnRJZH1cIj48L2lucHV0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudE5hbWVcIj5OYW1lIG9mIHRoZSBldmVudDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJldmVudE5hbWVcIiBpZD1cImV2ZW50TmFtZVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudERhdGVcIj5EYXRlIG9mIHRoZSBldmVudDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIG5hbWU9XCJldmVudERhdGVcIiBpZD1cImV2ZW50RGF0ZVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudExvY2F0aW9uXCI+TG9jYXRpb24gb2YgdGhlIGV2ZW50OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImV2ZW50TG9jYXRpb25cIiBpZD1cImV2ZW50TG9jYXRpb25cIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJldmVudHMtLWNyZWF0ZVwiPkNyZWF0ZSBOZXcgRXZlbnQ8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPmA7XG4gICAgfSxcbiAgICBjcmVhdGVFdmVudE9iamVjdDogZXZlbnRJZCA9PiB7XG4gICAgICAgIGxldCBuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudE5hbWVcIikudmFsdWU7XG4gICAgICAgIGxldCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudERhdGVcIikudmFsdWU7XG4gICAgICAgIGxldCBsb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRMb2NhdGlvblwiKS52YWx1ZTtcbiAgICAgICAgLy8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xuICAgICAgICBjb25zdCB1c2VySWQgPSAxO1xuICAgICAgICAvLyBldmVudElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50T2JqZWN0ID0ge1xuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV2ZW50T2JqZWN0O1xuICAgICAgICAvLyBpZiAoZXZlbnRJZCAhPT0gXCJcIikge1xuXG4gICAgICAgIC8vIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gfVxuICAgIH0sXG4gICAgY3JlYXRlRXZlbnRIVE1MOiAoZXZlbnRPYmplY3QsIHVzZXJJZCkgPT4ge1xuICAgICAgICBsZXQgdGltZSA9IHRpbWVDb252ZXJ0ZXIoZXZlbnRPYmplY3QuZGF0ZSlcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gIGA8c2VjdGlvbiBjbGFzcz1cImV2ZW50c1wiIGlkPVwiZXZlbnQtLSR7ZXZlbnRPYmplY3QuaWR9XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJldmVudE5hbWVcIj4ke2V2ZW50T2JqZWN0Lm5hbWV9PC9kaXY+XG4gICAgICAgIDxwPiR7dGltZX08L3A+XG4gICAgICAgIDxwPiR7ZXZlbnRPYmplY3QubG9jYXRpb259PC9wPlxuICAgICAgICA8L3NlY3Rpb24+YDtcblxuICAgICAgICBpZiAoZXZlbnRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1lZGl0LS0ke2V2ZW50T2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1kZWxldGUtLSR7ZXZlbnRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XG4gICAgICAgICAgICBgXG4gICAgICAgIH1cblxuICAgICAgICBiYXNlSFRNTCArPSBcIjxoci8+XCJcblxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcbiAgICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBldmVudHNNb2R1bGU7IiwiaW1wb3J0IGRhc2hib2FyZFJlZnJlc2hpb25hbCBmcm9tIFwiLi9kYXNoYm9hcmRSZWZyZXNoaW9uYWxcIjtcblxuLy8gaW1wb3J0IGV2ZW50IGxpc3RlbmVycyBtb2R1bGUgZnJvbSBcIi4vZXZlbnRsaXN0ZW5lcnNcIlxuXG4vLyBoZWxsbyB3b3JsZFxuXG5pbXBvcnQgY2xpY2tCdWJibGVyIGZyb20gXCIuL2V2ZW50TGlzdGVuZXJzXCI7XG5pbXBvcnQgcmVnaXN0cmF0aW9uSGFuZGxlciBmcm9tIFwiLi9yZWdpc3RyYXRpb25cIjtcblxubGV0IHVzZXJJZCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VySWRcIik7XG5pZiAodXNlcklkICE9PSBudWxsKSB7XG4gICAgZGFzaGJvYXJkUmVmcmVzaGlvbmFsKClcbiAgICBjbGlja0J1YmJsZXIubGlzdGVuZXIoKTtcbn0gZWxzZSB7XG4gICAgY29uc3QgSFRNTGNvZGUgPSByZWdpc3RyYXRpb25IYW5kbGVyLmJ1aWxkUmVnaXN0cmF0aW9uRm9ybSgpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGFzaGJvYXJkQ29udGFpbmVyXCIpLmlubmVySFRNTCA9IEhUTUxjb2RlO1xuICAgIGNsaWNrQnViYmxlci5yZWdpc3RlcigpO1xufVxuXG4iLCJjb25zdCBwcmludFRvRE9NID0gKHdoYXQsIHdoZXJlKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHt3aGVyZX1gKS5pbm5lckhUTUwgKz0gd2hhdFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHByaW50VG9ET007XG4iLCJjb25zdCByZWdpc3RyYXRpb25Mb2dpbkhhbmRsZXIgPSB7XG4gICAgYnVpbGRSZWdpc3RyYXRpb25Gb3JtOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJyZWdpc3RyYXRpb25Gb3JtXCI+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJlbWFpbFwiPkVtYWlsOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIiBpZD1cImVtYWlsXCI+PC9pbnB1dD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJuYW1lXCI+VXNlcm5hbWU6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ1c2VybmFtZVwiIGlkPVwidXNlcm5hbWVcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlyc3ROYW1lXCI+Rmlyc3QgTmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImZpcnN0TmFtZVwiIGlkPVwiZmlyc3ROYW1lXCI+PC9pbnB1dD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhc3ROYW1lXCI+TGFzdCBOYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibGFzdE5hbWVcIiBpZD1cImxhc3ROYW1lXCI+PC9pbnB1dD5cbiAgICAgICAgPGJ1dHRvbiBpZD1cInJlZ2lzdHJhdGlvbi0tY3JlYXRlXCI+UmVnaXN0ZXI8L2J1dHRvbj5cbiAgICAgICAgYFxuICAgIH0sXG4gICAgY3JlYXRlUmVnaXN0cmF0aW9uT2JqZWN0OiAoKSA9PiB7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXNlcm5hbWVcIikudmFsdWVcbiAgICAgICAgbGV0IHBhc3N3b3JkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwYXNzd29yZFwiKS52YWx1ZVxuICAgICAgICBsZXQgZmlyc3ROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmaXJzdE5hbWVcIikudmFsdWVcbiAgICAgICAgbGV0IGxhc3ROYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsYXN0TmFtZVwiKS52YWx1ZVxuICAgICAgICBsZXQgZW1haWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VtYWlsXCIpLnZhbHVlXG5cbiAgICAgICAgY29uc3QgdXNlck9iamVjdCA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VyT2JqZWN0XG4gICAgfSxcbiAgICBidWlsZExvZ2luRm9ybTogKCkgPT4ge1xuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwibG9naW5Gb3JtXCI+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2VybmFtZVwiPlVzZXJuYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibG9naW5Vc2VybmFtZVwiIGlkPVwibG9naW5Vc2VybmFtZVwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgbmFtZT1cImxvZ2luUGFzc3dvcmRcIiBpZD1cImxvZ2luUGFzc3dvcmRcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgIDxidXR0b24gaWQ9XCJsb2dpblwiPkxvZ2luPC9idXR0b24+XG4gICAgICAgIGBcbiAgICB9LFxuICAgIGNyZWF0ZUxvZ2luT2JqZWN0OiAoKSA9PiB7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbG9naW5Vc2VybmFtZVwiKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xvZ2luUGFzc3dvcmRcIikudmFsdWVcblxuICAgICAgICBjb25zdCB1c2VyTG9naW5PYmplY3QgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlckxvZ2luT2JqZWN0XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlZ2lzdHJhdGlvbkxvZ2luSGFuZGxlciIsImltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xuXG5jb25zdCB0YXNrc01vZHVsZSA9IHtcbiAgICB0YXNrVG9IVE1MOiBmdW5jdGlvbiAodGFza09iamVjdCwgdXNlcklkKSB7XG4gICAgICAgIGNvbnN0IHRhc2tUaW1lc3RhbXAgPSB0aW1lQ29udmVydGVyKHRhc2tPYmplY3QuY29tcGxldGlvbl9kYXRlKVxuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInRhc2tzXCIgaWQ9XCJ0YXNrLS0ke3Rhc2tPYmplY3QuaWR9PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2tOYW1lXCI+JHt0YXNrT2JqZWN0Lm5hbWV9PC9kaXY+XG4gICAgICAgICAgICA8cCBpZD1cImNvbXBsZXRpb25fZGF0ZVwiPiR7dGFza1RpbWVzdGFtcH08L3A+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiaXNfY29tcGxldGVcIiBpZD1cInRhc2tfY29tcGxldGVcIj4ke3Rhc2tPYmplY3QuaXNfY29tcGxldGV9PC9sYWJlbD5cbiAgICAgICAgYFxuXG4gICAgICAgIGlmICh0YXNrT2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1lZGl0LS0ke3Rhc2tPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ0YXNrcy0tZGVsZXRlLS0ke3Rhc2tPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XG4gICAgICAgICAgICBgXG4gICAgICAgIH1cblxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvc2VjdGlvbj48aHIvPlwiXG5cbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXG4gICAgfSxcbiAgICB0YXNrRm9ybTogZnVuY3Rpb24gKG9iamVjdElkKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJ1c2VySWRcIiB2YWx1ZT1cIiR7b2JqZWN0SWR9XCI+PGJyPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm5hbWVcIj5OYW1lIG9mIHRhc2s6IDwvbGFiZWw+PGJyPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUYXNrIG5hbWVcIiBpZD1cInRhc2tOYW1lXCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29tcGxldGlvbl9kYXRlXCI+RGF0ZSB0byBiZSBjb21wbGV0ZWQgYnk6IDwvbGFiZWw+PGJyPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJ0YXNrRGF0ZVwiPlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWw+SXMgdGFzayBjb21wbGV0ZTogPC9sYWJlbD48YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ0YXNrQ29tcGxldGVcIiB2YWx1ZT1cIlllc1wiPlllczxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInRhc2tDb21wbGV0ZVwiIHZhbHVlPVwiTm9cIj5Obzxicj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1jcmVhdGVcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgYFxuICAgIH0sXG4gICAgY2FwdHVyZUZvcm1WYWx1ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgdGFza09iamVjdCA9IHtcbiAgICAgICAgICAgIG5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza05hbWVcIikudmFsdWUsXG4gICAgICAgICAgICBjb21wbGV0aW9uX2RhdGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza0RhdGVcIikudmFsdWUsXG4gICAgICAgICAgICBpc19jb21wbGV0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrQ29tcGxldGVcIikudmFsdWUsXG4gICAgICAgICAgICAvL3VzZXJJZDogV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VySWRcIilcbiAgICAgICAgICAgIHVzZXJJZDogMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXNrT2JqZWN0XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB0YXNrc01vZHVsZSIsImZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIgKHRpbWVzdGFtcCkge1xuICAgIHZhciBhID0gbmV3IERhdGUocGFyc2VJbnQodGltZXN0YW1wKSk7XG4gICAgdmFyIG1vbnRocyA9IFsnSmFuJywnRmViJywnTWFyJywnQXByJywnTWF5JywnSnVuJywnSnVsJywnQXVnJywnU2VwJywnT2N0JywnTm92JywnRGVjJ107XG4gICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XG4gICAgdmFyIG1vbnRoID0gbW9udGhzW2EuZ2V0TW9udGgoKV07XG4gICAgdmFyIGRhdGUgPSBhLmdldERhdGUoKTtcbiAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcbiAgICB2YXIgbWluID0gYS5nZXRNaW51dGVzKCk7XG4gICAgdmFyIHRpbWUgPSBkYXRlICsgJyAnICsgbW9udGggKyAnICcgKyB5ZWFyICsgJyAnICsgaG91ciArICc6JyArIG1pbjtcbiAgICByZXR1cm4gdGltZTtcbiAgfTtcblxuICBleHBvcnQgZGVmYXVsdCB0aW1lQ29udmVydGVyOyJdfQ==
