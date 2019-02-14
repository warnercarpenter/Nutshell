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
        <div>${articleObject.summary}</div>
        <div><a href=${articleObject.url} target="_blank">${articleObject.url}</a></div>
        `;

    if (articleObject.userId === userId) {
      baseHTML += `
                <button id="chat--edit--${articleObject.id}">Edit</button>
                <button id="chat--delete--${articleObject.id}">Delete</button>
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
            <div id="chat--${chatObject.id}"
                <p class="chatTextContent">${chatObject.text}</p>
                <p class="chatSubText">Posted by ${chatObject.user.username} on ${chatTimestamp}</p>
            </div>
        `;

    if (chatObject.userId === userId) {
      baseHTML += `
                <button id="chat--edit--${chatObject.id}">Edit</button>
                <button id="chat--delete--${chatObject.id}">Delete</button>
            `;
    }

    baseHTML += "<hr/>";
    return baseHTML;
  }
};
var _default = chatsModule;
exports.default = _default;

},{"./timestampparser":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _APIManager = _interopRequireDefault(require("./APIManager"));

var _printToDOM = _interopRequireDefault(require("./printToDOM"));

var _chats = _interopRequireDefault(require("./chats"));

var _article = _interopRequireDefault(require("./article"));

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
};

var _default = dashboardRefreshional;
exports.default = _default;

},{"./APIManager":1,"./article":2,"./chats":3,"./printToDOM":6}],5:[function(require,module,exports){
"use strict";

var _dashboardRefreshional = _interopRequireDefault(require("./dashboardRefreshional"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import event listeners module from "./eventlisteners"
// hello world
(0, _dashboardRefreshional.default)();

},{"./dashboardRefreshional":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL0FQSU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL2FydGljbGUuanMiLCIuLi9zY3JpcHRzL2NoYXRzLmpzIiwiLi4vc2NyaXB0cy9kYXNoYm9hcmRSZWZyZXNoaW9uYWwuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3ByaW50VG9ET00uanMiLCIuLi9zY3JpcHRzL3RpbWVzdGFtcHBhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0NBLE1BQU0sVUFBVSxHQUFHO0FBQ2YsRUFBQSxXQUFXLEVBQUUsQ0FBQyxlQUFELEVBQWtCLE1BQWxCLEtBQTZCO0FBQ3RDLFdBQU8sS0FBSyxDQUFHLHlCQUF3QixlQUFnQixZQUFXLE1BQU8sRUFBN0QsQ0FBTCxDQUNGLElBREUsQ0FDRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEVixDQUFQO0FBR0gsR0FMYztBQU1mLEVBQUEsTUFBTSxFQUFFLENBQUMsZUFBRCxFQUFrQixRQUFsQixLQUErQjtBQUNuQyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsSUFBRyxRQUFTLEVBQXRELEVBQXlEO0FBQzdELE1BQUEsTUFBTSxFQUFFO0FBRHFELEtBQXpELENBQVo7QUFHSixHQVZlO0FBV2hCLEVBQUEsSUFBSSxFQUFFLENBQUMsZUFBRCxFQUFrQixZQUFsQixLQUFtQztBQUN4QyxXQUFPLEtBQUssQ0FBRSx5QkFBd0IsZUFBZ0IsRUFBMUMsRUFBNkM7QUFDckQsTUFBQSxNQUFNLEVBQUUsTUFENkM7QUFFckQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUY0QztBQUtyRCxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFlBQWY7QUFMK0MsS0FBN0MsQ0FBTCxDQU9GLElBUEUsQ0FPRyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFQVixD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TUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFELEVBQU8sS0FBUCxLQUFpQjtBQUNoQyxFQUFBLFFBQVEsQ0FBQyxhQUFULENBQXdCLEdBQUUsS0FBTSxFQUFoQyxFQUFtQyxTQUFuQyxJQUFnRCxJQUFoRDtBQUNILENBRkQ7O2VBS2UsVTs7Ozs7Ozs7Ozs7QUNMZixTQUFTLGFBQVQsQ0FBd0IsU0FBeEIsRUFBbUM7QUFDL0IsTUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFKLENBQVMsUUFBUSxDQUFDLFNBQUQsQ0FBakIsQ0FBUjtBQUNBLE1BQUksTUFBTSxHQUFHLENBQUMsS0FBRCxFQUFPLEtBQVAsRUFBYSxLQUFiLEVBQW1CLEtBQW5CLEVBQXlCLEtBQXpCLEVBQStCLEtBQS9CLEVBQXFDLEtBQXJDLEVBQTJDLEtBQTNDLEVBQWlELEtBQWpELEVBQXVELEtBQXZELEVBQTZELEtBQTdELEVBQW1FLEtBQW5FLENBQWI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsV0FBRixFQUFYO0FBQ0EsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFGLEVBQUQsQ0FBbEI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsT0FBRixFQUFYO0FBQ0EsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQUYsRUFBWDtBQUNBLE1BQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFGLEVBQVY7QUFDQSxNQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBUCxHQUFhLEtBQWIsR0FBcUIsR0FBckIsR0FBMkIsSUFBM0IsR0FBa0MsR0FBbEMsR0FBd0MsSUFBeEMsR0FBK0MsR0FBL0MsR0FBcUQsR0FBaEU7QUFDQSxTQUFPLElBQVA7QUFDRDs7QUFBQTtlQUVjLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuY29uc3QgQVBJTWFuYWdlciA9IHtcclxuICAgIGdldEJ5VXNlcklkOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P191c2VySWQ9JHt1c2VySWR9YClcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcblxyXG4gICAgfSxcclxuICAgIGRlbGV0ZTogKGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC8ke2Rlc2lyZWREYXRhYmFzZX0vJHtvYmplY3RJZH1gLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcclxuICAgICAgICB9KVxyXG4gICB9LFxyXG4gICBQb3N0OiAoZGVzaXJlZERhdGFiYXNlLCBvYmplY3RUb1Bvc3QpID0+IHtcclxuICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfWAsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9iamVjdFRvUG9zdClcclxuICAgIH0pXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgIH0sXHJcbiAgICBQdXQ6KGRlc2lyZWREYXRhYmFzZSwgb2JqZWN0SWQsIGVkaXRlZE9iamVjdCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4LyR7ZGVzaXJlZERhdGFiYXNlfS8ke29iamVjdElkfWAsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShlZGl0ZWRPYmplY3QpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgIH0sXHJcbiAgICBmZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvOiAoZGVzaXJlZERhdGFiYXNlLCB1c2VySWQpID0+IHtcclxuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vbG9jYWxob3N0OjgwODgvJHtkZXNpcmVkRGF0YWJhc2V9P19leHBhbmQ9dXNlciZ1c2VySWQ9JHt1c2VySWR9YClcclxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBUElNYW5hZ2VyIiwiY29uc3QgYXJ0aWNsZU1vZHVsZSA9IHtcclxuICAgIGJ1aWxkQXJ0aWNsZUZvcm06IChhcnRpY2xlSWQpID0+IHtcclxuICAgICAgICByZXR1cm4gYDxmb3JtIGlkPVwiYXJ0aWNsZUZvcm1cIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiYXJ0aWNsZUlkXCIgdmFsdWU9XCIke2FydGljbGVJZH1cIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYXJ0aWNsZVRpdGxlXCI+QXJ0aWNsZSBUaXRsZTo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVUaXRsZVwiIGlkPVwiYXJ0aWNsZVRpdGxlXCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVTdW1tYXJ5XCI+QXJ0aWNsZSBTdW1tYXJ5OjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiYXJ0aWNsZVN1bW1hcnlcIiBpZD1cImFydGljbGVTdW1tYXJ5XCI+PC9pbnB1dD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImFydGljbGVVUkxcIj5BcnRpY2xlIFVSTDo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImFydGljbGVVUkxcIiBpZD1cImFydGljbGVVUkxcIj48L2lucHV0PlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiYXJ0aWNsZXMtLWNyZWF0ZVwiPlBvc3QgWW91ciBBcnRpY2xlPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPmA7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlQXJ0aWNsZU9iamVjdDogKCkgPT4ge1xyXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYXJ0aWNsZVRpdGxlXCIpLnZhbHVlO1xyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlU3VtbWFyeVwiKS52YWx1ZTtcclxuICAgICAgICBsZXQgdXJsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlVVJMXCIpLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHVzZXJJZCA9IFdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VySWQnKTtcclxuICAgICAgICBsZXQgYXJ0aWNsZUlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhcnRpY2xlSWRcIikudmFsdWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGFydGljbGVPYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgc3VtbWFyeTogc3VtbWFyeSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnRpY2xlT2JqZWN0O1xyXG5cclxuICAgIH0sXHJcbiAgICBjcmVhdGVBcnRpY2xlSFRNTDogKGFydGljbGVPYmplY3QsIHVzZXJJZCkgPT4ge1xyXG4gICAgICAgIGxldCBiYXNlSFRNTCA9IGA8c2VjdGlvbiBjbGFzcz1cImFydGljbGVzXCIgaWQ9XCJhcnRpY2xlLS0ke2FydGljbGVPYmplY3QuaWR9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFydGljbGVUaXRsZVwiPiR7YXJ0aWNsZU9iamVjdC50aXRsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2PiR7YXJ0aWNsZU9iamVjdC5zdW1tYXJ5fTwvZGl2PlxyXG4gICAgICAgIDxkaXY+PGEgaHJlZj0ke2FydGljbGVPYmplY3QudXJsfSB0YXJnZXQ9XCJfYmxhbmtcIj4ke2FydGljbGVPYmplY3QudXJsfTwvYT48L2Rpdj5cclxuICAgICAgICBgXHJcblxyXG4gICAgICAgIGlmIChhcnRpY2xlT2JqZWN0LnVzZXJJZCA9PT0gdXNlcklkKSB7XHJcbiAgICAgICAgICAgIGJhc2VIVE1MICs9IGBcclxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJjaGF0LS1lZGl0LS0ke2FydGljbGVPYmplY3QuaWR9XCI+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXQtLWRlbGV0ZS0tJHthcnRpY2xlT2JqZWN0LmlkfVwiPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYXNlSFRNTCArPSBcIjwvc2VjdGlvbj48aHIvPlwiXHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlSFRNTFxyXG4gICAgfSxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXJ0aWNsZU1vZHVsZTsiLCJpbXBvcnQgdGltZUNvbnZlcnRlciBmcm9tIFwiLi90aW1lc3RhbXBwYXJzZXJcIjtcclxuXHJcbmNvbnN0IGNoYXRzTW9kdWxlID0ge1xyXG4gICAgYnVpbGRDaGF0c0Zvcm06IChjaGF0SWQpID0+IHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdHNGb3JtXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjaGF0SWRcIiB2YWx1ZT1cIiR7Y2hhdElkfVwiPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgICAgICBFbnRlciB5b3VyIG1lc3NhZ2U6PC9icj5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSByb3dzPVwiNFwiIGNvbHM9XCI1MFwiIG5hbWU9XCJjaGF0TWVzc2FnZVwiIGlkPVwiY2hhdC0tdGV4dElucHV0XCI+PC90ZXh0YXJlYT48L2JyPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXQtLXN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgXHJcbiAgICB9LFxyXG4gICAgYnVpbGRDaGF0c09iamVjdDogKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoYXRzT2JqZWN0ID0ge31cclxuICAgICAgICBjaGF0c09iamVjdC50ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGF0LS10ZXh0SW5wdXRcIikudmFsdWVcclxuICAgICAgICBjaGF0c09iamVjdC50aW1lc3RhbXAgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgY2hhdHNPYmplY3QudXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpXHJcbiAgICAgICAgcmV0dXJuIGNoYXRzT2JqZWN0XHJcbiAgICB9LFxyXG4gICAgYnVpbGRDaGF0c0hUTUw6IChjaGF0T2JqZWN0LCB1c2VySWQpID0+IHtcclxuICAgICAgICBjb25zdCBjaGF0VGltZXN0YW1wID0gdGltZUNvbnZlcnRlcihjaGF0T2JqZWN0LnRpbWVzdGFtcClcclxuXHJcbiAgICAgICAgbGV0IGJhc2VIVE1MID0gYFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhdC0tJHtjaGF0T2JqZWN0LmlkfVwiXHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImNoYXRUZXh0Q29udGVudFwiPiR7Y2hhdE9iamVjdC50ZXh0fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiY2hhdFN1YlRleHRcIj5Qb3N0ZWQgYnkgJHtjaGF0T2JqZWN0LnVzZXIudXNlcm5hbWV9IG9uICR7Y2hhdFRpbWVzdGFtcH08L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGBcclxuXHJcbiAgICAgICAgaWYgKGNoYXRPYmplY3QudXNlcklkID09PSB1c2VySWQpIHtcclxuICAgICAgICAgICAgYmFzZUhUTUwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImNoYXQtLWVkaXQtLSR7Y2hhdE9iamVjdC5pZH1cIj5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiY2hhdC0tZGVsZXRlLS0ke2NoYXRPYmplY3QuaWR9XCI+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhc2VIVE1MICs9IFwiPGhyLz5cIlxyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUhUTUxcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2hhdHNNb2R1bGUiLCJpbXBvcnQgQVBJTWFuYWdlciBmcm9tIFwiLi9BUElNYW5hZ2VyXCJcclxuaW1wb3J0IHByaW50VG9ET00gZnJvbSBcIi4vcHJpbnRUb0RPTVwiO1xyXG5pbXBvcnQgY2hhdHNNb2R1bGUgZnJvbSBcIi4vY2hhdHNcIjtcclxuaW1wb3J0IGFydGljbGVNb2R1bGUgZnJvbSBcIi4vYXJ0aWNsZVwiXHJcblxyXG5jb25zdCBkYXNoYm9hcmRSZWZyZXNoaW9uYWwgPSAoKSA9PiB7XHJcbiAgICAvLyBORUVEIFRPIEJFIENIQU5HRUQgVE8gY29uc3QgdXNlcklkID0gV2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJJZCcpO1xyXG4gICAgY29uc3QgdXNlcklkID0gMVxyXG4gICAgLy9cclxuICAgIGNvbnN0IGNoYXRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXREaXNwbGF5XCIpXHJcbiAgICBjb25zdCBhcnRpY2xlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcnRpY2xlRGlzcGxheVwiKVxyXG4gICAgY29uc3QgZXZlbnRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImV2ZW50RGlzcGxheVwiKVxyXG4gICAgY29uc3QgdGFza0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFza0Rpc3BsYXlcIilcclxuICAgIGNvbnN0IGZyaWVuZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJpZW5kRGlzcGxheVwiKVxyXG4gICAgY2hhdENvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiXHJcbiAgICBhcnRpY2xlQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIGV2ZW50Q29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIHRhc2tDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgZnJpZW5kQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCJcclxuICAgIEFQSU1hbmFnZXIuZmV0Y2hXaXRoRXhwYW5kZWRVc2VySW5mbyhcImNoYXRzXCIsIHVzZXJJZCkudGhlbihmdW5jdGlvbihjaGF0cykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudE1lc3NhZ2UgPSBjaGF0c1tpXVxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlSFRNTCA9IGNoYXRzTW9kdWxlLmJ1aWxkQ2hhdHNIVE1MKGN1cnJlbnRNZXNzYWdlLCB1c2VySWQpXHJcbiAgICAgICAgICAgIHByaW50VG9ET00obWVzc2FnZUhUTUwsIFwiI1wiICsgY2hhdENvbnRhaW5lci5pZClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgQVBJTWFuYWdlci5mZXRjaFdpdGhFeHBhbmRlZFVzZXJJbmZvKFwiYXJ0aWNsZXNcIiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKGFydGljbGVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50QXJ0aWNsZSA9IGFydGljbGVzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IGFydGljbGVIVE1MID0gYXJ0aWNsZU1vZHVsZS5jcmVhdGVBcnRpY2xlSFRNTChjdXJyZW50QXJ0aWNsZSwgdXNlcklkKVxyXG4gICAgICAgICAgICBwcmludFRvRE9NKGFydGljbGVIVE1MLCBcIiNcIiArIGFydGljbGVDb250YWluZXIuaWQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGFzaGJvYXJkUmVmcmVzaGlvbmFsIiwiaW1wb3J0IGRhc2hib2FyZFJlZnJlc2hpb25hbCBmcm9tIFwiLi9kYXNoYm9hcmRSZWZyZXNoaW9uYWxcIjtcclxuXHJcbi8vIGltcG9ydCBldmVudCBsaXN0ZW5lcnMgbW9kdWxlIGZyb20gXCIuL2V2ZW50bGlzdGVuZXJzXCJcclxuXHJcbi8vIGhlbGxvIHdvcmxkXHJcblxyXG5kYXNoYm9hcmRSZWZyZXNoaW9uYWwoKSIsImNvbnN0IHByaW50VG9ET00gPSAod2hhdCwgd2hlcmUpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7d2hlcmV9YCkuaW5uZXJIVE1MICs9IHdoYXRcclxufVxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByaW50VG9ET007XHJcbiIsImZ1bmN0aW9uIHRpbWVDb252ZXJ0ZXIgKHRpbWVzdGFtcCkge1xyXG4gICAgdmFyIGEgPSBuZXcgRGF0ZShwYXJzZUludCh0aW1lc3RhbXApKTtcclxuICAgIHZhciBtb250aHMgPSBbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xyXG4gICAgdmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcbiAgICB2YXIgbW9udGggPSBtb250aHNbYS5nZXRNb250aCgpXTtcclxuICAgIHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcbiAgICB2YXIgaG91ciA9IGEuZ2V0SG91cnMoKTtcclxuICAgIHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuICAgIHZhciB0aW1lID0gZGF0ZSArICcgJyArIG1vbnRoICsgJyAnICsgeWVhciArICcgJyArIGhvdXIgKyAnOicgKyBtaW47XHJcbiAgICByZXR1cm4gdGltZTtcclxuICB9O1xyXG5cclxuICBleHBvcnQgZGVmYXVsdCB0aW1lQ29udmVydGVyOyJdfQ==
