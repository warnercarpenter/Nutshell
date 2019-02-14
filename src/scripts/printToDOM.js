const printToDOM = (what, where) => {
    document.querySelector(`${where}`).innerHTML += what
}


export default printToDOM;
