c_time = new Date().getTime();

function httpGetAsync(theUrl, callback)
{
    try {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    } catch (e) {
        return false;
    }
}

function setNotification() {
    old_c = localStorage.getItem('localLastId');
    new_c = localStorage.getItem('onlineLastId');
    total = new_c - old_c;
    if (total>0){
        notify_count.innerHTML = '+' + total;
        notify_count.style.display = 'block';
    }
}

function setCount(data) {
    if (!localStorage.hasOwnProperty('localLastId')) {
        localStorage.setItem('localLastId', JSON.parse(data).lastId)
        localStorage.setItem('onlineLastId', JSON.parse(data).lastId)
    } else {
        localLastId = localStorage.getItem('localLastId');
        onlineLastId = JSON.parse(data).lastId;
        localStorage.setItem('onlineLastId', JSON.parse(data).lastId)
    }
    localStorage.setItem('c_time', c_time);
    setNotification();
}

//if (localStorage.hasOwnProperty('c_time')) {
//    c_time = new Date().getTime();
//    past_time = localStorage.getItem('c_time');
//    if (((c_time - past_time) / 1000 / 60) > 5) {
//        data = httpGetAsync('https://api.cursor.style/request.json', setCount);
//    } else {
//        setNotification();
//    }
//} else {
//    data = httpGetAsync('https://api.cursor.style/request.json', setCount);
//}