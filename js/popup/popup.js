var curCur = {};
var favNode = '';
var favFilled = '<svg style="fill:orange;stroke:black" class="favIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>';
var staticDB = '';
var animatedDB = '';
var uploadedDB = '';
var storage_data = {};
var sendToExt = '';
var translated = '';
var cs_template = '';


function sendMessageToWeb() {
    chrome.runtime.sendMessage({update_tab: "update"},
            function (response) { });
}

cursor_assist.addEventListener('change', function () {
    localStorage.setItem('cursor_assist', cursor_assist.checked);
    if (storage_data.hasOwnProperty('cursor'))
        resizeCurSvg(storage_data.cursor.path, 'cursor');
}, false);


function showCollection() {
    list = Array.from(document.getElementById('listCategory').children);
    list.forEach(function (el) {
        if (el.querySelector('.iconsContainer').childNodes.length < 1) {
            el.style.display = 'none';
        }
    });
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


function setIcon(e, fromStorage) {
    if (!e.target.hasAttribute('jsondata'))
        return;
    data = JSON.parse(e.target.getAttribute('jsondata'));
    data2 = JSON.parse(e.target.getAttribute('jsondata'));

    curCur = JSON.parse(e.target.getAttribute('jsondata')).cursor;
    toDataURL(curCur.path, function (dataUrl) {
        curCur.path = dataUrl;
        chrome.storage.local.set({curCur: JSON.stringify(curCur)});
        assist_default.src = curCur.path;
        assist_assist.src = resizeCurSvgPrevew(curCur.path);        
    });


    storage_data.cursor = data.cursor;
    storage_data.pointer = data.pointer;
    delete storage_data.cursor.path;
    delete storage_data.pointer.path;
    storage_data.type = 'static';
    storage_data.statbase_ext = staticDB.static;


    toDataURL(data2.cursor.path, function (dataUrl) {
        storage_data.cursor.path = dataUrl;
        if (storage_data.cursor) {
            current_cursor.style.display = 'flex';
            current_cursor_img.src = curCur.path;
        }
        toDataURL(data2.pointer.path, function (dataUrl) {
            storage_data.pointer.path = dataUrl;
            changeSizeNonHD('cursor');
        });
    });
}



function hideShowFav() {
    if (favorite.getElementsByClassName('iconsContainer')[0].children.length < 1) {
        favorite.style.display = 'none';
    } else
        favorite.style.display = 'block';
}

function setFavFlag(catId, iconId, flag) {
    list = staticDB.static[catId].items;
    list.forEach(function (e, i) {
        if (e.id == iconId)
            staticDB.static[catId].items[i].favorite = flag;
    });
    chrome.storage.local.set({
        static: staticDB.static
    });
    hideShowFav();
}

function removeCursor(e) {
    node = e.target.parentNode;
    for (i = 0; i < 10; i++) {
        node = node.parentNode;
        if (node)
            if ((node.classList[0] == 'icon') || (node.classList[0] == 'iconAni')) {
                type = node.dataset.type;
                cat = (node.dataset.category) ? node.dataset.category : 0;
                iconId = node.dataset.iconId;
                favNodes = Array.from(document.querySelectorAll('#favorite .iconsContainer .icon'));
                favNodes.forEach(function (e) {
                    if (e.dataset.iconId == iconId)
                        e.remove();
                });


                if (type == 'static') {
                    r = staticDB.static[cat].items;

                    r.forEach(function (el, i) {

                        if (el.id == iconId) {
                            staticDB.static[cat].items[i].removed = 1;
                            storage_data.statbase_ext = staticDB.static;
                            chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
                            chrome.storage.local.set({static: staticDB.static});
                            return;
                        }
                    });
                }


                node.remove();
                showCollection();
                changeSizeNonHD('cursor');
                sendMessageToWeb();
                break;
            }
    }
}


function removeFromFav(e, fromIcons) {
    if (fromIcons == undefined || fromIcons == null) {
        fromIcons = false;
    }

    node = e.target.parentNode;
    for (i = 0; i < 10; i++) {
        node = node.parentNode;
        if (node.classList[0] == 'icon') {
            cat = node.dataset.category;
            id = node.dataset.iconId;
            if (fromIcons) {
                el = document.querySelectorAll('#listCategory #' + cat)[0].childNodes[1].childNodes;
                el.forEach(function (e, i) {
                    if (el[i].dataset.iconId == id) {
                        el[i].childNodes[1].remove();
                        el[i].appendChild(returnTooltip(false, true));
                    }
                });

            }

            node.children[1].children[0].children[0].remove();
            nodeFav = document.createElement('div');
            nodeFav.className = 'favIcon';
            nodeFav.innerHTML = '<svg class="favIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z"/></svg>'
            nodeFav.onclick = function (e) {
                addToFav(e);
            };
            node.children[1].children[0].insertBefore(nodeFav, node.children[1].children[0].childNodes[0]);
            for (i = 0; i < favorite.children[1].children.length; i++) {
                el = favorite.children[1].children[i];
                if ((el.dataset.category == node.dataset.category) && (el.dataset.iconId == node.dataset.iconId))
                    el.remove();
            }
            ;
            setFavFlag(node.dataset.category, node.dataset.iconId, 0);
            break;
        }
    }
}

function addToFav(e) {
    node = e.target.parentNode;
    for (i = 0; i < 10; i++) {
        node = node.parentNode;
        if (node.classList[0] == 'icon') {
            favIcon = node.cloneNode(true);
            cnt = favIcon.childNodes[1].childNodes[0].childElementCount;
            for (i = 0; i < cnt; i++) {
                favIcon.childNodes[1].childNodes[0].childNodes[0].remove();
            }

            node.getElementsByClassName('favIcon')[0].remove();
            nodeFav = document.createElement('div');
            nodeFav.className = 'favIcon';
            nodeFav.innerHTML = favFilled;
            nodeFav.onclick = function (e) {
                removeFromFav(e);
            };

            r = nodeFav.cloneNode(true);
            node.getElementsByClassName('tooltiptext')[0].insertBefore(nodeFav, node.getElementsByClassName('tooltiptext')[0].childNodes[0]);
            favIcon.childNodes[1].childNodes[0].appendChild(r);
            r.onclick = function (e) {
                removeFromFav(e, true);
            };
            favIcon.onclick = function (e) {
                setIcon(e);
            };
            favorite.children[1].appendChild(favIcon);
            setFavFlag(node.dataset.category, node.dataset.iconId, 1);
            break;
        }
    }
    return true;
}


function returnTooltip(isFav, isRemovable, hideFav) {
    if (isRemovable == undefined || isRemovable == null) {
        isRemovable = false;
    }
    if (hideFav == undefined || hideFav == null) {
        hideFav = false;
    }

    nodeTooltip = document.createElement('div');
    nodeTooltip.className = 'tooltip';
    nodeSpan = document.createElement('span');
    nodeSpan.className = 'tooltiptext';
    if (!hideFav) {
        if (!isFav) {
            nodeFav = document.createElement('div');
            nodeFav.className = 'favIcon';
            nodeFav.innerHTML = '<svg class="favIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM405.8 317.9l27.8 162L288 403.5 142.5 480l27.8-162L52.5 203.1l162.7-23.6L288 32l72.8 147.5 162.7 23.6-117.7 114.8z"/></svg>'
            nodeFav.onclick = function (e) {
                addToFav(e);
            };
        } else {
            nodeFav = document.createElement('div');
            nodeFav.className = 'favIcon';
            nodeFav.innerHTML = favFilled;
            nodeFav.onclick = function (e) {
                removeFromFav(e, true);
            };
        }
        nodeSpan.appendChild(nodeFav);
    }

    if (isRemovable) {
        nodeFav = document.createElement('div');
        nodeFav.className = 'favIcon';
        nodeFav.innerHTML = '<svg class="removeIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"/></svg>';
        nodeFav.onclick = function (e) {
            removeCursor(e);
        };
        nodeSpan.appendChild(nodeFav);
    }
    nodeTooltip.appendChild(nodeSpan);
    nodeSpan.appendChild(nodeFav);
    nodeTooltip.appendChild(nodeSpan);
    return nodeTooltip;
}

function removeCursorFromBase(id, cat, type) {
    if (type == 'stat') {
        items = staticDB.static[cat].items;
        items.forEach(function (el, i) {
            if (el.id == id) {
                staticDB.static[cat].items = staticDB.static[cat].items.splice(i, 1);
                storage_data.statbase_ext = staticDB.static;
                chrome.storage.local.set({storage_data: JSON.stringify(storage_data)});
                chrome.storage.local.set({static: staticDB.static});
            }
        });
    }
}


function cursorOver(e) {
    cursor = e.target;
    if (cursor.className != 'smallIcon')
        return;
    if (!cursor.hasAttribute('jsondata'))
        return;
    cursor_data = JSON.parse(cursor.getAttribute('jsondata')).pointer.path;
    cursor.src = cursor_data;
}

function cursorOut(e) {
    cursor = e.target;
    if (cursor.className != 'smallIcon')
        return;
    if (!cursor.hasAttribute('jsondata'))
        return;
    cursor_data = JSON.parse(cursor.getAttribute('jsondata')).cursor.path;
    cursor.src = cursor_data;
}

function drawStatic() {
    chrome.storage.local.get('static', function (items) {
        staticDB = items;
        for (var index in items.static) {
            if (chrome.i18n.getUILanguage().substr(0, 2) == 'ru')
                catName = items.static[index].name;
            else if (chrome.i18n.getUILanguage().substr(0, 2) == 'es')
                catName = items.static[index].nameEs;
            else
                catName = items.static[index].nameEn;

            cursorsArray = items.static[index].items;
            //CREATE FAVORITE NODE
            if (!$('#favorite').length) {
                favNode = document.createElement('div');
                favNode.id = 'favorite';
                nodeTitle = document.createElement('h2');
                nodeTitle.innerHTML = chrome.i18n.getMessage('favorite');
                favNode.appendChild(nodeTitle);
                nodeFavIconsContainer = document.createElement('div');
                nodeFavIconsContainer.className = 'iconsContainer';
                favNode.className = 'catContainer';
                favNode.appendChild(nodeFavIconsContainer);
                listCategory.appendChild(favNode);
                nodeFav1 = document.createElement('div');
                nodeFav1.style.position = 'absolute';
                nodeFav1.style.top = '3px';
                nodeFav1.style.left = '6px';
                nodeFav1.innerHTML = '<svg style="z-index: 5;fill:orange;stroke:black;" class="favIconSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>';
                favNode.appendChild(nodeFav1);
            }
            nodeMain = document.createElement('div');
            nodeMain.id = index;
            nodeIconsContainer = document.createElement('div');
            nodeIconsContainer.className = 'iconsContainer';
            nodeTitle = document.createElement('h1');
            nodeTitle.innerHTML = catName;
            nodeMain.appendChild(nodeTitle);
            nodeMain.className = 'catContainer';
            nodeMain.appendChild(nodeIconsContainer)

            listCategory.appendChild(nodeMain);
            cursorsArray.forEach(function (el, i) {
                if (el.cursor.path.search('data:text/html;') > -1) {
                    removeCursorFromBase(el.id, index, 'stat');
                    return;
                }
                if (el.removed)
                    return;
                icon = document.createElement('div');
                icon.className = 'icon';
                img = document.createElement('img');
                img.className = 'smallIcon';
                img.dataset.src = el.cursor.path;
                img.setAttribute('jsondata', JSON.stringify(el));
                img.setAttribute('type', 'static');
                icon.dataset.jsondata = JSON.stringify(el);
                icon.dataset.type = 'static';
                icon.dataset.category_id = items.static[index].id;
                icon.dataset.iconId = el.id;
                icon.dataset.category = index;
                icon.appendChild(img);
                favIcon = icon.cloneNode(true);
                icon.onmouseover = function (e) {
                    cursorOver(e);
                };
                icon.onmouseout = function (e) {
                    cursorOut(e);
                };
                icon.onclick = function (e) {
                    setIcon(e);
                };
                favIcon.onclick = function (e) {
                    setIcon(e);
                };

                isInFav = (el.favorite == 1) ? true : false;
                icon.appendChild(returnTooltip(isInFav, true, false));
                nodeIconsContainer.appendChild(icon);
                if (el.favorite == 1) {
                    favIcon.appendChild(returnTooltip(isInFav, false, false));
                    nodeFavIconsContainer.insertBefore(favIcon, nodeFavIconsContainer.childNodes[0]);
                }
            });
            images = document.querySelectorAll(".smallIcon");
            lazyload(images);
        }
        loader.style.display = 'none';
        showCollection();
    });

    return true;
}


chrome.storage.local.get('curCur', function (e) {
    if (e.hasOwnProperty('curCur')) {
        curCur = JSON.parse(e.curCur);
    }
});


setTimeout(function () {
    chrome.storage.local.get('translated', function (data) {
        if (data.hasOwnProperty('translated')) {
            translated = data.translated;
        }
        drawStatic();
    });
}, 100);
