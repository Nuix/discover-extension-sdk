
module.exports = {
    apiUrl: 'http://ringtail.com/Ringtail-Svc-Portal/api/query',
    apiKey: '12345678-90ab-cdef-1234-567890abcdef',
    authToken: 'Bearer hereIsAFakeAuthTokenString01',

    postMessageMock: window.parent.postMessage = jest.fn().mockName('postMessage'),

    sendMessage: message => {
        window.dispatchEvent(new MessageEvent('message', {
            origin: 'http://ringtail.com/Ringtail/',
            data: message
        }));
        return message;
    },
};