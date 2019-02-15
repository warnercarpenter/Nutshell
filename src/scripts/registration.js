const registrationLoginHandler = {
    buildRegistrationForm: () => {
        return `<form id="registrationForm">
        <fieldset>
            <label for="email">Email:</label>
            <input type="text" name="email" id="email"></input>
        </fieldset>
        <fieldset>
            <label for="username">Username:</label>
            <input type="text" name="username" id="username"></input>
        </fieldset>
        <fieldset>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password"></input>
        </fieldset>
        <fieldset>
            <label for="firstName">First Name:</label>
            <input type="text" name="firstName" id="firstName"></input>
        </fieldset>
        <fieldset>
            <label for="lastName">Last Name:</label>
            <input type="text" name="lastName" id="lastName"></input>
        <button id="registration--create">Register</button>
        `
    },
    createRegistrationObject: () => {
        let username = document.querySelector("#username").value
        let password = document.querySelector("#password").value
        let firstName = document.querySelector("#firstName").value
        let lastName = document.querySelector("#lastName").value
        let email = document.querySelector("#email").value

        const userObject = {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email

        }
        return userObject
    },
    buildLoginForm: () => {
        return `<form id="loginForm">
        <fieldset>
            <label for="username">Username:</label>
            <input type="text" name="username" id="username"></input>
        </fieldset>
        <fieldset>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password"></input>
        </fieldset>
        <fieldset>
        `
    },
    createLoginObject: () => {
        let username = document.querySelector("#username").value
        let password = document.querySelector("#password").value

        const userLoginObject = {
            username: username,
            password: password,

        }
        return userLoginObject
    }

}

export default registrationLoginHandler