import clickBubbler from "./eventListeners";

const landing = () => {
    const HTMLcode = `<h1>Welcome!</h1>
    <div id="listenToMe">
    <button id="register--link">Register</button> | <button id="login--link">Login</button>
    </div>`;
    document.querySelector("#listenerBlock").outerHTML = document.querySelector("#listenerBlock").outerHTML
    document.querySelector("#formSection").innerHTML = HTMLcode;
    dashboardContainer.classList.add("hidden");
    clickBubbler.firstLoad();
    document.getElementById("usernameWelcome").innerHTML = "";
};

export default landing;