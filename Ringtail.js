(function () {
    'use strict';

    var COMPATIBLE_RINGTAIL_VERSION = '9.5.005',
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

    function handleWindowMessage(event) {
        var message = event.data;

        if (allowedDomains.length > 0 && allowedDomains.indexOf(event.origin) < 0) {
            return;
        }

        switch (message.name) {
            case 'ActiveDocument':
                activeDoc = message.data;
                break;
            case 'UserContext':
                Ringtail.Context = message.data;
                hostingDomain = event.origin;
                if (Ringtail.Context.ringtailVersion < COMPATIBLE_RINGTAIL_VERSION) {
                    console.warn('WARNING: Ringtail "' + Ringtail.Context.ringtailVersion + '" is older than this SDK\'s compatible version: "' + COMPATIBLE_RINGTAIL_VERSION + '".');
                }
                break;
        }

        if (message.requestId) {
            var deferred = pendingClientQueries.get(message.requestId);
            if (deferred) {
                if (message.name === 'Error') {
                    deferred.reject(new Error(message.data.message));
                } else {
                    deferred.resolve(message.data);
                }
                pendingClientQueries.delete(message.requestId);
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
                        'Authorization': Ringtail.Context.authToken,
                        'ApiKey': Ringtail.Context.apiKey,
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

    window.Ringtail = {
        initialize: initialize,
        on: on,
        off: off,

        setLoading: setLoading,
        setTools: setTools,

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
    };
}());
