
module.exports = {
    apiUrl: 'http://ringtail.com/Ringtail-Svc-Portal/api/query',
    apiKey: '12345678-90ab-cdef-1234-567890abcdef',
    authToken: 'Bearer hereIsAFakeAuthTokenString01',

    postMessageMock: window.parent.postMessage = jest.fn().mockName('postMessage'),

    sendMessage(message, origin) {
        window.dispatchEvent(new MessageEvent('message', {
            origin: origin || 'http://ringtail.com',
            data: message
        }));
        return message;
    },

    sendUserContextMessage(context) {
        return this.sendMessage({
            name: 'UserContext',
            data: Object.assign({
                apiUrl: this.apiUrl,
                apiKey: this.apiKey,
                authToken: this.authToken,
            }, context),
            requestId: this.postMessageMock.mock.calls[0][0].requestId,
        }).data;
    }
};