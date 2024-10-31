e = Array.from(document.querySelectorAll('[data-lang]'));
for (var i in e) {
    try {
        if (e[i].dataset.lang === 'get_more') {
            str = chrome.i18n.getMessage('more_cursors').toUpperCase();
        } else {
            str = chrome.i18n.getMessage(e[i].dataset.lang);
        }

        if ((e[i].dataset.lang === 'old_browser') || (e[i].dataset.lang === 'hd_mode_warn') )
            e[i].innerHTML = str
        else
            e[i].textContent = str;
    } catch (e) {
    }
}

document.querySelector('#onofflabel').setAttribute('data-tg-off', chrome.i18n.getMessage('off'));
document.querySelector('#onofflabel').setAttribute('data-tg-on', chrome.i18n.getMessage('on'));