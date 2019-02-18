function timeConverter (timestamp) {
    let a = new Date(parseInt(timestamp));
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();

    let timestring = String(a).split(" ");
    let time = timestring.slice(0,5).reduce((currentEl, nextEl) => `${currentEl} ${nextEl}`);

    return time;
  };

  export default timeConverter;