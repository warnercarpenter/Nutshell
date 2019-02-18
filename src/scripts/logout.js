/*
Author: Panya
Task: load the landing page
*/

import clickBubbler from "./eventListeners";

const landing = () => {
    const HTMLcode = `<h1>Welcome!</h1>
    <div id="listenToMe">
    <a href="#" id="register--link">Register</a> | <a href="#" id="login--link">Login</a>
    </div>`;
    document.querySelector("#formSection").innerHTML = HTMLcode;
    dashboardContainer.classList.add("hidden");
    clickBubbler.firstLoad();
};

export default landing;