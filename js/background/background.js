function setStatic(request, static_database) {
    if (!static_database.hasOwnProperty(request.cursorAlt)) {
        static_database[request.cursorAlt] = {
            id: parseInt(request.cursorCat),
            name: request.cursorBase,
            nameEn: request.cursorBaseEn,
            nameEs: request.cursorBaseEs,
            items: []
        };
    }

    items = static_database[request.cursorAlt].items;

    for (i = 0; i < items.length; i++) {
        e = static_database[request.cursorAlt].items[i];
        if (e.id === parseInt(request.cursorId)) {
            static_database[request.cursorAlt].items[i].favorite = 0;
            static_database[request.cursorAlt].items[i].removed = 0;
            chrome.storage.local.set({
                static: static_database
            });
            return;
        }
    }


    static_database[request.cursorAlt].items.push({
        favorite: 0,
        id: parseInt(request.cursorId),
        name: request.cursorName,
        removed: 0,
        cursor: {
            offsetX: request.offsetX,
            offsetY: request.offsetY,
            path: request.c_file_data
        },
        pointer: {
            offsetX: request.offsetX_p,
            offsetY: request.offsetY_p,
            path: request.p_file_data
        }
    });

    static_db = static_database;
    chrome.storage.local.set({
        static: static_database
    }, function(){
        //transalteCategories();
    });       
    
    return;
}


chrome.runtime.onMessageExternal.addListener(
        function (request, sender, sendResponse) {
            try {
                if (request.task === 'getStatDB') {
                    chrome.storage.local.get('static', function (r) {
                        sendResponse({result: r.static});
                        return true;
                    });
                    return true;
                }

                if (request.cursorType === 'stat') {
                    chrome.storage.local.get('static', function (r) {
                        static_database = r.static;
                        setStatic(request, static_database);
                        sendResponse({result: true});
                        return true;
                    });
                    return true;

                }
            } catch (e) {
                console.log(e);
                return true;
            }
            return true;
        });