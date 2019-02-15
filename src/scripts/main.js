import dashboardRefreshional from "./dashboardRefreshional";

// import event listeners module from "./eventlisteners"

// hello world

import clickBubbler from "./eventListeners";


let userId = sessionStorage.getItem("userId");
if (userId === null) {
    const HTMLcode = `<h1>Welcome!</h1>
    <a href="#" id="register--link">Register</a> | <a href="#" id="login--link">Login</a>
    `;
    document.querySelector("#dashboardContainer").innerHTML = HTMLcode;
} else {
    dashboardRefreshional()
    clickBubbler.listener();
}