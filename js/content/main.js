document.documentElement.dataset.cursorStyle = true;
document.documentElement.dataset.chromeId = chrome.runtime.id;

storage_data = {};

escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
});

function getOffset(c_with, c_offset) {
    cs_pr = (c_with / 85) * 100;
    offset = (c_offset * cs_pr) / 100;
    return Math.round(offset);
}


function reloadStyles() {
    if (document.querySelector('#cursor_style')) {
        document.querySelector('#cursor_style').remove();
    }

    if (!storage_data.enabled)
        return;        
    
    if (!storage_data.hasOwnProperty('cursor'))
        return;


    oxC_cs_cursor = getOffset(storage_data.width, storage_data.cursor.offsetX);
    oyC_cs_cursor = getOffset(storage_data.width, storage_data.cursor.offsetY);

    oxP_cs_cursor = getOffset(storage_data.width, storage_data.pointer.offsetX);
    oyP_cs_cursor = getOffset(storage_data.width, storage_data.pointer.offsetY);

    cursor_style = document.createElement('style');
    cursor_style.id = 'cursor_style';
    cursor_style.innerHTML = escapeHTMLPolicy.createHTML('\
        body {cursor: url( ' + storage_data.cursor.path + ' ) ' + oxC_cs_cursor + ' ' + oyC_cs_cursor + ',auto !important;}\
        .cs_pointer, default_pointer_cs, * a, * button, a *, button *, input[type=range] *, [data-cur=pointer] *, [data-cur=pointer], [data-cur=pointer]:hover, [data-cur=pointer] *:hover, body a, body button, body [type="button"], body input[type="reset"], body input[type="submit"], body [role="button"], ::-webkit-search-cancel-button, ::-webkit-search-decoration, ::-webkit-scrollbar-button, ::-webkit-file-upload-button  {cursor: url( ' + storage_data.pointer.path + ' ) ' + oxP_cs_cursor + ' ' + oyP_cs_cursor + ',auto !important;}\
        .cs_cursor, default_cursor_cs, label, html, input, [data-cur=cursor]:hover, [data-cur=cursor] *:hover {cursor: url( ' + storage_data.cursor.path + ' ) ' + oxC_cs_cursor + ' ' + oyC_cs_cursor + ',auto !important;}\
        ');
    if (document.head)
        document.head.appendChild(cursor_style);
}

function disableButtons(statbase_ext) {
    var ids = [];
    for (r in statbase_ext) {
        items = statbase_ext[r].items;
        for (i = 0; i < items.length; i++) {
            if (items[i].removed == 0)
                ids.push(items[i].id.toString());
        }
    }

    document.querySelectorAll('[data-id]').forEach(function(e){
        btns = e.dataset.id;
        if (ids.includes(btns)){
            e.disabled = true;
        } else {
            e.disabled = false;
        }
    });
}

function getDataFromExtension() {
    chrome.storage.local.get('storage_data', function (e) {
        localStorage.setItem('statbase_ext', JSON.stringify(JSON.parse(e.storage_data).statbase_ext));
        statbase_ext = JSON.parse(e.storage_data).statbase_ext;
        storage_data = JSON.parse(e.storage_data);
        reloadStyles(statbase_ext);
    });
}

function getDataBase() {
    chrome.storage.local.get('static', function (e) {
        disableButtons(e.static);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    checkStyle();
    getDataFromExtension();
    getDataBase();    
    chrome.runtime.sendMessage({update_tab: "send_response"});
});

if (document.readyState === "complete") {
    checkStyle();
    getDataFromExtension();
    getDataBase();
}


document.addEventListener('mouseover', (event) => {
    const cursorValue = getComputedStyle(event.target, null).getPropertyValue('cursor');
    if ((event.target.classList.contains('default_pointer_cs')) || (event.target.classList.contains('default_cursor_land')))
        return;
    if (cursorValue === 'pointer') {
        event.target.classList.add('default_pointer_cs');
    }
    if (cursorValue === 'default' || cursorValue === 'auto') {
        event.target.classList.add('default_cursor_cs');
    }
});


function checkStyle() {
    if (document.querySelectorAll('style')) {
        document.querySelectorAll('style').forEach(function (e) {
            if (e.innerHTML.search('cc_cursor') > 0){                    
                e.remove();
            }
            if (e.innerHTML.search('sweezy-custom') > 0){                    
                e.remove();
            }
            if (e.innerHTML.search('hdgdghnfcappcodemanhafioghjhlbpb_default') > 0){                    
                e.remove();
            }
            if (e.innerHTML.search('magnkhldhhgdlhikeighmhlhonpmlolk_default') > 0){                    
                e.remove();
            }
            if (e.innerHTML.search('pbdpfhmbdldfoioggnphkiocpidecmbp_default') > 0){                    
                e.remove();
            }
        });
    }    
    if (document.querySelectorAll('[data-cursor]')) {
        document.querySelectorAll('[data-cursor]').forEach(function (e) {
            e.remove();
        });
    }
    setTimeout(checkStyle, 2000);
}