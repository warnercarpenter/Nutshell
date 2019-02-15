const articleModule = {
    buildArticleForm: (articleId) => {
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
        </form>`
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
        }

        return articleObject

    },
    createArticleHTML: articleObject => {
        return `<section class="articles" id="article--${articleObject.id}">
        <div class="articleTitle">${articleObject.name}</div>
        <div>${articleObject.summary}</div>
        <div>${articleObject.url}</div>
        </section>`
    },
}

export default articleModule