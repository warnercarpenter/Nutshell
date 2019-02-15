import dashboardRefreshional from "./dashboardRefreshional";

// import event listeners module from "./eventlisteners"

// hello world

import listeners from "./eventListeners";
import registrationHandler from "./registration";

let userId = sessionStorage.getItem("userId");
if (userId !== null) {
    dashboardRefreshional()
    listeners.listener();
} else {
    const HTMLsquirt = registrationHandler.buildRegistrationForm();
    document.querySelector("#dashboardContainer").innerHTML = HTMLsquirt;
    listeners.register();
}

