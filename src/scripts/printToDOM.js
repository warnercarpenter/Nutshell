const printToDOM = (what, where) => {
    document.querySelector(`${where}`).innerhtml += what
}