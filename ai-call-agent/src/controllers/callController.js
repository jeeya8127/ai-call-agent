const RetryManager = require('../core/retryManager');
const Logger = require('../views/logger');

class CallController {
    constructor(breaker, config) {
        this.breaker = breaker;
        this.config = config;
    }

    async processQueue(contacts, serviceCall) {
        for (const contact of contacts) {
            try {
                await this.breaker.execute(async () => {
                    return await RetryManager.execute(
                        () => serviceCall(contact),
                        this.config,
                        this.breaker.serviceName
                    );
                });
            } catch (error) {
                Logger.log(
                    this.breaker.serviceName, 
                    'CALL_SKIPPED', 
                    `Skipping ${contact.name}: ${error.message}`, 
                    this.breaker.state
                );
                // Graceful degradation: move to next item
                continue; 
            }
        }
    }
}

module.exports = CallController;