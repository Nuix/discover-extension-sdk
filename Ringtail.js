(function () {
    'use strict';

    var COMPATIBLE_RINGTAIL_VERSION = '9.5.008',
        TEST_MODE = window.process && window.process.env && window.process.env.NODE_ENV === 'test',
        allowedDomains = null,
        hostingDomain = null,
        initialized = false,
        listeners = new Map(),
        pendingClientQueries = new Map(),
        lastRequestId = Date.now(),
        activeDoc = {};

    /**
     * Returns a promise that resolves once the extension has been registered
     * and is ready to communicate with Ringtail.
     */
    function initialize(domainWhitelist) {
        if (initialized) {
            return Promise.resolve(Ringtail.Context);
        }
        if (domainWhitelist && (!Array.isArray(domainWhitelist) || domainWhitelist.some(function (domain) { return typeof domain !== 'string'; }))) {
            return Promise.reject(new Error('domainWhitelist must be an array of strings'));
        }

        initialized = true;
        allowedDomains = domainWhitelist || [];
        window.addEventListener('message', handleWindowMessage, false);

        return clientQuery('ExtensionReady').then(function () {
            return hostingDomain;
        });
    }

    function checkInitialized() {
        if (!initialized) {
            throw new Error('Ringtail.initialize() has not been called!');
        }
    }

    function getDeferred(requestId) {
        var deferred = pendingClientQueries.get(requestId);
        if (deferred) {
            pendingClientQueries.delete(requestId);
        } else {
            deferred = { resolve: function() {}, reject: function() {} };
        }
        return deferred;
    }

    function compareVersions(version1, version2) {
        const ver1 = version1.split('.');
        const ver2 = version2.split('.');

        for (let i = 0; i < ver1.length; ++i) {
            // ~~ converts undefined and NaN to 0 which is QUITE convenient here
            const diff = ~~ver2[i] - ~~ver1[i];
            if (diff !== 0) return diff;
        }
        return 0;
    }

    function handleWindowMessage(event) {
        var message = event.data;
        var deferred = getDeferred(message.requestId);

        if (allowedDomains.length > 0 && allowedDomains.indexOf(event.origin) < 0) {
            var msg = 'Rejected message from non-whitelisted domain: ' + event.origin;
            console.warn('WARNING:', msg);
            deferred.reject(new Error(msg));
            return;
        }

        switch (message.name) {
            case 'ActiveDocument':
                activeDoc = message.data;
                break;
            case 'UserContext':
                Ringtail.Context = message.data;
                hostingDomain = event.origin;

                if (Ringtail.Context.ringtailVersion && compareVersions(Ringtail.SdkCompatibleWithVersion, Ringtail.Context.ringtailVersion) < 0) {
                    console.warn('WARNING: Ringtail "' + Ringtail.Context.ringtailVersion + '" is older than this SDK\'s compatible version: "' + COMPATIBLE_RINGTAIL_VERSION + '".');
                }
                break;
        }

        if (message.requestId) {
            if (message.name === 'Error') {
                deferred.reject(new Error(message.data.message));
            } else {
                deferred.resolve(message.data);
            }
        } else {
            var callbacks = listeners.get(message.name);
            if (callbacks) {
                callbacks.forEach(function (cb) {
                    try {
                        cb(message);
                    } catch (err) {
                        console.error(err);
                    }
                });
            }
        }
    }

    function sendMessage(name, data, requestId) {
        checkInitialized();
        if (window.parent === window && !TEST_MODE) {
            console.warn('WARNING: Application is not running in an iframe, suppressing communications.');
            return;
        }
        window.parent.postMessage({
            name: name,
            data: data,
            requestId: requestId
        }, '*');
    }
    

    function clientQuery(messageName, data) {
        var requestId = ++lastRequestId;  // Unique ID for this call

        return new Promise(function (resolve, reject) {
            try {
                sendMessage(messageName, data, requestId);
                pendingClientQueries.set(requestId, { resolve: resolve, reject: reject });
            } catch (err) {
                reject(err);
            }
        });
    }

    function serverQuery(graphQlquery, variables) {
        return new Promise(function(resolve, reject) {
            try {
                checkInitialized();
                resolve(fetch(Ringtail.Context.apiUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': Ringtail.Context.apiAuthToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        variables: variables,
                        query: graphQlquery
                    })
                }));
            } catch (err) {
                reject(err);
            }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('request failed: ' + response.statusText);
            }
            return response.json();
        });
    }


    function on(eventName, callback) {
        if (typeof eventName !== 'string' || !eventName) {
            throw new Error('eventName must be a string');
        }
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }
        if (!listeners.has(eventName)) {
            listeners.set(eventName, new Set());
        }
        listeners.get(eventName).add(callback);
    }

    function off(eventName, callback) {
        if (typeof eventName !== 'string' || !eventName) {
            throw new Error('eventName must be a string');
        }
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        var callbacks = listeners.get(eventName);
        if (!callbacks) {
            throw new Error('event listener for "' + eventName + '" not found');
        }
        callbacks.delete(callback);
    }


    function setLoading(loading) {
        return clientQuery('LoadingMask', { show: !!loading });
    }

    function showNotification(status, message){
        return clientQuery('ShowNotification', {status, message});
    }

    function getActiveDocument() {
        checkInitialized();
        return activeDoc;
    }

    function setActiveDocument(mainId) {
        return clientQuery('ActiveDocument_Set', { mainId: mainId });
    }


    function getDocumentSelection() {
        return clientQuery('DocumentSelection_Get');
    }

    function setDocumentSelection(mainIds) {
        return clientQuery('DocumentSelection_Set', { mainIds: mainIds });
    }

    function selectDocuments(add, mainIds) {
        return clientQuery('DocumentSelection_Select', { mainIds: mainIds, add: !!add });
    }

    function selectAllDocuments() {
        return clientQuery('DocumentSelection_Set', { selectAll: true });
    }


    function getBrowseSelection(fieldId) {
        return clientQuery('BrowseSelection_Get', {
            fieldId: fieldId
        });
    }

    function setBrowseSelection(fieldId, values) {
        return clientQuery('BrowseSelection_Set', {
            fieldId: fieldId,
            values: values
        });
    }

    function selectBrowseItems(fieldId, add, values) {
        return clientQuery('BrowseSelection_Select', {
            fieldId: fieldId,
            values: values,
            add: add,
        });
    }

    function setTools(toolsConfig) {
        return clientQuery('Tools_Set', toolsConfig);
    }

    function getToolValues() {
        return clientQuery('Tools_GetValues');
    }

    function setToolWindowOkButtonEnabled(enabled){
        return clientQuery('ToolWindow_SetOkButtonEnabled', {enabled});
    }

    function closeToolWindow(){
        return clientQuery('ToolWindow_Close');
    }

    function loadDocumentSearchResult(searchResultId){
        return clientQuery('ResultSet_Set', {searchResultId});
    }

    window.Ringtail = {
        SdkCompatibleWithVersion: COMPATIBLE_RINGTAIL_VERSION,

        initialize: initialize,
        on: on,
        off: off,

        setLoading: setLoading,
        setTools: setTools,

        showNotification: showNotification,

        query: serverQuery,
        clientQuery: clientQuery,


        Context: null,

        ActiveDocument: {
            get: getActiveDocument,
            set: setActiveDocument,
        },

        DocumentSelection: {
            get: getDocumentSelection,
            set: setDocumentSelection,
            select: selectDocuments,
            selectAll: selectAllDocuments,
        },

        BrowseSelection: {
            get: getBrowseSelection,
            set: setBrowseSelection,
            select: selectBrowseItems,
        },

        Tools: {
            set: setTools,
            getValues: getToolValues,
        },

        ToolWindow: {
            setOkButtonEnabled: setToolWindowOkButtonEnabled,
            close: closeToolWindow,
            loadSearchResult: loadDocumentSearchResult,
        }
    };
}());
