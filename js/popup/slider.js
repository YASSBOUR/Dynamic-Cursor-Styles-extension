
function openWebSite() {
    localStorage.setItem('localLastId', localStorage.getItem('onlineLastId'));
    if ((chrome.i18n.getUILanguage() != 'ru') && (chrome.i18n.getUILanguage() != 'uk'))
        window.open('https://en.cursor.style');
    else
        window.open('https://cursor.style');
}
openWebsite.onclick = openWebSite;
openWebsiteMore.onclick = openWebSite;


curSize.value = (localStorage.getItem('curPos')) ? localStorage.getItem('curPos') : 25;



function resizeCurSvgPrevew(path) {
    dataURL = path.split('base64,');
    data_type = dataURL[0];
    data = atob(dataURL[1]);
    div = document.createElement('div');
    div.innerHTML = data;

    pointer = document.createElement('polygon');
    pointer.setAttribute('points', '-0.1,60 65.7,-0.7 -0.1,-0.7 ');
    div.querySelector('svg').appendChild(pointer);


    div.querySelector('svg').setAttribute('height', curSize.value);
    div.querySelector('svg').setAttribute('width', curSize.value);

    data = div.innerHTML;
    data = btoa(data);
    data = data_type + 'base64,' + data;
    dataURL = data;
    return dataURL;
}

function resizeCurSvg(path, type) {
    if (type == "cursor") {
        storage_data.cursor.offsetX = curCur.offsetX;
        storage_data.cursor.offsetY = curCur.offsetY;
        path = curCur.path;
    }
    dataURL = path.split('base64,');
    data_type = dataURL[0];
    data = atob(dataURL[1]);
    div = document.createElement('div');
    div.innerHTML = data;

    if ((cursor_assist.checked) && (type == "cursor")) {
        pointer = document.createElement('polygon');
        pointer.setAttribute('points', '-0.1,60 65.7,-0.7 -0.1,-0.7 ');
        div.querySelector('svg').appendChild(pointer);
        storage_data.cursor.offsetX = 0;
        storage_data.cursor.offsetY = 0;
        console.log(storage_data.cursor.offsetX);
    }

    div.querySelector('svg').setAttribute('height', curSize.value);
    div.querySelector('svg').setAttribute('width', curSize.value);


    data = div.innerHTML;
    data = btoa(data);
    data = data_type + 'base64,' + data;
    dataURL = data;

    if (type === 'cursor') {
        storage_data.cursor.path = dataURL;
        document.querySelector('#cursor_preview img').src = dataURL;
        changeSizeNonHD('pointer');
        chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
    } else {
        storage_data.pointer.path = dataURL;
        chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
        sendMessageToWeb();
    }
}

function changeSizeNonHD(type) {
    if (!storage_data.hasOwnProperty('cursor'))
        return;
    resizeCurSvg(storage_data[type].path, type);
}

chrome.storage.local.get('storage_data', function (e) {
    if (!e.hasOwnProperty('storage_data'))
        return;
    curSize.value = JSON.parse(e.storage_data).width;
});

curSize.oninput = function () {
    storage_data.width = this.value;
    changeSizeNonHD('cursor');
    chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
};


document.querySelector('.rangeSlider').onmouseenter = function () {
    if (!storage_data.cursor)
        return;
    document.querySelector('#cursor_preview img').src = storage_data.cursor.path;
    document.querySelector('#cursor_preview').style.visibility = 'visible';
};

document.querySelector('.rangeSlider').onmouseleave = function () {
    if (!storage_data.cursor)
        return;
    document.querySelector('#cursor_preview').style.visibility = 'hidden';
};