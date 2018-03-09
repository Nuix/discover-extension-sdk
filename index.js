(function () {
    'use strict';

    var initialized = false,
        listeners = new Map(),
        pendingClientQueries = new Map(),
        activeDoc = null;

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

        if (message.requestId && pendingClientQueries.has(message.requestId)) {
            var deferred = pendingClientQueries.get(message.requestId);
            if (message.name === 'Error') {
                deferred.reject(new Error(message.data.message));
            } else {
                deferred.resolve(message.data);
            }
            pendingClientQueries.delete(message.requestId);
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
        checkInitialized();
        return fetch(RingtailSDK.Context.apiUrl, {
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
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Request failed: ' + response.statusText);
            }
            return response.json();
        });
    }


    function on(eventName, callback) {
        if (!listeners.has(eventName)) {
            listeners.set(eventName, []);
        }
        listeners.get(eventName).push(callback);
    }

    function off(eventName, callback) {
        var callbacks = listeners.get(eventName);
        if (!callbacks || callbacks.indexOf(callback) < 0) {
            throw new Error('Ringtail API event listener for "' + eventName + '" not found');
        }
        callbacks.splice(callbacks.indexOf(callback), 1);
    }


    function setLoading(loading) {
        checkInitialized();
        sendMessage(loading ? 'LoadingMask_Show' : 'LoadingMask_Hide');
    }

    function setTools(toolsConfig) {
        return clientQuery('SetTools', toolsConfig);
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
        return clientQuery('DocumentSelection_Set', mainIds);
    }

    function selectDocuments() {
        return clientQuery('DocumentSelection_Select');
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

    function selectFacet(fieldId, values, select) {
        return clientQuery('FacetSelection_Select', {
            fieldId: fieldId,
            values: values,
            select: select,
        });
    }

    window.RingtailSDK = {
        Context: null,

        initialize: initialize,
        on: on,
        off: off,

        setLoading: setLoading,
        setTools: setTools,

        query: serverQuery,
        
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
    };
}());
