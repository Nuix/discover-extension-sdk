(function () {
    'use strict';

    var initialized = false,
        listeners = new Map(),
        pendingClientQueries = new Map(),
        activeDoc = {};

    /**
     * Returns a promise that resolves once the extension has been registered
     * and is ready to communicate with Ringtail.
     */
    function initialize() {
        if (initialized) {
            return Promise.resolve(RingtailSDK.Context);
        }

        initialized = true;
        window.addEventListener('message', handleWindowMessage, false);

        return clientQuery('ExtensionReady');
    }

    function checkInitialized() {
        if (!initialized) {
            throw new Error('RingtailSDK.initialize() has not been called!');
        }
    }

    function handleWindowMessage(event) {
        var message = event.data;

        switch (message.name) {
            case 'ActiveDocument':
                activeDoc = message.data;
                break;
            case 'UserContext':
                RingtailSDK.Context = message.data;
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
        window.parent.postMessage({
            name: name,
            data: data,
            requestId: requestId
        }, '*');
    }
    

    function clientQuery(messageName, data) {
        var requestId = performance.now();  // Unique ID for this call

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
        return new Promise((resolve, reject) => {
            try {
                checkInitialized();
                resolve(fetch(RingtailSDK.Context.apiUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': RingtailSDK.Context.authToken,
                        'ApiKey': RingtailSDK.Context.apiKey,
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

    function selectDocuments(mainIds, add) {
        return clientQuery('DocumentSelection_Select', { mainIds: mainIds, add: !!add });
    }


    function getFacetSelection(fieldId) {
        return clientQuery('FacetSelection_Get', {
            fieldId: fieldId
        });
    }

    function setFacetSelection(fieldId, values) {
        return clientQuery('FacetSelection_Set', {
            fieldId: fieldId,
            values: values
        });
    }

    function selectFacet(fieldId, values, add) {
        return clientQuery('FacetSelection_Select', {
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

    window.RingtailSDK = {
        initialize: initialize,
        on: on,
        off: off,

        setLoading: setLoading,
        setTools: setTools,

        query: serverQuery,


        Context: null,

        ActiveDocument: {
            get: getActiveDocument,
            set: setActiveDocument,
        },

        DocumentSelection: {
            get: getDocumentSelection,
            set: setDocumentSelection,
            select: selectDocuments,
        },

        FacetSelection: {
            get: getFacetSelection,
            set: setFacetSelection,
            select: selectFacet,
        },

        Tools: {
            set: setTools,
            getValues: getToolValues,
        },
    };
}());
