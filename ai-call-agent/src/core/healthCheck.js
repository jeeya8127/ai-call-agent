const ElevenLabs = require('../services/elevenLabs');

class HealthCheck {
    static start(breaker) {
        setInterval(async () => {
            if (breaker.state === 'OPEN') {
                try {
                    const originalFailMode = ElevenLabs.shouldFail;
                    ElevenLabs.setFailMode(false);
                    
                    await ElevenLabs.makeCall({ name: "Health-Probe" });
                    
                    breaker.onSuccess();
                    ElevenLabs.setFailMode(originalFailMode);
                } catch (e) {
                    // Service still unhealthy; stay OPEN
                }
            }
        }, 10000); 
    }
}

module.exports = HealthCheck;