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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9ldmVudHNNb2R1bGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3JlZ2lzdHJhdGlvbi5qcyIsIi4uL3NjcmlwdHMvdGFzay5qcyIsIi4uL3NjcmlwdHMvdGltZXN0YW1wcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0EsTUFBTSxVQUFVLEdBQUc7QUFDZixFQUFBLFdBQVcsRUFBRSxDQUFDLGVBQUQsRUFBa0IsTUFBbEIsS0FBNkI7QUFDdEMsV0FBTyxLQUFLLENBQUcseUJBQXdCLGVBQWdCLFlBQVcsTUFBTyxFQUE3RCxDQUFMLENBQ0YsSUFERSxDQUNHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQURWLENBQVA7QUFHSCxHQUxjO0FBTWYsRUFBQSxNQUFNLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLEtBQStCO0FBQ25DLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixJQUFHLFFBQVMsRUFBdEQsRUFBeUQ7QUFDN0QsTUFBQSxNQUFNLEVBQUU7QUFEcUQsS0FBekQsQ0FBWjtBQUdKLEdBVmU7QUFXaEIsRUFBQSxJQUFJLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLEtBQW1DO0FBQ3hDLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixFQUExQyxFQUE2QztBQUNyRCxNQUFBLE1BQU0sRUFBRSxNQUQ2QztBQUVyRCxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRjRDO0FBS3JELE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsWUFBZjtBQUwrQyxLQUE3QyxDQUFMLENBT0YsSUFQRSxDQU9HLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQVBWLENBQVA7QUFRQSxHQXBCZTtBQXFCZixFQUFBLEdBQUcsRUFBQyxDQUFDLGVBQUQsRUFBa0IsUUFBbEIsRUFBNEIsWUFBNUIsS0FBNkM7QUFDN0MsV0FBTyxLQUFLLENBQUUseUJBQXdCLGVBQWdCLElBQUcsUUFBUyxFQUF0RCxFQUF5RDtBQUNqRSxNQUFBLE1BQU0sRUFBRSxLQUR5RDtBQUVqRSxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRndEO0FBS2pFLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsWUFBZjtBQUwyRCxLQUF6RCxDQUFMLENBT04sSUFQTSxDQU9ELEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQVBOLENBQVA7QUFRSCxHQTlCYztBQStCZixFQUFBLHlCQUF5QixFQUFFLENBQUMsZUFBRCxFQUFrQixNQUFsQixLQUE2QjtBQUNwRCxXQUFPLEtBQUssQ0FBRyx5QkFBd0IsZUFBZ0Isd0JBQXVCLE1BQU8sRUFBekUsQ0FBTCxDQUNGLElBREUsQ0FDRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEVixDQUFQO0FBR0g7QUFuQ2MsQ0FBbkI7ZUFzQ2UsVTs7Ozs7Ozs7OztBQ3ZDZixNQUFNLGFBQWEsR0FBRztBQUNsQixFQUFBLGdCQUFnQixFQUFHLFNBQUQsSUFBZTtBQUM3QixXQUFROzJEQUMyQyxTQUFVOzs7Ozs7Ozs7Ozs7OztnQkFEN0Q7QUFnQkgsR0FsQmlCO0FBbUJsQixFQUFBLG1CQUFtQixFQUFFLE1BQU07QUFDdkIsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsZUFBdkIsRUFBd0MsS0FBcEQ7QUFDQSxRQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixpQkFBdkIsRUFBMEMsS0FBeEQ7QUFDQSxRQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixhQUF2QixFQUFzQyxLQUFoRCxDQUh1QixDQUl2Qjs7QUFDQSxVQUFNLE1BQU0sR0FBRyxDQUFmLENBTHVCLENBTXZCOztBQUVBLFVBQU0sYUFBYSxHQUFHO0FBQ2xCLE1BQUEsS0FBSyxFQUFFLEtBRFc7QUFFbEIsTUFBQSxPQUFPLEVBQUUsT0FGUztBQUdsQixNQUFBLEdBQUcsRUFBRSxHQUhhO0FBSWxCLE1BQUEsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFMLEVBSk87QUFLbEIsTUFBQSxNQUFNLEVBQUU7QUFMVSxLQUF0QjtBQVFBLFdBQU8sYUFBUDtBQUVILEdBckNpQjtBQXNDbEIsRUFBQSxpQkFBaUIsRUFBRSxDQUFDLGFBQUQsRUFBZ0IsTUFBaEIsS0FBMkI7QUFDMUMsUUFBSSxRQUFRLEdBQUksMENBQXlDLGFBQWEsQ0FBQyxFQUFHO29DQUM5QyxhQUFhLENBQUMsS0FBTTthQUMzQyxhQUFhLENBQUMsT0FBUTs2QkFDTixhQUFhLENBQUMsR0FBSSxxQkFBb0IsYUFBYSxDQUFDLEdBQUk7U0FIN0U7O0FBTUEsUUFBSSxhQUFhLENBQUMsTUFBZCxLQUF5QixNQUE3QixFQUFxQztBQUNqQyxNQUFBLFFBQVEsSUFBSzs4Q0FDcUIsYUFBYSxDQUFDLEVBQUc7Z0RBQ2YsYUFBYSxDQUFDLEVBQUc7YUFGckQ7QUFJSDs7QUFFRCxJQUFBLFFBQVEsSUFBSSxpQkFBWjtBQUVBLFdBQU8sUUFBUDtBQUNIO0FBdkRpQixDQUF0QjtlQTBEZSxhOzs7Ozs7Ozs7OztBQzFEZjs7OztBQUVBLE1BQU0sV0FBVyxHQUFHO0FBQ2hCLEVBQUEsY0FBYyxFQUFHLE1BQUQsSUFBWTtBQUN4QixXQUFROzs0REFFNEMsTUFBTzs7Ozs7U0FGM0Q7QUFRSCxHQVZlO0FBV2hCLEVBQUEsZ0JBQWdCLEVBQUUsTUFBTTtBQUNwQixVQUFNLFdBQVcsR0FBRyxFQUFwQjtBQUNBLElBQUEsV0FBVyxDQUFDLElBQVosR0FBbUIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLEtBQTlEO0FBQ0EsSUFBQSxXQUFXLENBQUMsU0FBWixHQUF3QixJQUFJLENBQUMsR0FBTCxFQUF4QixDQUhvQixDQUlwQjs7QUFDQSxJQUFBLFdBQVcsQ0FBQyxNQUFaLEdBQXFCLENBQXJCO0FBQ0EsV0FBTyxXQUFQO0FBQ0gsR0FsQmU7QUFtQmhCLEVBQUEsY0FBYyxFQUFFLENBQUMsVUFBRCxFQUFhLE1BQWIsS0FBd0I7QUFDcEMsVUFBTSxhQUFhLEdBQUcsOEJBQWMsVUFBVSxDQUFDLFNBQXpCLENBQXRCO0FBRUEsUUFBSSxRQUFRLEdBQUk7MkNBQ21CLFVBQVUsQ0FBQyxFQUFHOzZDQUNaLFVBQVUsQ0FBQyxJQUFLO21EQUNWLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFFBQVMsT0FBTSxhQUFjO1NBSHhGOztBQU1BLFFBQUksVUFBVSxDQUFDLE1BQVgsS0FBc0IsTUFBMUIsRUFBa0M7QUFDOUIsTUFBQSxRQUFRLElBQUs7MkNBQ2tCLFVBQVUsQ0FBQyxFQUFHOzZDQUNaLFVBQVUsQ0FBQyxFQUFHO2FBRi9DO0FBSUg7O0FBRUQsSUFBQSxRQUFRLElBQUksYUFBWjtBQUVBLFdBQU8sUUFBUDtBQUNIO0FBdENlLENBQXBCO2VBeUNlLFc7Ozs7Ozs7Ozs7O0FDM0NmOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTSxxQkFBcUIsR0FBRyxNQUFNO0FBQ2hDO0FBQ0EsUUFBTSxNQUFNLEdBQUcsQ0FBZixDQUZnQyxDQUdoQzs7QUFDQSxRQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixhQUF4QixDQUF0QjtBQUNBLFFBQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQXpCO0FBQ0EsUUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBdkI7QUFDQSxRQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixhQUF4QixDQUF0QjtBQUNBLFFBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGVBQXhCLENBQXhCO0FBQ0EsRUFBQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQUExQjtBQUNBLEVBQUEsZ0JBQWdCLENBQUMsU0FBakIsR0FBNkIsRUFBN0I7QUFDQSxFQUFBLGNBQWMsQ0FBQyxTQUFmLEdBQTJCLEVBQTNCO0FBQ0EsRUFBQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQUExQjtBQUNBLEVBQUEsZUFBZSxDQUFDLFNBQWhCLEdBQTRCLEVBQTVCOztBQUNBLHNCQUFXLHlCQUFYLENBQXFDLE9BQXJDLEVBQThDLE1BQTlDLEVBQXNELElBQXRELENBQTJELFVBQVMsS0FBVCxFQUFnQjtBQUN2RSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUExQixFQUFrQyxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFlBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFELENBQTVCOztBQUNBLFlBQU0sV0FBVyxHQUFHLGVBQVksY0FBWixDQUEyQixjQUEzQixFQUEyQyxNQUEzQyxDQUFwQjs7QUFDQSwrQkFBVyxXQUFYLEVBQXdCLE1BQU0sYUFBYSxDQUFDLEVBQTVDO0FBQ0g7QUFDSixHQU5EOztBQU9BLHNCQUFXLHlCQUFYLENBQXFDLFVBQXJDLEVBQWlELE1BQWpELEVBQXlELElBQXpELENBQThELFVBQVMsUUFBVCxFQUFtQjtBQUM3RSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQTBDO0FBQ3RDLFlBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFELENBQS9COztBQUNBLFlBQU0sV0FBVyxHQUFHLGlCQUFjLGlCQUFkLENBQWdDLGNBQWhDLEVBQWdELE1BQWhELENBQXBCOztBQUNBLCtCQUFXLFdBQVgsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQyxFQUEvQztBQUNIO0FBQ0osR0FORDs7QUFPQSxzQkFBVyx5QkFBWCxDQUFxQyxRQUFyQyxFQUErQyxNQUEvQyxFQUF1RCxJQUF2RCxDQUE0RCxVQUFTLE1BQVQsRUFBaUI7QUFDekUsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBM0IsRUFBbUMsQ0FBQyxFQUFwQyxFQUF3QztBQUNwQyxZQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsQ0FBRCxDQUEzQjs7QUFDQSxZQUFNLFNBQVMsR0FBRyxzQkFBYSxlQUFiLENBQTZCLFlBQTdCLEVBQTJDLE1BQTNDLENBQWxCOztBQUNBLCtCQUFXLFNBQVgsRUFBc0IsTUFBTSxjQUFjLENBQUMsRUFBM0M7QUFDSDtBQUNKLEdBTkQ7O0FBT0Esc0JBQVcseUJBQVgsQ0FBcUMsT0FBckMsRUFBOEMsTUFBOUMsRUFBc0QsSUFBdEQsQ0FBMkQsVUFBUyxLQUFULEVBQWdCO0FBQ3ZFLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQTFCLEVBQWtDLENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsWUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUQsQ0FBekI7O0FBQ0EsWUFBTSxRQUFRLEdBQUcsY0FBWSxVQUFaLENBQXVCLFdBQXZCLEVBQW9DLE1BQXBDLENBQWpCOztBQUNBLCtCQUFXLFFBQVgsRUFBcUIsTUFBTSxhQUFhLENBQUMsRUFBekM7QUFDSDtBQUNKLEdBTkQ7QUFPSCxDQTFDRDs7ZUE0Q2UscUI7Ozs7Ozs7Ozs7O0FDOUNmOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBWEE7Ozs7QUFhQSxNQUFNLFlBQVksR0FBRztBQUNqQixFQUFBLFFBQVEsRUFBRSxNQUFNO0FBQ1osSUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixxQkFBdkIsRUFBOEMsZ0JBQTlDLENBQStELE9BQS9ELEVBQXdFLEtBQUssSUFBSTtBQUM3RSxVQUFJLEtBQUssQ0FBQyxNQUFOLENBQWEsUUFBYixLQUEwQixRQUE5QixFQUF3QztBQUNwQyxjQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLEVBQWIsQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxjQUFNLEtBQUssR0FBSSxJQUFHLFVBQVUsQ0FBQyxDQUFELENBQUksU0FBaEM7QUFDQSxZQUFJLFNBQVMsR0FBRyxFQUFoQjtBQUNBLFlBQUksUUFBUSxHQUFHLEVBQWY7O0FBQ0EsWUFBSSxVQUFVLENBQUMsQ0FBRCxDQUFWLEtBQWtCLEtBQXRCLEVBQTZCO0FBQ3pCLGNBQUksYUFBYSxHQUFHLEVBQXBCOztBQUNBLGtCQUFRLFVBQVUsQ0FBQyxDQUFELENBQWxCO0FBQ0ksaUJBQUssT0FBTDtBQUNJLGNBQUEsYUFBYSxHQUFHLHNCQUFhLGNBQWIsRUFBaEI7QUFDQTs7QUFDSixpQkFBSyxNQUFMO0FBQ0ksY0FBQSxhQUFhLEdBQUcsZUFBWSxjQUFaLEVBQWhCO0FBQ0E7O0FBQ0osaUJBQUssTUFBTDtBQUNJLGNBQUEsYUFBYSxHQUFHLGNBQVksUUFBWixFQUFoQjtBQUNBOztBQUNKLGlCQUFLLFNBQUw7QUFDSSxjQUFBLGFBQWEsR0FBRyxpQkFBYyxnQkFBZCxFQUFoQjtBQUNBO0FBWlI7O0FBY0EsVUFBQSxRQUFRLENBQUMsYUFBVCxDQUF1QixxQkFBdkIsRUFBOEMsU0FBOUMsR0FBMEQsYUFBMUQ7QUFDSCxTQWpCRCxNQWlCTyxJQUFJLFVBQVUsQ0FBQyxDQUFELENBQVYsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDbkM7QUFDQSxrQkFBUSxVQUFVLENBQUMsQ0FBRCxDQUFsQjtBQUNJLGlCQUFLLFFBQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxzQkFBYSxpQkFBYixFQUFaO0FBQ0E7O0FBQ0osaUJBQUssT0FBTDtBQUNJLGNBQUEsU0FBUyxHQUFHLGVBQVksZ0JBQVosRUFBWjtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxjQUFZLGlCQUFaLEVBQVo7QUFDQTs7QUFDSixpQkFBSyxVQUFMO0FBQ0ksY0FBQSxTQUFTLEdBQUcsaUJBQWMsbUJBQWQsRUFBWjtBQUNBO0FBWlIsV0FGbUMsQ0FnQm5DOzs7QUFDQSw4QkFBVyxJQUFYLENBQWdCLFVBQVUsQ0FBQyxDQUFELENBQTFCLEVBQStCLFNBQS9CLEVBQ0E7QUFEQSxXQUVDLElBRkQsQ0FHSSxXQUFXLElBQUk7QUFDWCxZQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCO0FBQ0EsZ0JBQUksYUFBYSxHQUFHLEVBQXBCOztBQUNBLG9CQUFRLFVBQVUsQ0FBQyxDQUFELENBQWxCO0FBQ0ksbUJBQUssUUFBTDtBQUNJLGdCQUFBLGFBQWEsSUFBSSxzQkFBYSxlQUFiLENBQTZCLFdBQTdCLENBQWpCO0FBQ0E7O0FBQ0osbUJBQUssT0FBTDtBQUNJLGdCQUFBLGFBQWEsSUFBSSxlQUFZLGNBQVosQ0FBMkIsV0FBM0IsQ0FBakI7QUFDQTs7QUFDSixtQkFBSyxPQUFMO0FBQ0ksZ0JBQUEsYUFBYSxJQUFJLGNBQVksVUFBWixDQUF1QixXQUF2QixDQUFqQjtBQUNBOztBQUNKLG1CQUFLLFVBQUw7QUFDSSxnQkFBQSxhQUFhLElBQUksaUJBQWMsaUJBQWQsQ0FBZ0MsV0FBaEMsQ0FBakI7QUFDQTtBQVpSLGFBSFcsQ0FpQlg7OztBQUNBLHFDQUFXLGFBQVgsRUFBMEIsS0FBMUI7QUFDSCxXQXRCTDtBQXVCSCxTQXhDTSxNQXdDQSxJQUFJLFVBQVUsQ0FBQyxDQUFELENBQVYsS0FBa0IsTUFBdEIsRUFBOEI7QUFDakM7QUFDQSxrQkFBUSxVQUFVLENBQUMsQ0FBRCxDQUFsQjtBQUNJLGlCQUFLLFFBQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxzQkFBYSxpQkFBYixFQUFaO0FBQ0EsY0FBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBWDtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFNBQVMsR0FBRyxlQUFZLGdCQUFaLEVBQVo7QUFDQSxjQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixTQUF2QixDQUFYO0FBQ0E7O0FBQ0osaUJBQUssT0FBTDtBQUNJLGNBQUEsU0FBUyxHQUFHLGNBQVksaUJBQVosRUFBWjtBQUNBLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLENBQVg7QUFDQTs7QUFDSixpQkFBSyxVQUFMO0FBQ0ksY0FBQSxTQUFTLEdBQUcsaUJBQWMsbUJBQWQsRUFBWjtBQUNBLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQVg7QUFDQTtBQWhCUixXQUZpQyxDQW9CakM7QUFDQTs7O0FBQ0EsOEJBQVcsR0FBWCxDQUFlLFVBQVUsQ0FBQyxDQUFELENBQXpCLEVBQThCLFFBQTlCLEVBQXdDLFNBQXhDLEVBQ0E7QUFEQSxXQUVDLElBRkQsQ0FHSSxXQUFXLElBQUk7QUFDWCxZQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCO0FBQ0EsZ0JBQUksYUFBYSxHQUFHLEVBQXBCO0FBQ0EsWUFBQSxXQUFXLENBQUMsT0FBWixDQUFvQixPQUFPLElBQUk7QUFDM0Isc0JBQVEsVUFBVSxDQUFDLENBQUQsQ0FBbEI7QUFDSSxxQkFBSyxRQUFMO0FBQ0ksa0JBQUEsYUFBYSxJQUFJLHNCQUFhLGVBQWIsQ0FBNkIsT0FBN0IsQ0FBakI7QUFDQTs7QUFDSixxQkFBSyxPQUFMO0FBQ0ksa0JBQUEsYUFBYSxJQUFJLGVBQVksY0FBWixDQUEyQixPQUEzQixDQUFqQjtBQUNBOztBQUNKLHFCQUFLLE9BQUw7QUFDSSxrQkFBQSxhQUFhLElBQUksY0FBWSxVQUFaLENBQXVCLE9BQXZCLENBQWpCO0FBQ0E7O0FBQ0oscUJBQUssVUFBTDtBQUNJLGtCQUFBLGFBQWEsSUFBSSxpQkFBYyxpQkFBZCxDQUFnQyxPQUFoQyxDQUFqQjtBQUNBO0FBWlI7QUFjSCxhQWZELEVBSFcsQ0FtQlg7O0FBQ0EscUNBQVcsYUFBWCxFQUEwQixLQUExQjtBQUNILFdBeEJMO0FBMEJILFNBaERNLE1BZ0RBLElBQUksVUFBVSxDQUFDLENBQUQsQ0FBVixLQUFrQixRQUF0QixFQUFnQztBQUNuQztBQUNBLGtCQUFRLFVBQVUsQ0FBQyxDQUFELENBQWxCO0FBQ0ksaUJBQUssUUFBTDtBQUNJLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQVg7QUFDQTs7QUFDSixpQkFBSyxPQUFMO0FBQ0ksY0FBQSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBWDtBQUNBOztBQUNKLGlCQUFLLE9BQUw7QUFDSSxjQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixXQUF2QixDQUFYO0FBQ0E7O0FBQ0osaUJBQUssVUFBTDtBQUNJLGNBQUEsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFlBQXZCLENBQVg7QUFDQTtBQVpSOztBQWNBLDhCQUFXLE1BQVgsQ0FBa0IsVUFBVSxDQUFDLENBQUQsQ0FBNUIsRUFBaUMsT0FBakMsRUFDQTtBQURBLFdBRUMsSUFGRCxDQUdJLE1BQU07QUFDRixnQ0FBVyxXQUFYLENBQXVCLFVBQVUsQ0FBQyxDQUFELENBQWpDLEVBQXNDLENBQXRDLEVBQ0E7QUFEQSxhQUVDLElBRkQsQ0FHSSxXQUFXLElBQUk7QUFDWCxjQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCO0FBQ0Esa0JBQUksYUFBYSxHQUFHLEVBQXBCO0FBQ0EsY0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixPQUFPLElBQUk7QUFDM0Isd0JBQVEsVUFBVSxDQUFDLENBQUQsQ0FBbEI7QUFDSSx1QkFBSyxRQUFMO0FBQ0ksb0JBQUEsYUFBYSxJQUFJLHNCQUFhLGVBQWIsQ0FBNkIsT0FBN0IsQ0FBakI7QUFDQTs7QUFDSix1QkFBSyxPQUFMO0FBQ0ksb0JBQUEsYUFBYSxJQUFJLGVBQVksY0FBWixDQUEyQixPQUEzQixDQUFqQjtBQUNBOztBQUNKLHVCQUFLLE9BQUw7QUFDSSxvQkFBQSxhQUFhLElBQUksY0FBWSxVQUFaLENBQXVCLE9BQXZCLENBQWpCO0FBQ0E7O0FBQ0osdUJBQUssVUFBTDtBQUNJLG9CQUFBLGFBQWEsSUFBSSxpQkFBYyxpQkFBZCxDQUFnQyxPQUFoQyxDQUFqQjtBQUNBO0FBWlI7QUFjRixlQWZGLEVBSFcsQ0FtQlg7O0FBQ0EsdUNBQVcsYUFBWCxFQUEwQixLQUExQjtBQUNILGFBeEJMO0FBMEJILFdBOUJMO0FBZ0NIO0FBQ0o7QUFDSixLQWpLRDtBQWtLSCxHQXBLZ0I7QUFxS2pCLEVBQUEsUUFBUSxFQUFFLE1BQU07QUFDWixJQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLHVCQUF2QixFQUFnRCxnQkFBaEQsQ0FBaUUsT0FBakUsRUFDQSxLQUFLLElBQUk7QUFDTCxZQUFNLFNBQVMsR0FBRyxzQkFBb0Isd0JBQXBCLEVBQWxCOztBQUNBLDBCQUFXLElBQVgsQ0FBZ0IsT0FBaEIsRUFBeUIsU0FBekIsRUFDQyxJQURELENBRUksV0FBVyxJQUFJO0FBQ1gsWUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLEVBQXpCO0FBQ0EsUUFBQSxjQUFjLENBQUMsT0FBZixDQUF1QixRQUF2QixFQUFpQyxNQUFqQztBQUNILE9BTEw7QUFPSCxLQVZEO0FBV0g7QUFqTGdCLENBQXJCO2VBb0xlLFk7Ozs7Ozs7Ozs7O0FDNUxmOzs7O0FBTEE7Ozs7QUFPQSxNQUFNLFlBQVksR0FBRztBQUNqQixFQUFBLGNBQWMsRUFBRSxPQUFPLElBQUk7QUFDdkIsV0FBUTt5REFDeUMsT0FBUTs7Ozs7Ozs7Ozs7Ozs7Z0JBRHpEO0FBZ0JILEdBbEJnQjtBQW1CakIsRUFBQSxpQkFBaUIsRUFBRSxPQUFPLElBQUk7QUFDMUIsUUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsRUFBcUMsS0FBaEQ7QUFDQSxRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxLQUFoRDtBQUNBLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixFQUF5QyxLQUF4RCxDQUgwQixDQUkxQjs7QUFDQSxVQUFNLE1BQU0sR0FBRyxDQUFmLENBTDBCLENBTTFCOztBQUVBLFVBQU0sV0FBVyxHQUFHO0FBQ2hCLE1BQUEsSUFBSSxFQUFFLElBRFU7QUFFaEIsTUFBQSxJQUFJLEVBQUUsSUFGVTtBQUdoQixNQUFBLFFBQVEsRUFBRSxRQUhNO0FBSWhCLE1BQUEsTUFBTSxFQUFFO0FBSlEsS0FBcEI7QUFPQSxXQUFPLFdBQVAsQ0FmMEIsQ0FnQjFCO0FBRUE7QUFFQTtBQUNILEdBeENnQjtBQXlDakIsRUFBQSxlQUFlLEVBQUUsQ0FBQyxXQUFELEVBQWMsTUFBZCxLQUF5QjtBQUN0QyxRQUFJLElBQUksR0FBRyw4QkFBYyxXQUFXLENBQUMsSUFBMUIsQ0FBWDtBQUNBLFFBQUksUUFBUSxHQUFLLHNDQUFxQyxXQUFXLENBQUMsRUFBRztpQ0FDNUMsV0FBVyxDQUFDLElBQUs7YUFDckMsSUFBSzthQUNMLFdBQVcsQ0FBQyxRQUFTO21CQUgxQjs7QUFNQSxRQUFJLFdBQVcsQ0FBQyxNQUFaLEtBQXVCLE1BQTNCLEVBQW1DO0FBQy9CLE1BQUEsUUFBUSxJQUFLOzRDQUNtQixXQUFXLENBQUMsRUFBRzs4Q0FDYixXQUFXLENBQUMsRUFBRzthQUZqRDtBQUlIOztBQUVELElBQUEsUUFBUSxJQUFJLE9BQVo7QUFFQSxXQUFPLFFBQVA7QUFDSDtBQTNEZ0IsQ0FBckI7ZUE4RGUsWTs7Ozs7O0FDckVmOztBQU1BOztBQUNBOzs7O0FBTEE7QUFFQTtBQUtBLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxPQUFmLENBQXVCLFFBQXZCLENBQWI7O0FBQ0EsSUFBSSxNQUFNLEtBQUssSUFBZixFQUFxQjtBQUNqQjs7QUFDQSwwQkFBYSxRQUFiO0FBQ0gsQ0FIRCxNQUdPO0FBQ0gsUUFBTSxRQUFRLEdBQUcsc0JBQW9CLHFCQUFwQixFQUFqQjs7QUFDQSxFQUFBLFFBQVEsQ0FBQyxhQUFULENBQXVCLHFCQUF2QixFQUE4QyxTQUE5QyxHQUEwRCxRQUExRDs7QUFDQSwwQkFBYSxRQUFiO0FBQ0g7Ozs7Ozs7Ozs7QUNqQkQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFELEVBQU8sS0FBUCxLQUFpQjtBQUNoQyxFQUFBLFFBQVEsQ0FBQyxhQUFULENBQXdCLEdBQUUsS0FBTSxFQUFoQyxFQUFtQyxTQUFuQyxJQUFnRCxJQUFoRDtBQUNILENBRkQ7O2VBS2UsVTs7Ozs7Ozs7OztBQ0xmLE1BQU0sd0JBQXdCLEdBQUc7QUFDN0IsRUFBQSxxQkFBcUIsRUFBRSxNQUFNO0FBQ3pCLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQUFSO0FBc0JILEdBeEI0QjtBQXlCN0IsRUFBQSx3QkFBd0IsRUFBRSxNQUFNO0FBQzVCLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLEVBQW9DLEtBQW5EO0FBQ0EsUUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkIsRUFBb0MsS0FBbkQ7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxLQUFyRDtBQUNBLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFdBQXZCLEVBQW9DLEtBQW5EO0FBQ0EsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUMsS0FBN0M7QUFFQSxVQUFNLFVBQVUsR0FBRztBQUNmLE1BQUEsUUFBUSxFQUFFLFFBREs7QUFFZixNQUFBLFFBQVEsRUFBRSxRQUZLO0FBR2YsTUFBQSxVQUFVLEVBQUUsU0FIRztBQUlmLE1BQUEsU0FBUyxFQUFFLFFBSkk7QUFLZixNQUFBLEtBQUssRUFBRTtBQUxRLEtBQW5CO0FBUUEsV0FBTyxVQUFQO0FBQ0gsR0F6QzRCO0FBMEM3QixFQUFBLGNBQWMsRUFBRSxNQUFNO0FBQ2xCLFdBQVE7Ozs7Ozs7Ozs7U0FBUjtBQVdILEdBdEQ0QjtBQXVEN0IsRUFBQSxpQkFBaUIsRUFBRSxNQUFNO0FBQ3JCLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixFQUF5QyxLQUF4RDtBQUNBLFFBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QixFQUF5QyxLQUF4RDtBQUVBLFVBQU0sZUFBZSxHQUFHO0FBQ3BCLE1BQUEsUUFBUSxFQUFFLFFBRFU7QUFFcEIsTUFBQSxRQUFRLEVBQUU7QUFGVSxLQUF4QjtBQUtBLFdBQU8sZUFBUDtBQUNIO0FBakU0QixDQUFqQztlQXFFZSx3Qjs7Ozs7Ozs7Ozs7QUNyRWY7Ozs7QUFFQSxNQUFNLFdBQVcsR0FBRztBQUNoQixFQUFBLFVBQVUsRUFBRSxVQUFVLFVBQVYsRUFBc0IsTUFBdEIsRUFBOEI7QUFDdEMsVUFBTSxhQUFhLEdBQUcsOEJBQWMsVUFBVSxDQUFDLGVBQXpCLENBQXRCO0FBQ0EsUUFBSSxRQUFRLEdBQUk7K0NBQ3VCLFVBQVUsQ0FBQyxFQUFHO29DQUN6QixVQUFVLENBQUMsSUFBSztzQ0FDZCxhQUFjOzBEQUNNLFVBQVUsQ0FBQyxXQUFZO1NBSnpFOztBQU9BLFFBQUksVUFBVSxDQUFDLE1BQVgsS0FBc0IsTUFBMUIsRUFBa0M7QUFDOUIsTUFBQSxRQUFRLElBQUs7MkNBQ2tCLFVBQVUsQ0FBQyxFQUFHOzZDQUNaLFVBQVUsQ0FBQyxFQUFHO2FBRi9DO0FBSUg7O0FBRUQsSUFBQSxRQUFRLElBQUksaUJBQVo7QUFFQSxXQUFPLFFBQVA7QUFDSCxHQXBCZTtBQXFCaEIsRUFBQSxRQUFRLEVBQUUsVUFBVSxRQUFWLEVBQW9CO0FBQzFCLFdBQVE7O3NEQUVzQyxRQUFTOzs7Ozs7Ozs7Ozs7OztTQUZ2RDtBQWlCSCxHQXZDZTtBQXdDaEIsRUFBQSxpQkFBaUIsRUFBRSxZQUFZO0FBQzNCLFVBQU0sVUFBVSxHQUFHO0FBQ2YsTUFBQSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkIsRUFBb0MsS0FEM0I7QUFFZixNQUFBLGVBQWUsRUFBRSxRQUFRLENBQUMsYUFBVCxDQUF1QixXQUF2QixFQUFvQyxLQUZ0QztBQUdmLE1BQUEsV0FBVyxFQUFFLFFBQVEsQ0FBQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDLEtBSHRDO0FBSWY7QUFDQSxNQUFBLE1BQU0sRUFBRTtBQUxPLEtBQW5CO0FBT0EsV0FBTyxVQUFQO0FBQ0g7QUFqRGUsQ0FBcEI7ZUFvRGUsVzs7Ozs7Ozs7Ozs7QUN0RGYsU0FBUyxhQUFULENBQXdCLFNBQXhCLEVBQW1DO0FBQy9CLE1BQUksQ0FBQyxHQUFHLElBQUksSUFBSixDQUFTLFFBQVEsQ0FBQyxTQUFELENBQWpCLENBQVI7QUFDQSxNQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUQsRUFBTyxLQUFQLEVBQWEsS0FBYixFQUFtQixLQUFuQixFQUF5QixLQUF6QixFQUErQixLQUEvQixFQUFxQyxLQUFyQyxFQUEyQyxLQUEzQyxFQUFpRCxLQUFqRCxFQUF1RCxLQUF2RCxFQUE2RCxLQUE3RCxFQUFtRSxLQUFuRSxDQUFiO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQUYsRUFBWDtBQUNBLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBRixFQUFELENBQWxCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQUYsRUFBWDtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFGLEVBQVg7QUFDQSxNQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBRixFQUFWO0FBQ0EsTUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQVAsR0FBYSxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCLElBQTNCLEdBQWtDLEdBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQS9DLEdBQXFELEdBQWhFO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBQUE7ZUFFYyxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG5jb25zdCBBUElNYW5hZ2VyID0ge1xuICAgIGdldEJ5VXNlcklkOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fdXNlcklkPSR7dXNlcklkfWApXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICAgIH0sXG4gICAgZGVsZXRlOiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gICB9LFxuICAgUG9zdDogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0VG9Qb3N0KSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9YCwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvYmplY3RUb1Bvc3QpXG4gICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICB9LFxuICAgIFB1dDooZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCwgZWRpdGVkT2JqZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGVkaXRlZE9iamVjdClcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfSxcbiAgICBmZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fZXhwYW5kPXVzZXImdXNlcklkPSR7dXNlcklkfWApXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcblxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJTWFuYWdlciIsImNvbnN0IGFydGljbGVNb2R1bGUgPSB7XG4gICAgYnVpbGRBcnRpY2xlRm9ybTogKGFydGljbGVJZCkgPT4ge1xuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiYXJ0aWNsZUZvcm1cIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImFydGljbGVJZFwiIHZhbHVlPVwiJHthcnRpY2xlSWR9XCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVRpdGxlXCI+QXJ0aWNsZSBUaXRsZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlVGl0bGVcIiBpZD1cImFydGljbGVUaXRsZVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlU3VtbWFyeVwiPkFydGljbGUgU3VtbWFyeTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlU3VtbWFyeVwiIGlkPVwiYXJ0aWNsZVN1bW1hcnlcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVVSTFwiPkFydGljbGUgVVJMOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVVUkxcIiBpZD1cImFydGljbGVVUkxcIj48L2lucHV0PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tY3JlYXRlXCI+UG9zdCBZb3VyIEFydGljbGU8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPmBcbiAgICB9LFxuICAgIGNyZWF0ZUFydGljbGVPYmplY3Q6ICgpID0+IHtcbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlVGl0bGVcIikudmFsdWU7XG4gICAgICAgIGxldCBzdW1tYXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlU3VtbWFyeVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IHVybCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVVSTFwiKS52YWx1ZTtcbiAgICAgICAgLy8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xuICAgICAgICBjb25zdCB1c2VySWQgPSAxO1xuICAgICAgICAvLyBsZXQgYXJ0aWNsZUlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIikudmFsdWU7XG5cbiAgICAgICAgY29uc3QgYXJ0aWNsZU9iamVjdCA9IHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHN1bW1hcnk6IHN1bW1hcnksXG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJ0aWNsZU9iamVjdFxuXG4gICAgfSxcbiAgICBjcmVhdGVBcnRpY2xlSFRNTDogKGFydGljbGVPYmplY3QsIHVzZXJJZCkgPT4ge1xuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgPHNlY3Rpb24gY2xhc3M9XCJhcnRpY2xlc1wiIGlkPVwiYXJ0aWNsZS0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYXJ0aWNsZVRpdGxlXCI+JHthcnRpY2xlT2JqZWN0LnRpdGxlfTwvZGl2PlxuICAgICAgICA8cD4ke2FydGljbGVPYmplY3Quc3VtbWFyeX08L3A+XG4gICAgICAgIDxwPjxhIGhyZWY9XCJodHRwOi8vJHthcnRpY2xlT2JqZWN0LnVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FydGljbGVPYmplY3QudXJsfTwvYT48L3A+XG4gICAgICAgIGBcblxuICAgICAgICBpZiAoYXJ0aWNsZU9iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhcnRpY2xlcy0tZWRpdC0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPkVkaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWRlbGV0ZS0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxuICAgICAgICAgICAgYFxuICAgICAgICB9XG5cbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L3NlY3Rpb24+PGhyLz5cIlxuXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFydGljbGVNb2R1bGUiLCJpbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcblxuY29uc3QgY2hhdHNNb2R1bGUgPSB7XG4gICAgYnVpbGRDaGF0c0Zvcm06IChjaGF0SWQpID0+IHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjaGF0c0Zvcm1cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjaGF0SWRcIiB2YWx1ZT1cIiR7Y2hhdElkfVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICAgICAgRW50ZXIgeW91ciBtZXNzYWdlOjwvYnI+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIHJvd3M9XCI0XCIgY29scz1cIjUwXCIgbmFtZT1cImNoYXRNZXNzYWdlXCIgaWQ9XCJjaGF0LS10ZXh0SW5wdXRcIj48L3RleHRhcmVhPjwvYnI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1jcmVhdGVcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgfSxcbiAgICBidWlsZENoYXRzT2JqZWN0OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoYXRzT2JqZWN0ID0ge31cbiAgICAgICAgY2hhdHNPYmplY3QudGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhdC0tdGV4dElucHV0XCIpLnZhbHVlXG4gICAgICAgIGNoYXRzT2JqZWN0LnRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICAgICAgLy8gY2hhdHNPYmplY3QudXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpXG4gICAgICAgIGNoYXRzT2JqZWN0LnVzZXJJZCA9IDE7XG4gICAgICAgIHJldHVybiBjaGF0c09iamVjdFxuICAgIH0sXG4gICAgYnVpbGRDaGF0c0hUTUw6IChjaGF0T2JqZWN0LCB1c2VySWQpID0+IHtcbiAgICAgICAgY29uc3QgY2hhdFRpbWVzdGFtcCA9IHRpbWVDb252ZXJ0ZXIoY2hhdE9iamVjdC50aW1lc3RhbXApXG5cbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoYXRzXCIgaWQ9XCJjaGF0LS0ke2NoYXRPYmplY3QuaWR9XCJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNoYXRUZXh0Q29udGVudFwiPiR7Y2hhdE9iamVjdC50ZXh0fTwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNoYXRTdWJUZXh0XCI+UG9zdGVkIGJ5ICR7Y2hhdE9iamVjdC51c2VyLnVzZXJuYW1lfSBvbiAke2NoYXRUaW1lc3RhbXB9PC9wPlxuICAgICAgICBgXG5cbiAgICAgICAgaWYgKGNoYXRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY2hhdHMtLWVkaXQtLSR7Y2hhdE9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1kZWxldGUtLSR7Y2hhdE9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9kaXY+PGhyLz5cIlxuXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hhdHNNb2R1bGUiLCJpbXBvcnQgQVBJTWFuYWdlciBmcm9tIFwiLi9BUElNYW5hZ2VyXCJcbmltcG9ydCBwcmludFRvRE9NIGZyb20gXCIuL3ByaW50VG9ET01cIjtcbmltcG9ydCBjaGF0c01vZHVsZSBmcm9tIFwiLi9jaGF0c1wiO1xuaW1wb3J0IGFydGljbGVNb2R1bGUgZnJvbSBcIi4vYXJ0aWNsZVwiXG5pbXBvcnQgZXZlbnRzTW9kdWxlIGZyb20gXCIuL2V2ZW50c01vZHVsZVwiXG5pbXBvcnQgdGFza3NNb2R1bGUgZnJvbSBcIi4vdGFza1wiXG5cbmNvbnN0IGRhc2hib2FyZFJlZnJlc2hpb25hbCA9ICgpID0+IHtcbiAgICAvLyBORUVEIFRPIEJFIENIQU5HRUQgVE8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xuICAgIGNvbnN0IHVzZXJJZCA9IDFcbiAgICAvL1xuICAgIGNvbnN0IGNoYXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXREaXNwbGF5XCIpXG4gICAgY29uc3QgYXJ0aWNsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJ0aWNsZURpc3BsYXlcIilcbiAgICBjb25zdCBldmVudENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXZlbnREaXNwbGF5XCIpXG4gICAgY29uc3QgdGFza0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFza0Rpc3BsYXlcIilcbiAgICBjb25zdCBmcmllbmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyaWVuZERpc3BsYXlcIilcbiAgICBjaGF0Q29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcbiAgICBhcnRpY2xlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcbiAgICBldmVudENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXG4gICAgdGFza0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXG4gICAgZnJpZW5kQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJjaGF0c1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oY2hhdHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudE1lc3NhZ2UgPSBjaGF0c1tpXVxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZUhUTUwgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChjdXJyZW50TWVzc2FnZSwgdXNlcklkKVxuICAgICAgICAgICAgcHJpbnRUb0RPTShtZXNzYWdlSFRNTCwgXCIjXCIgKyBjaGF0Q29udGFpbmVyLmlkKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJhcnRpY2xlc1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oYXJ0aWNsZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEFydGljbGUgPSBhcnRpY2xlc1tpXVxuICAgICAgICAgICAgY29uc3QgYXJ0aWNsZUhUTUwgPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVIVE1MKGN1cnJlbnRBcnRpY2xlLCB1c2VySWQpXG4gICAgICAgICAgICBwcmludFRvRE9NKGFydGljbGVIVE1MLCBcIiNcIiArIGFydGljbGVDb250YWluZXIuaWQpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImV2ZW50c1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXZlbnQgPSBldmVudHNbaV1cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50SFRNTCA9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoY3VycmVudEV2ZW50LCB1c2VySWQpXG4gICAgICAgICAgICBwcmludFRvRE9NKGV2ZW50SFRNTCwgXCIjXCIgKyBldmVudENvbnRhaW5lci5pZClcbiAgICAgICAgfVxuICAgIH0pXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwidGFza3NcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKHRhc2tzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrID0gdGFza3NbaV1cbiAgICAgICAgICAgIGNvbnN0IHRhc2tIVE1MID0gdGFza3NNb2R1bGUudGFza1RvSFRNTChjdXJyZW50VGFzaywgdXNlcklkKVxuICAgICAgICAgICAgcHJpbnRUb0RPTSh0YXNrSFRNTCwgXCIjXCIgKyB0YXNrQ29udGFpbmVyLmlkKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIiwiLypcbkF1dGhvcjogUGFueWFcblRhc2s6IGxpc3RlbiB0byB0aGUgYm9keSBvZiB0aGUgcGFnZSBmb3IgY2xpY2tzLCBhbmQgY2FsbCBvdGhlciBtZXRob2RzIGJhc2VkIG9uIHRoZSB0YXJnZXQgb2YgdGhlIGNsaWNrXG4qL1xuXG5pbXBvcnQgQVBJTWFuYWdlciBmcm9tIFwiLi9BUElNYW5hZ2VyXCI7XG5pbXBvcnQgcHJpbnRUb0RPTSBmcm9tIFwiLi9wcmludFRvRE9NXCI7XG5pbXBvcnQgZXZlbnRzTW9kdWxlIGZyb20gXCIuL2V2ZW50c01vZHVsZVwiO1xuaW1wb3J0IGNoYXRzTW9kdWxlIGZyb20gXCIuL2NoYXRzXCI7XG5pbXBvcnQgdGFza3NNb2R1bGUgZnJvbSBcIi4vdGFza1wiO1xuaW1wb3J0IGFydGljbGVNb2R1bGUgZnJvbSBcIi4vYXJ0aWNsZVwiO1xuaW1wb3J0IHJlZ2lzdHJhdGlvbkhhbmRsZXIgZnJvbSBcIi4vcmVnaXN0cmF0aW9uXCI7XG5cbmNvbnN0IGNsaWNrQnViYmxlciA9IHtcbiAgICBsaXN0ZW5lcjogKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rhc2hib2FyZENvbnRhaW5lclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJCVVRUT05cIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldExpc3QgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKTtcbiAgICAgICAgICAgICAgICBjb25zdCB3aGVyZSA9IGAjJHt0YXJnZXRMaXN0WzBdfURpc3BsYXlgO1xuICAgICAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgICAgICAgICAgICAgICBsZXQgdGFyZ2V0SWQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRMaXN0WzFdID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IGV2ZW50c01vZHVsZS5idWlsZEVudHJ5Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNGb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nID0gdGFza3NNb2R1bGUudGFza0Zvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgPSBhcnRpY2xlTW9kdWxlLmJ1aWxkQXJ0aWNsZUZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rhc2hib2FyZENvbnRhaW5lclwiKS5pbm5lckhUTUwgPSBuZXdIVE1Mc3RyaW5nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJjcmVhdGVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBjb3JyZWN0IG9iamVjdCBmYWN0b3J5IGJhc2VkIG9uIHRhcmdldExpc3RbMF0sIHdoaWNoIHNob3VsZCBjb250YWluIHRoZSBtb2R1bGUgbmFtZSAoaS5lLiAnZXZlbnRzJylcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSB0YXNrc01vZHVsZS5jYXB0dXJlRm9ybVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdCA9IGFydGljbGVNb2R1bGUuY3JlYXRlQXJ0aWNsZU9iamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gY2FsbCB0aGUgYXBpIGNyZWF0ZSBtZXRob2QgYW5kIHBhc3MgaXQgdGhlIG5ldyBvYmplY3QgYW5kIHRoZSBtb2R1bGUgbmFtZVxuICAgICAgICAgICAgICAgICAgICBBUElNYW5hZ2VyLlBvc3QodGFyZ2V0TGlzdFswXSwgbmV3T2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBjcmVhdGUgSFRNTCBtZXRob2QgZnJvbSB0aGUgY29ycmVjdCBtb2R1bGUsIHVzaW5nIHRoZSByZXR1cm5lZCBQcm9taXNlIGZyb20gYXBpIG1ldGhvZCB0byBmaWxsIGl0XG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwob2JqZWN0QXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwob2JqZWN0QXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gdGFza3NNb2R1bGUudGFza1RvSFRNTChvYmplY3RBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVIVE1MKG9iamVjdEFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHByaW50VG9Eb20oKSBhbmQgcGFzcyBpdCB0aGUgbmV3IEhUTUwgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJlZGl0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgY29ycmVjdCBvYmplY3QgZmFjdG9yeSBiYXNlZCBvbiB0YXJnZXRMaXN0WzBdLCB3aGljaCBzaG91bGQgY29udGFpbiB0aGUgbW9kdWxlIG5hbWUgKGkuZS4gJ2V2ZW50cycpXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0TGlzdFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZXZlbnRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnRJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoYXRzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBjaGF0c01vZHVsZS5idWlsZENoYXRzT2JqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3Rhc2tzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSB0YXNrc01vZHVsZS5jYXB0dXJlRm9ybVZhbHVlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvYmplY3RJZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FydGljbGVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVPYmplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gY2FsbCB0aGUgYXBpIGVkaXQgbWV0aG9kIGFuZCBwYXNzIGl0IHRoZSBuZXcgb2JqZWN0LCB0aGUgbW9kdWxlIG5hbWUsIGFuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IGlkXG4gICAgICAgICAgICAgICAgICAgIC8vZGVzaXJlZERhdGFiYXNlLCBvYmplY3RJZCwgZWRpdGVkT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuUHV0KHRhcmdldExpc3RbMF0sIHRhcmdldElkLCBuZXdPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIC8vIC50aGVuKCkgYW5kIGNhbGwgdGhlIGNyZWF0ZSBIVE1MIG1ldGhvZCBmcm9tIHRoZSBjb3JyZWN0IG1vZHVsZSwgdXNpbmcgdGhlIHJldHVybmVkIFByb21pc2UgZnJvbSBhcGkgbWV0aG9kIHRvIGZpbGwgaXRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhcmdldExpc3RbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBldmVudHNNb2R1bGUuY3JlYXRlRXZlbnRIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gY2hhdHNNb2R1bGUuYnVpbGRDaGF0c0hUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hUTUxzdHJpbmcgKz0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGwgcHJpbnRUb0RvbSgpIGFuZCBwYXNzIGl0IHRoZSBuZXcgSFRNTCBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmludFRvRE9NKG5ld0hUTUxzdHJpbmcsIHdoZXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0TGlzdFsxXSA9PT0gXCJkZWxldGVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBhcGkgZGVsZXRlIG1ldGhvZCBhbmQgcGFzcyBpdCB0aGUgbW9kdWxlIG5hbWUgYW5kIHRoZSBvcmlnaW5hbCBvYmplY3QgaWRcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdldmVudHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0SWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29iamVjdElkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgQVBJTWFuYWdlci5kZWxldGUodGFyZ2V0TGlzdFswXSwgZXZlbnRJZClcbiAgICAgICAgICAgICAgICAgICAgLy8gLnRoZW4oKSBhbmQgY2FsbCB0aGUgYXBpIGxpc3QgbWV0aG9kLCBwYXNzaW5nIGl0IHRoZSBjb3JyZWN0IG1vZHVsZSBhbmQgdXNlcmlkXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFQSU1hbmFnZXIuZ2V0QnlVc2VySWQodGFyZ2V0TGlzdFswXSwgMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAudGhlbigpIGFuZCBjYWxsIHRoZSBjcmVhdGUgSFRNTCBtZXRob2QgZnJvbSB0aGUgY29ycmVjdCBtb2R1bGUsIHVzaW5nIHRoZSByZXR1cm5lZCBQcm9taXNlIGZyb20gYXBpIG1ldGhvZCB0byBmaWxsIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdIVE1Mc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YXJnZXRMaXN0WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2V2ZW50cyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY2hhdHMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBjaGF0c01vZHVsZS5idWlsZENoYXRzSFRNTChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0YXNrcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdIVE1Mc3RyaW5nICs9IHRhc2tzTW9kdWxlLnRhc2tUb0hUTUwoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXJ0aWNsZXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SFRNTHN0cmluZyArPSBhcnRpY2xlTW9kdWxlLmNyZWF0ZUFydGljbGVIVE1MKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCBwcmludFRvRG9tKCkgYW5kIHBhc3MgaXQgdGhlIG5ldyBIVE1MIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbnRUb0RPTShuZXdIVE1Mc3RyaW5nLCB3aGVyZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICByZWdpc3RlcjogKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JlZ2lzdHJhdGlvbi0tY3JlYXRlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICBldmVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdPYmplY3QgPSByZWdpc3RyYXRpb25IYW5kbGVyLmNyZWF0ZVJlZ2lzdHJhdGlvbk9iamVjdCgpO1xuICAgICAgICAgICAgQVBJTWFuYWdlci5Qb3N0KFwidXNlcnNcIiwgbmV3T2JqZWN0KVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgb2JqZWN0QXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcklkID0gb2JqZWN0QXJyYXkuaWQ7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJ1c2VySWRcIiwgdXNlcklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xpY2tCdWJibGVyOyIsIi8qXG5BdXRob3I6IFBhbnlhXG5UYXNrOiBoYW5kbGVzIGFsbCBmdW5jdGlvbnMgc3BlY2lmaWMgdG8gdGhlIGV2ZW50cyBsaXN0aW5nIGluIE51dHNoZWxsXG4qL1xuXG5pbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcblxuY29uc3QgZXZlbnRzTW9kdWxlID0ge1xuICAgIGJ1aWxkRW50cnlGb3JtOiBldmVudElkID0+IHtcbiAgICAgICAgcmV0dXJuIGA8Zm9ybSBpZD1cImV2ZW50Rm9ybVwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZXZlbnRJZFwiIHZhbHVlPVwiJHtldmVudElkfVwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50TmFtZVwiPk5hbWUgb2YgdGhlIGV2ZW50OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImV2ZW50TmFtZVwiIGlkPVwiZXZlbnROYW1lXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50RGF0ZVwiPkRhdGUgb2YgdGhlIGV2ZW50OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImV2ZW50RGF0ZVwiIGlkPVwiZXZlbnREYXRlXCI+PC9pbnB1dD5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50TG9jYXRpb25cIj5Mb2NhdGlvbiBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZXZlbnRMb2NhdGlvblwiIGlkPVwiZXZlbnRMb2NhdGlvblwiPjwvaW5wdXQ+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tY3JlYXRlXCI+Q3JlYXRlIE5ldyBFdmVudDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+YDtcbiAgICB9LFxuICAgIGNyZWF0ZUV2ZW50T2JqZWN0OiBldmVudElkID0+IHtcbiAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50TmFtZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50RGF0ZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudExvY2F0aW9uXCIpLnZhbHVlO1xuICAgICAgICAvLyBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IDE7XG4gICAgICAgIC8vIGV2ZW50SWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2V2ZW50SWRcIikudmFsdWU7XG5cbiAgICAgICAgY29uc3QgZXZlbnRPYmplY3QgPSB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZlbnRPYmplY3Q7XG4gICAgICAgIC8vIGlmIChldmVudElkICE9PSBcIlwiKSB7XG5cbiAgICAgICAgLy8gfSBlbHNlIHtcblxuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBjcmVhdGVFdmVudEhUTUw6IChldmVudE9iamVjdCwgdXNlcklkKSA9PiB7XG4gICAgICAgIGxldCB0aW1lID0gdGltZUNvbnZlcnRlcihldmVudE9iamVjdC5kYXRlKVxuICAgICAgICBsZXQgYmFzZUhUTUwgPSAgYDxzZWN0aW9uIGNsYXNzPVwiZXZlbnRzXCIgaWQ9XCJldmVudC0tJHtldmVudE9iamVjdC5pZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50TmFtZVwiPiR7ZXZlbnRPYmplY3QubmFtZX08L2Rpdj5cbiAgICAgICAgPHA+JHt0aW1lfTwvcD5cbiAgICAgICAgPHA+JHtldmVudE9iamVjdC5sb2NhdGlvbn08L3A+XG4gICAgICAgIDwvc2VjdGlvbj5gO1xuXG4gICAgICAgIGlmIChldmVudE9iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJldmVudHMtLWVkaXQtLSR7ZXZlbnRPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJldmVudHMtLWRlbGV0ZS0tJHtldmVudE9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPGhyLz5cIlxuXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50c01vZHVsZTsiLCJpbXBvcnQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIGZyb20gXCIuL2Rhc2hib2FyZFJlZnJlc2hpb25hbFwiO1xuXG4vLyBpbXBvcnQgZXZlbnQgbGlzdGVuZXJzIG1vZHVsZSBmcm9tIFwiLi9ldmVudGxpc3RlbmVyc1wiXG5cbi8vIGhlbGxvIHdvcmxkXG5cbmltcG9ydCBjbGlja0J1YmJsZXIgZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnNcIjtcbmltcG9ydCByZWdpc3RyYXRpb25IYW5kbGVyIGZyb20gXCIuL3JlZ2lzdHJhdGlvblwiO1xuXG5sZXQgdXNlcklkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKTtcbmlmICh1c2VySWQgIT09IG51bGwpIHtcbiAgICBkYXNoYm9hcmRSZWZyZXNoaW9uYWwoKVxuICAgIGNsaWNrQnViYmxlci5saXN0ZW5lcigpO1xufSBlbHNlIHtcbiAgICBjb25zdCBIVE1MY29kZSA9IHJlZ2lzdHJhdGlvbkhhbmRsZXIuYnVpbGRSZWdpc3RyYXRpb25Gb3JtKCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXNoYm9hcmRDb250YWluZXJcIikuaW5uZXJIVE1MID0gSFRNTGNvZGU7XG4gICAgY2xpY2tCdWJibGVyLnJlZ2lzdGVyKCk7XG59XG5cbiIsImNvbnN0IHByaW50VG9ET00gPSAod2hhdCwgd2hlcmUpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3doZXJlfWApLmlubmVySFRNTCArPSB3aGF0XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgcHJpbnRUb0RPTTtcbiIsImNvbnN0IHJlZ2lzdHJhdGlvbkxvZ2luSGFuZGxlciA9IHtcbiAgICBidWlsZFJlZ2lzdHJhdGlvbkZvcm06ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGA8Zm9ybSBpZD1cInJlZ2lzdHJhdGlvbkZvcm1cIj5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImVtYWlsXCI+RW1haWw6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcm5hbWVcIj5Vc2VybmFtZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VybmFtZVwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiPlBhc3N3b3JkOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdE5hbWVcIj5GaXJzdCBOYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmlyc3ROYW1lXCIgaWQ9XCJmaXJzdE5hbWVcIj48L2lucHV0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibGFzdE5hbWVcIj5MYXN0IE5hbWU6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsYXN0TmFtZVwiIGlkPVwibGFzdE5hbWVcIj48L2lucHV0PlxuICAgICAgICA8YnV0dG9uIGlkPVwicmVnaXN0cmF0aW9uLS1jcmVhdGVcIj5SZWdpc3RlcjwvYnV0dG9uPlxuICAgICAgICBgXG4gICAgfSxcbiAgICBjcmVhdGVSZWdpc3RyYXRpb25PYmplY3Q6ICgpID0+IHtcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN1c2VybmFtZVwiKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Bhc3N3b3JkXCIpLnZhbHVlXG4gICAgICAgIGxldCBmaXJzdE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2ZpcnN0TmFtZVwiKS52YWx1ZVxuICAgICAgICBsZXQgbGFzdE5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xhc3ROYW1lXCIpLnZhbHVlXG4gICAgICAgIGxldCBlbWFpbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZW1haWxcIikudmFsdWVcblxuICAgICAgICBjb25zdCB1c2VyT2JqZWN0ID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgZmlyc3RfbmFtZTogZmlyc3ROYW1lLFxuICAgICAgICAgICAgbGFzdF9uYW1lOiBsYXN0TmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJPYmplY3RcbiAgICB9LFxuICAgIGJ1aWxkTG9naW5Gb3JtOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJsb2dpbkZvcm1cIj5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJuYW1lXCI+VXNlcm5hbWU6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsb2dpblVzZXJuYW1lXCIgaWQ9XCJsb2dpblVzZXJuYW1lXCI+PC9pbnB1dD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ6PC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBuYW1lPVwibG9naW5QYXNzd29yZFwiIGlkPVwibG9naW5QYXNzd29yZFwiPjwvaW5wdXQ+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgYFxuICAgIH0sXG4gICAgY3JlYXRlTG9naW5PYmplY3Q6ICgpID0+IHtcbiAgICAgICAgbGV0IHVzZXJuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsb2dpblVzZXJuYW1lXCIpLnZhbHVlXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbG9naW5QYXNzd29yZFwiKS52YWx1ZVxuXG4gICAgICAgIGNvbnN0IHVzZXJMb2dpbk9iamVjdCA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VyTG9naW5PYmplY3RcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVnaXN0cmF0aW9uTG9naW5IYW5kbGVyIiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XG5cbmNvbnN0IHRhc2tzTW9kdWxlID0ge1xuICAgIHRhc2tUb0hUTUw6IGZ1bmN0aW9uICh0YXNrT2JqZWN0LCB1c2VySWQpIHtcbiAgICAgICAgY29uc3QgdGFza1RpbWVzdGFtcCA9IHRpbWVDb252ZXJ0ZXIodGFza09iamVjdC5jb21wbGV0aW9uX2RhdGUpXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGBcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidGFza3NcIiBpZD1cInRhc2stLSR7dGFza09iamVjdC5pZH0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFza05hbWVcIj4ke3Rhc2tPYmplY3QubmFtZX08L2Rpdj5cbiAgICAgICAgICAgIDxwIGlkPVwiY29tcGxldGlvbl9kYXRlXCI+JHt0YXNrVGltZXN0YW1wfTwvcD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpc19jb21wbGV0ZVwiIGlkPVwidGFza19jb21wbGV0ZVwiPiR7dGFza09iamVjdC5pc19jb21wbGV0ZX08L2xhYmVsPlxuICAgICAgICBgXG5cbiAgICAgICAgaWYgKHRhc2tPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWVkaXQtLSR7dGFza09iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1kZWxldGUtLSR7dGFza09iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPC9zZWN0aW9uPjxoci8+XCJcblxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcbiAgICB9LFxuICAgIHRhc2tGb3JtOiBmdW5jdGlvbiAob2JqZWN0SWQpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInVzZXJJZFwiIHZhbHVlPVwiJHtvYmplY3RJZH1cIj48YnI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibmFtZVwiPk5hbWUgb2YgdGFzazogPC9sYWJlbD48YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRhc2sgbmFtZVwiIGlkPVwidGFza05hbWVcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb21wbGV0aW9uX2RhdGVcIj5EYXRlIHRvIGJlIGNvbXBsZXRlZCBieTogPC9sYWJlbD48YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cInRhc2tEYXRlXCI+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbD5JcyB0YXNrIGNvbXBsZXRlOiA8L2xhYmVsPjxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInRhc2tDb21wbGV0ZVwiIHZhbHVlPVwiWWVzXCI+WWVzPGJyPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidGFza0NvbXBsZXRlXCIgdmFsdWU9XCJOb1wiPk5vPGJyPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGFza3MtLWNyZWF0ZVwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICBgXG4gICAgfSxcbiAgICBjYXB0dXJlRm9ybVZhbHVlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB0YXNrT2JqZWN0ID0ge1xuICAgICAgICAgICAgbmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrTmFtZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIGNvbXBsZXRpb25fZGF0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrRGF0ZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIGlzX2NvbXBsZXRlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Rhc2tDb21wbGV0ZVwiKS52YWx1ZSxcbiAgICAgICAgICAgIC8vdXNlcklkOiBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKVxuICAgICAgICAgICAgdXNlcklkOiAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhc2tPYmplY3RcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRhc2tzTW9kdWxlIiwiZnVuY3Rpb24gdGltZUNvbnZlcnRlciAodGltZXN0YW1wKSB7XG4gICAgdmFyIGEgPSBuZXcgRGF0ZShwYXJzZUludCh0aW1lc3RhbXApKTtcbiAgICB2YXIgbW9udGhzID0gWydKYW4nLCdGZWInLCdNYXInLCdBcHInLCdNYXknLCdKdW4nLCdKdWwnLCdBdWcnLCdTZXAnLCdPY3QnLCdOb3YnLCdEZWMnXTtcbiAgICB2YXIgeWVhciA9IGEuZ2V0RnVsbFllYXIoKTtcbiAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcbiAgICB2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xuICAgIHZhciBob3VyID0gYS5nZXRIb3VycygpO1xuICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcbiAgICB2YXIgdGltZSA9IGRhdGUgKyAnICcgKyBtb250aCArICcgJyArIHllYXIgKyAnICcgKyBob3VyICsgJzonICsgbWluO1xuICAgIHJldHVybiB0aW1lO1xuICB9O1xuXG4gIGV4cG9ydCBkZWZhdWx0IHRpbWVDb252ZXJ0ZXI7Il19
