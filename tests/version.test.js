
require('../Ringtail');

const Test = require('./testLib');

describe('version', async () => {

    test('should warn if Ringtail version is smaller', async () => {
        Ringtail.initialize();

        const warnMock = console.warn = jest.fn().mockName('warn');

        function versionCheck(sdkVersion, ringtailVersion, shouldWarn) {
            Ringtail.SdkCompatibleWithVersion = sdkVersion;
            Test.sendUserContextMessage({ ringtailVersion });
    
            expect(warnMock).toHaveBeenCalledTimes(shouldWarn ? 1 : 0);
            warnMock.mockReset();
        }

        // ------------- Compatible -------------
        // Length-matched
        versionCheck('1',       '2',        false);
        versionCheck('1.1',     '1.2',      false);
        versionCheck('1.1.1',   '1.1.2',    false);
        versionCheck('1.1.1.1', '1.1.1.2',  false);

        // Ragged
        versionCheck('1',       '1.0.0.0',  false);
        versionCheck('1.0',     '1.0.0.0',  false);
        versionCheck('1.0.0',   '1.0.0.0',  false);
        versionCheck('1.0.0.0', '1.0.0',    false);
        versionCheck('1.0.0.0', '1.0',      false);
        versionCheck('1.0.0.0', '1',        false);

        // Previously buggy
        versionCheck('9.5.008', '10.0.001', false);

        // ------------ Incompatible ------------
        versionCheck('1',       '0',        true);
        versionCheck('2',       '1',        true);
        versionCheck('1.2',     '1.1',      true);
        versionCheck('1.1.2',   '1.1.1',    true);
        versionCheck('1.1.1.2', '1.1.1.1',  true);

        // Ragged
        versionCheck('2',       '1.0.0.0',  true);
        versionCheck('1.1',     '1.0.0.0',  true);
        versionCheck('1.0.1',   '1.0.0.0',  true);
        versionCheck('1.0.0.1', '1.0.0',    true);
        versionCheck('1.0.0.1', '1.0',      true);
        versionCheck('1.0.0.1', '1',        true);

        // Previously buggy
        versionCheck('10.0.001', '9.5.008', true);
    });
});
