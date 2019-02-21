const checkObjectError = (objectToCheck) => {
    let hasError = false
    const entries = Object.entries(objectToCheck)
    entries.forEach(function(entry) {
        if (entry[1] === "" || (entry[0] === "date" && isNaN(entry[1]))) {
            hasError = true
        }
    })
    return hasError
}

export default checkObjectError