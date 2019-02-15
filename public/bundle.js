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
    let url = document.querySelector("#articleURL").value;
    const userId = Window.sessionStorage.getItem('userId');
    let articleId = document.querySelector("#articleId").value;
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
                <button id="chat--submit">Submit</button>
            </div>
        `;
  },
  buildChatsObject: () => {
    const chatsObject = {};
    chatsObject.text = document.getElementById("chat--textInput").value;
    chatsObject.timestamp = Date.now();
    chatsObject.userId = Window.sessionStorage.getItem('userId');
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

},{"./timestampparser":9}],4:[function(require,module,exports){
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

},{"./APIManager":1,"./article":2,"./chats":3,"./eventsModule":5,"./printToDOM":7,"./task":8}],5:[function(require,module,exports){
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
    let location = document.querySelector("#eventLocation").value;
    const userId = Window.sessionStorage.getItem('userId'); // eventId = document.querySelector("#eventId").value;

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

},{"./timestampparser":9}],6:[function(require,module,exports){
"use strict";

var _dashboardRefreshional = _interopRequireDefault(require("./dashboardRefreshional"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import event listeners module from "./eventlisteners"
// hello world
(0, _dashboardRefreshional.default)();

},{"./dashboardRefreshional":4}],7:[function(require,module,exports){
"use strict";

<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const printToDOM = (what, where) => {
  document.querySelector(`${where}`).innerHTML += what;
};

var _default = printToDOM;
exports.default = _default;

},{}],8:[function(require,module,exports){
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
    console.log(baseHTML);
    return baseHTML;
  },
  taskForm: function (userId) {
    return `
            <input type="hidden" id="userId" value="${userId}"><br>
            <label for="name">Name of task: </label><br>

            <input type="text" placeholder="Task name" id="taskName">
            <label for="completion_date">Date to be completed by: </label><br>

            <input type="date" id="taskDate">
            <label>Is task complete: </label><br>

            <input type="checkbox" id="taskComplete" value="Yes">Yes<br>
            <input type="checkbox" id="taskComplete" value="No">No<br>
        `;
  },
  captureFormValues: function () {
    const taskObject = {
      name: document.querySelector("#taskName").value,
      completion_date: document.querySelector("#taskDate").value,
      is_complete: document.querySelector("#taskComplete").value,
      userId: Window.sessionStorage.getItem("userId")
    };
    return taskObject;
  }
};
var _default = tasksModule;
exports.default = _default;

},{"./timestampparser":9}],9:[function(require,module,exports){
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL2V2ZW50c01vZHVsZS5qcyIsIi4uL3NjcmlwdHMvbWFpbi5qcyIsIi4uL3NjcmlwdHMvcHJpbnRUb0RPTS5qcyIsIi4uL3NjcmlwdHMvdGFzay5qcyIsIi4uL3NjcmlwdHMvdGltZXN0YW1wcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQ0EsTUFBTSxVQUFVLEdBQUc7QUFDZixFQUFBLFdBQVcsRUFBRSxDQUFDLGVBQUQsRUFBa0IsTUFBbEIsS0FBNkI7QUFDdEMsV0FBTyxLQUFLLENBQUcseUJBQXdCLGVBQWdCLFlBQVcsTUFBTyxFQUE3RCxDQUFMLENBQ0YsSUFERSxDQUNHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSixFQURWLENBQVA7QUFHSCxHQUxjO0FBTWYsRUFBQSxNQUFNLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFFBQWxCLEtBQStCO0FBQ25DLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixJQUFHLFFBQVMsRUFBdEQsRUFBeUQ7QUFDN0QsTUFBQSxNQUFNLEVBQUU7QUFEcUQsS0FBekQsQ0FBWjtBQUdKLEdBVmU7QUFXaEIsRUFBQSxJQUFJLEVBQUUsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLEtBQW1DO0FBQ3hDLFdBQU8sS0FBSyxDQUFFLHlCQUF3QixlQUFnQixFQUExQyxFQUE2QztBQUNyRCxNQUFBLE1BQU0sRUFBRSxNQUQ2QztBQUVyRCxNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRjRDO0FBS3JELE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsWUFBZjtBQUwrQyxLQUE3QyxD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Ozs7Ozs7Ozs7QUNwRGYsU0FBUyxhQUFULENBQXdCLFNBQXhCLEVBQW1DO0FBQy9CLE1BQUksQ0FBQyxHQUFHLElBQUksSUFBSixDQUFTLFFBQVEsQ0FBQyxTQUFELENBQWpCLENBQVI7QUFDQSxNQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUQsRUFBTyxLQUFQLEVBQWEsS0FBYixFQUFtQixLQUFuQixFQUF5QixLQUF6QixFQUErQixLQUEvQixFQUFxQyxLQUFyQyxFQUEyQyxLQUEzQyxFQUFpRCxLQUFqRCxFQUF1RCxLQUF2RCxFQUE2RCxLQUE3RCxFQUFtRSxLQUFuRSxDQUFiO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQUYsRUFBWDtBQUNBLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBRixFQUFELENBQWxCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQUYsRUFBWDtBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFGLEVBQVg7QUFDQSxNQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBRixFQUFWO0FBQ0EsTUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQVAsR0FBYSxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCLElBQTNCLEdBQWtDLEdBQWxDLEdBQXdDLElBQXhDLEdBQStDLEdBQS9DLEdBQXFELEdBQWhFO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBQUE7ZUFFYyxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXHJcbmNvbnN0IEFQSU1hbmFnZXIgPSB7XHJcbiAgICBnZXRCeVVzZXJJZDogKGRlc2lyZWREYXRhYmFzZSwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fdXNlcklkPSR7dXNlcklkfWApXHJcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG5cclxuICAgIH0sXHJcbiAgICBkZWxldGU6IChkZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vMTI3LjAuMC4xOjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9LyR7b2JqZWN0SWR9YCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXHJcbiAgICAgICAgfSlcclxuICAgfSxcclxuICAgUG9zdDogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0VG9Qb3N0KSA9PiB7XHJcbiAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX1gLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvYmplY3RUb1Bvc3QpXHJcbiAgICB9KVxyXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICB9LFxyXG4gICAgUHV0OihkZXNpcmVkRGF0YWJhc2UsIG9iamVjdElkLCBlZGl0ZWRPYmplY3QpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZWRpdGVkT2JqZWN0KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICB9LFxyXG4gICAgZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbzogKGRlc2lyZWREYXRhYmFzZSwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoIChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfT9fZXhwYW5kPXVzZXImdXNlcklkPSR7dXNlcklkfWApXHJcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQVBJTWFuYWdlciIsImNvbnN0IGFydGljbGVNb2R1bGUgPSB7XHJcbiAgICBidWlsZEFydGljbGVGb3JtOiAoYXJ0aWNsZUlkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGA8Zm9ybSBpZD1cImFydGljbGVGb3JtXCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImFydGljbGVJZFwiIHZhbHVlPVwiJHthcnRpY2xlSWR9XCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVUaXRsZVwiPkFydGljbGUgVGl0bGU6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlVGl0bGVcIiBpZD1cImFydGljbGVUaXRsZVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlU3VtbWFyeVwiPkFydGljbGUgU3VtbWFyeTo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVTdW1tYXJ5XCIgaWQ9XCJhcnRpY2xlU3VtbWFyeVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJhcnRpY2xlVVJMXCI+QXJ0aWNsZSBVUkw6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJhcnRpY2xlVVJMXCIgaWQ9XCJhcnRpY2xlVVJMXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFydGljbGVzLS1jcmVhdGVcIj5Qb3N0IFlvdXIgQXJ0aWNsZTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5gO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUFydGljbGVPYmplY3Q6ICgpID0+IHtcclxuICAgICAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FydGljbGVUaXRsZVwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgc3VtbWFyeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVN1bW1hcnlcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IHVybCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVVSTFwiKS52YWx1ZTtcclxuICAgICAgICBjb25zdCB1c2VySWQgPSBXaW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlcklkJyk7XHJcbiAgICAgICAgbGV0IGFydGljbGVJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZUlkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBjb25zdCBhcnRpY2xlT2JqZWN0ID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgICAgIHN1bW1hcnk6IHN1bW1hcnksXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgIHVzZXJJZDogdXNlcklkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJ0aWNsZU9iamVjdDtcclxuXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlQXJ0aWNsZUhUTUw6IChhcnRpY2xlT2JqZWN0LCB1c2VySWQpID0+IHtcclxuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgPHNlY3Rpb24gY2xhc3M9XCJhcnRpY2xlc1wiIGlkPVwiYXJ0aWNsZS0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhcnRpY2xlVGl0bGVcIj4ke2FydGljbGVPYmplY3QudGl0bGV9PC9kaXY+XHJcbiAgICAgICAgPHA+JHthcnRpY2xlT2JqZWN0LnN1bW1hcnl9PC9wPlxyXG4gICAgICAgIDxwPjxhIGhyZWY9XCJodHRwOi8vJHthcnRpY2xlT2JqZWN0LnVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FydGljbGVPYmplY3QudXJsfTwvYT48L3A+XHJcbiAgICAgICAgYFxyXG5cclxuICAgICAgICBpZiAoYXJ0aWNsZU9iamVjdC51c2VySWQgPT09IHVzZXJJZCkge1xyXG4gICAgICAgICAgICBiYXNlSFRNTCArPSBgXHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWVkaXQtLSR7YXJ0aWNsZU9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWRlbGV0ZS0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvc2VjdGlvbj48aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfSxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXJ0aWNsZU1vZHVsZTsiLCJpbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcclxuXHJcbmNvbnN0IGNoYXRzTW9kdWxlID0ge1xyXG4gICAgYnVpbGRDaGF0c0Zvcm06IChjaGF0SWQpID0+IHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdHNGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjaGF0SWRcIiB2YWx1ZT1cIiR7Y2hhdElkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgICAgICBFbnRlciB5b3VyIG1lc3NhZ2U6PC9icj5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiNFwiIGNvbHM9XCI1MFwiIG5hbWU9XCJjaGF0TWVzc2FnZVwiIGlkPVwiY2hhdC0tdGV4dElucHV0XCI+PC90ZXh0YXJlYT48L2JyPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXQtLXN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgXHJcbiAgICB9LFxyXG4gICAgYnVpbGRDaGF0c09iamVjdDogKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoYXRzT2JqZWN0ID0ge31cclxuICAgICAgICBjaGF0c09iamVjdC50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0LS10ZXh0SW5wdXRcIikudmFsdWVcclxuICAgICAgICBjaGF0c09iamVjdC50aW1lc3RhbXAgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgY2hhdHNPYmplY3QudXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpXHJcbiAgICAgICAgcmV0dXJuIGNoYXRzT2JqZWN0XHJcbiAgICB9LFxyXG4gICAgYnVpbGRDaGF0c0hUTUw6IChjaGF0T2JqZWN0LCB1c2VySWQpID0+IHtcclxuICAgICAgICBjb25zdCBjaGF0VGltZXN0YW1wID0gdGltZUNvbnZlcnRlcihjaGF0T2JqZWN0LnRpbWVzdGFtcClcclxuXHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhdHNcIiBpZD1cImNoYXQtLSR7Y2hhdE9iamVjdC5pZH1cIlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJjaGF0VGV4dENvbnRlbnRcIj4ke2NoYXRPYmplY3QudGV4dH08L3A+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNoYXRTdWJUZXh0XCI+UG9zdGVkIGJ5ICR7Y2hhdE9iamVjdC51c2VyLnVzZXJuYW1lfSBvbiAke2NoYXRUaW1lc3RhbXB9PC9wPlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKGNoYXRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1lZGl0LS0ke2NoYXRPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXRzLS1kZWxldGUtLSR7Y2hhdE9iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L2Rpdj48aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjaGF0c01vZHVsZSIsImltcG9ydCBBUElNYW5hZ2VyIGZyb20gXCIuL0FQSU1hbmFnZXJcIlxyXG5pbXBvcnQgcHJpbnRUb0RPTSBmcm9tIFwiLi9wcmludFRvRE9NXCI7XHJcbmltcG9ydCBjaGF0c01vZHVsZSBmcm9tIFwiLi9jaGF0c1wiO1xyXG5pbXBvcnQgYXJ0aWNsZU1vZHVsZSBmcm9tIFwiLi9hcnRpY2xlXCJcclxuaW1wb3J0IGV2ZW50c01vZHVsZSBmcm9tIFwiLi9ldmVudHNNb2R1bGVcIlxyXG5pbXBvcnQgdGFza3NNb2R1bGUgZnJvbSBcIi4vdGFza1wiXHJcblxyXG5jb25zdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgPSAoKSA9PiB7XHJcbiAgICAvLyBORUVEIFRPIEJFIENIQU5HRUQgVE8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xyXG4gICAgY29uc3QgdXNlcklkID0gMVxyXG4gICAgLy9cclxuICAgIGNvbnN0IGNoYXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXREaXNwbGF5XCIpXHJcbiAgICBjb25zdCBhcnRpY2xlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpY2xlRGlzcGxheVwiKVxyXG4gICAgY29uc3QgZXZlbnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW50RGlzcGxheVwiKVxyXG4gICAgY29uc3QgdGFza0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFza0Rpc3BsYXlcIilcclxuICAgIGNvbnN0IGZyaWVuZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJpZW5kRGlzcGxheVwiKVxyXG4gICAgY2hhdENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBhcnRpY2xlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIGV2ZW50Q29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIHRhc2tDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgZnJpZW5kQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImNoYXRzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihjaGF0cykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudE1lc3NhZ2UgPSBjaGF0c1tpXVxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlSFRNTCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGN1cnJlbnRNZXNzYWdlLCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00obWVzc2FnZUhUTUwsIFwiI1wiICsgY2hhdENvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiYXJ0aWNsZXNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGFydGljbGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QXJ0aWNsZSA9IGFydGljbGVzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IGFydGljbGVIVE1MID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChjdXJyZW50QXJ0aWNsZSwgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKGFydGljbGVIVE1MLCBcIiNcIiArIGFydGljbGVDb250YWluZXIuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImV2ZW50c1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24oZXZlbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudEV2ZW50ID0gZXZlbnRzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50SFRNTCA9IGV2ZW50c01vZHVsZS5jcmVhdGVFdmVudEhUTUwoY3VycmVudEV2ZW50LCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00oZXZlbnRIVE1MLCBcIiNcIiArIGV2ZW50Q29udGFpbmVyLmlkKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBBUElNYW5hZ2VyLmZldGNoV2l0aEV4cGFuZGVkVXNlckluZm8oXCJ0YXNrc1wiLCB1c2VySWQpLnRoZW4oZnVuY3Rpb24odGFza3MpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrID0gdGFza3NbaV1cclxuICAgICAgICAgICAgY29uc3QgdGFza0hUTUwgPSB0YXNrc01vZHVsZS50YXNrVG9IVE1MKGN1cnJlbnRUYXNrLCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00odGFza0hUTUwsIFwiI1wiICsgdGFza0NvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwiLCIvKlxyXG5BdXRob3I6IFBhbnlhXHJcblRhc2s6IGhhbmRsZXMgYWxsIGZ1bmN0aW9ucyBzcGVjaWZpYyB0byB0aGUgZXZlbnRzIGxpc3RpbmcgaW4gTnV0c2hlbGxcclxuKi9cclxuXHJcbmltcG9ydCB0aW1lQ29udmVydGVyIGZyb20gXCIuL3RpbWVzdGFtcHBhcnNlclwiO1xyXG5cclxuY29uc3QgZXZlbnRzTW9kdWxlID0ge1xyXG4gICAgYnVpbGRFbnRyeUZvcm06IGV2ZW50SWQgPT4ge1xyXG4gICAgICAgIHJldHVybiBgPGZvcm0gaWQ9XCJldmVudEZvcm1cIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZXZlbnRJZFwiIHZhbHVlPVwiJHtldmVudElkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJldmVudE5hbWVcIj5OYW1lIG9mIHRoZSBldmVudDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImV2ZW50TmFtZVwiIGlkPVwiZXZlbnROYW1lXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50RGF0ZVwiPkRhdGUgb2YgdGhlIGV2ZW50OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lXCIgbmFtZT1cImV2ZW50RGF0ZVwiIGlkPVwiZXZlbnREYXRlXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImV2ZW50TG9jYXRpb25cIj5Mb2NhdGlvbiBvZiB0aGUgZXZlbnQ6PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJldmVudExvY2F0aW9uXCIgaWQ9XCJldmVudExvY2F0aW9uXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tY3JlYXRlXCI+Q3JlYXRlIE5ldyBFdmVudDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZm9ybT5gO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUV2ZW50T2JqZWN0OiBldmVudElkID0+IHtcclxuICAgICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXZlbnROYW1lXCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudERhdGVcIikudmFsdWU7XHJcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudExvY2F0aW9uXCIpLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcclxuICAgICAgICAvLyBldmVudElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNldmVudElkXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudE9iamVjdCA9IHtcclxuICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50T2JqZWN0O1xyXG4gICAgICAgIC8vIGlmIChldmVudElkICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcbiAgICBjcmVhdGVFdmVudEhUTUw6IChldmVudE9iamVjdCwgdXNlcklkKSA9PiB7XHJcbiAgICAgICAgbGV0IHRpbWUgPSB0aW1lQ29udmVydGVyKGV2ZW50T2JqZWN0LmRhdGUpXHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gIGA8c2VjdGlvbiBjbGFzcz1cImV2ZW50c1wiIGlkPVwiZXZlbnQtLSR7ZXZlbnRPYmplY3QuaWR9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50TmFtZVwiPiR7ZXZlbnRPYmplY3QubmFtZX08L2Rpdj5cclxuICAgICAgICA8cD4ke3RpbWV9PC9wPlxyXG4gICAgICAgIDxwPiR7ZXZlbnRPYmplY3QubG9jYXRpb259PC9wPlxyXG4gICAgICAgIDwvc2VjdGlvbj5gO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImV2ZW50cy0tZWRpdC0tJHtldmVudE9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZXZlbnRzLS1kZWxldGUtLSR7ZXZlbnRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH0sXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGV2ZW50c01vZHVsZTsiLCJpbXBvcnQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIGZyb20gXCIuL2Rhc2hib2FyZFJlZnJlc2hpb25hbFwiO1xyXG5cclxuLy8gaW1wb3J0IGV2ZW50IGxpc3RlbmVycyBtb2R1bGUgZnJvbSBcIi4vZXZlbnRsaXN0ZW5lcnNcIlxyXG5cclxuLy8gaGVsbG8gd29ybGRcclxuXHJcbmRhc2hib2FyZFJlZnJlc2hpb25hbCgpIiwiY29uc3QgcHJpbnRUb0RPTSA9ICh3aGF0LCB3aGVyZSkgPT4ge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHt3aGVyZX1gKS5pbm5lckhUTUwgKz0gd2hhdFxyXG59XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJpbnRUb0RPTTtcclxuIiwiaW1wb3J0IHRpbWVDb252ZXJ0ZXIgZnJvbSBcIi4vdGltZXN0YW1wcGFyc2VyXCI7XHJcblxyXG5jb25zdCB0YXNrc01vZHVsZSA9IHtcclxuICAgIHRhc2tUb0hUTUw6IGZ1bmN0aW9uICh0YXNrT2JqZWN0LCB1c2VySWQpIHtcclxuICAgICAgICBjb25zdCB0YXNrVGltZXN0YW1wID0gdGltZUNvbnZlcnRlcih0YXNrT2JqZWN0LmNvbXBsZXRpb25fZGF0ZSlcclxuICAgICAgICBsZXQgYmFzZUhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidGFza3NcIiBpZD1cInRhc2stLSR7dGFza09iamVjdC5pZH0+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrTmFtZVwiPiR7dGFza09iamVjdC5uYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICA8cCBpZD1cImNvbXBsZXRpb25fZGF0ZVwiPiR7dGFza1RpbWVzdGFtcH08L3A+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpc19jb21wbGV0ZVwiIGlkPVwidGFza19jb21wbGV0ZVwiPiR7dGFza09iamVjdC5pc19jb21wbGV0ZX08L2xhYmVsPlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKHRhc2tPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1lZGl0LS0ke3Rhc2tPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRhc2tzLS1kZWxldGUtLSR7dGFza09iamVjdC5pZH1cIj5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFzZUhUTUwgKz0gXCI8L3NlY3Rpb24+PGhyLz5cIlxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhiYXNlSFRNTClcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VIVE1MXHJcbiAgICB9LFxyXG4gICAgdGFza0Zvcm06IGZ1bmN0aW9uICh1c2VySWQpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwidXNlcklkXCIgdmFsdWU9XCIke3VzZXJJZH1cIj48YnI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZSBvZiB0YXNrOiA8L2xhYmVsPjxicj5cclxuXHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGFzayBuYW1lXCIgaWQ9XCJ0YXNrTmFtZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiY29tcGxldGlvbl9kYXRlXCI+RGF0ZSB0byBiZSBjb21wbGV0ZWQgYnk6IDwvbGFiZWw+PGJyPlxyXG5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJ0YXNrRGF0ZVwiPlxyXG4gICAgICAgICAgICA8bGFiZWw+SXMgdGFzayBjb21wbGV0ZTogPC9sYWJlbD48YnI+XHJcblxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJ0YXNrQ29tcGxldGVcIiB2YWx1ZT1cIlllc1wiPlllczxicj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwidGFza0NvbXBsZXRlXCIgdmFsdWU9XCJOb1wiPk5vPGJyPlxyXG4gICAgICAgIGBcclxuICAgIH0sXHJcbiAgICBjYXB0dXJlRm9ybVZhbHVlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHRhc2tPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza05hbWVcIikudmFsdWUsXHJcbiAgICAgICAgICAgIGNvbXBsZXRpb25fZGF0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0YXNrRGF0ZVwiKS52YWx1ZSxcclxuICAgICAgICAgICAgaXNfY29tcGxldGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGFza0NvbXBsZXRlXCIpLnZhbHVlLFxyXG4gICAgICAgICAgICB1c2VySWQ6IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidXNlcklkXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXNrT2JqZWN0XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB0YXNrc01vZHVsZSIsImZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIgKHRpbWVzdGFtcCkge1xyXG4gICAgdmFyIGEgPSBuZXcgRGF0ZShwYXJzZUludCh0aW1lc3RhbXApKTtcclxuICAgIHZhciBtb250aHMgPSBbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xyXG4gICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgIHZhciB0aW1lID0gZGF0ZSArICcgJyArIG1vbnRoICsgJyAnICsgeWVhciArICcgJyArIGhvdXIgKyAnOicgKyBtaW47XHJcbiAgICByZXR1cm4gdGltZTtcclxuICB9O1xyXG5cclxuICBleHBvcnQgZGVmYXVsdCB0aW1lQ29udmVydGVyOyJdfQ==
=======
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUVBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gaW1wb3J0IGV2ZW50IGxpc3RlbmVycyBtb2R1bGUgZnJvbSBcIi4vZXZlbnRsaXN0ZW5lcnNcIlxuXG4vLyBoZWxsbyB3b3JsZCJdfQ==
>>>>>>> master
