importScripts(
        '/js/background/collections.js',
        '/js/background/background.js');


var static_db = '';
var is_updating = false;


function stat() {
//    (async () => {
//        var rawResponse = await fetch('https://cursor.style/update/set', {
//            method: 'POST'
//        });
//    })();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
{
    if (request.update_tab === "send_response") {
        chrome.storage.local.get('day').then(function (old_day) {
            var day = new Date().getDate();
            if (!old_day.day) {
                stat();
                chrome.storage.local.set({'day': day});
            } else {
                if (old_day.day != day) {
                    stat();
                    chrome.storage.local.set({'day': day});
                }
            }
        });

    }

    if (request.update_tab === "update") {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tb => {
                if (tb.url.indexOf('://extensions') < 1) {
                    chrome.scripting.executeScript({
                        target: {tabId: tb.id, allFrames: true},
                        files: [
                            '/js/content/main.js'
                        ]
                    }, function () {});
                }
            });
        });
    }
    return true;
});


function removeCursorStyleTab() {
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.url) {
                if (tab.url.search('//cursor.style') != -1) {
                    chrome.tabs.remove(tab.id, function () { });
                }
            }
        });
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function install() {
    removeCursorStyleTab();
    const extUrl = chrome.runtime.getURL("");

    // GENERATING BASE FOR STATIC CURSORS
    data = JSON.stringify(staticDB);
    data = data.replace(/{ext}/g, extUrl);

    chrome.storage.local.set({
        static: JSON.parse(data)
    });

    storage_data = {enabled: true, width: 25, statbase_ext: JSON.parse(data)};
    chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});

    if ((chrome.i18n.getUILanguage() != 'ru') && (chrome.i18n.getUILanguage() != 'uk')) {
        chrome.tabs.create({url: 'https://en.cursor.style/success'});
    } else {
        chrome.tabs.create({url: 'https://cursor.style/success'});
    }
}


// CLOSE CHROME EXTENSION PAGE TAB. THE REASON IS THAT CURSOR IS NOT WORKING ON THIS 
// TAB AND USERS JUST UNINSTALL EXTENSION WHEN THEY SEE THAT
function closeExtTab() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (tab.url.search(chrome.runtime.id) > 0)
                chrome.tabs.remove(tab.id, function () { });
        });
    });
}

function updateImagesLink() {
    chrome.storage.local.get('static', function (items) {
        stat = items.static;
        for (key in stat) {
            for (item in stat[key].items) {
                if (stat[key].items[item].cursor.path.slice(-4) !== '.svg') {
                    stat[key].items[item].cursor.path += '.svg';
                }
                if (stat[key].items[item].pointer.path.slice(-4) !== '.svg') {
                    stat[key].items[item].pointer.path += '.svg';
                }
            }
        }
        chrome.storage.local.set({static: stat});
    });
}


chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        install();
        closeExtTab();
        chrome.tabs.create({'url': 'https://youtube-skins.com/?cs'});
    } else if (details.reason == "update") {
        updateImagesLink();
        chrome.storage.local.get('adskipper', function (e) {
            if (!e.hasOwnProperty('adskipper')) {
                chrome.storage.local.set({adskipper: true});
                chrome.tabs.create({'url': 'https://chromewebstore.google.com/u/2/detail/ad-skipper-for-youtube/gideponcmplkbifbmopkmhncghnkpjng'});
            }
        });
    }
});


if ((chrome.i18n.getUILanguage() !== 'ru') && (chrome.i18n.getUILanguage() !== 'uk')) {
    chrome.runtime.setUninstallURL('https://en.cursor.style/feedback');
} else {
    chrome.runtime.setUninstallURL('https://cursor.style/feedback');
}