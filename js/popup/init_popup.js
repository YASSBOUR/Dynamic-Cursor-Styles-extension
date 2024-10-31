function setAssistanceHelpHover() {
    onoff_help.addEventListener('mouseover', () => {
        document.querySelector('.assistance-help').style.display = 'flex';
    });
    onoff_help.addEventListener('mouseleave', () => {
        document.querySelector('.assistance-help').style.display = 'none';
    });
}

chrome.storage.local.get('static', function (items) {
    staticDB = items;
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('storage_data', function (r) {
        if (r.hasOwnProperty('storage_data')) {
            storage_data = JSON.parse(r.storage_data);
            if (storage_data.cursor) {
                current_cursor.style.display = 'flex';
                current_cursor_img.src = curCur.path;
            }
            turnOnOff.checked = storage_data.enabled;
            turnOnOff.onchange();
            setAssistanceHelpHover();
        }
    });


    if (curCur.hasOwnProperty('path')) {
        assist_default.src = curCur.path;
        assist_assist.src = resizeCurSvgPrevew(curCur.path);
    } else {
        toDataURL(staticDB.static.startovyj_nabor.items[5].cursor.path, function (dataUrl) {
            assist_default.src = dataUrl;
            assist_assist.src = resizeCurSvgPrevew(dataUrl);
        });
    }

    cursor_assist.checked = localStorage.hasOwnProperty('cursor_assist') ? JSON.parse(localStorage.getItem('cursor_assist')) : false;

    turnOnOff.onchange = function (e) {
        if (turnOnOff.checked) {
            document.getElementsByClassName('mContainer')[0].classList.remove("disabled");
            storage_data.enabled = true;
        } else {
            storage_data.enabled = false;
            document.getElementsByClassName('mContainer')[0].classList.add("disabled");
        }
        sendMessageToWeb();
        chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
    };
});