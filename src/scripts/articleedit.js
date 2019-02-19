import APIManager from "./APIManager";
import dashboardRefreshional from "./dashboardRefreshional";

const articleEdit = () => {
    const articleDisplay = document.getElementById("articleDisplay")
    articleDisplay.addEventListener("click", function(event) {
        if (event.target.id.split("--")[1] === "edit") {
            const articleId = parseInt(event.target.id.split("--")[2])
            let articleObject = ""
            APIManager.fetchWithoutUserInfo("articles").then(function(articles) {
                articleObject = articles.find(article => article.id === articleId)
                articleDisplay.innerHTML = `
                    <div>Edit article title</div><input type="text" id="articleTitleEdit" value="${articleObject.title}"></input>
                    <div>Edit article summary</div><input type="text" id="articleSummaryEdit" value="${articleObject.summary}"></input>
                    <div>Edit article url</div><input type="text" id="articleUrlEdit" value="${articleObject.url}"></input>
                <button id="articleEditSave">Save</button><button id="articleEditCancel">Cancel</button>`

                document.getElementById("articleTitleEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("articleEditSave").click();
                    }
                  });
                document.getElementById("articleSummaryEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("articleEditSave").click();
                    }
                  });
                document.getElementById("articleUrlEdit").addEventListener("keyup", function(event) {
                    if (event.keyCode === 13) {
                      document.getElementById("articleEditSave").click();
                    }
                  });

                document.getElementById("articleEditSave").addEventListener("click", function(event) {
                    articleObject.title = document.getElementById("articleTitleEdit").value
                    articleObject.summary = document.getElementById("articleSummaryEdit").value
                    articleObject.url = document.getElementById("articleUrlEdit").value
                    APIManager.Put("articles", articleId, articleObject).then(dashboardRefreshional)
                })
                document.getElementById("articleEditCancel").addEventListener("click", function(event) {
                    dashboardRefreshional()
                })
            })
        }
    })
}

export default articleEdit