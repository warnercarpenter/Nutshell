import friendsModule from "./friends";

const friendsListener = () => {
    document.getElementById("friend--add").addEventListener("click", function(event) {
        document.getElementById("friendDisplay").innerHTML = friendsModule.buildFriendsForm()
    })
}

export default friendsListener