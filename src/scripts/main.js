import dashboardRefreshional from "./dashboardRefreshional";
import clickBubbler from "./eventListeners";
import landing from "./logout";

if (sessionStorage.hasOwnProperty("userId")) {
    let userId = sessionStorage.getItem("userId");
    dashboardRefreshional()
    clickBubbler.listener();
    clickBubbler.logout();
} else {
    landing();
};