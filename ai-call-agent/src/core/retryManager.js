const { TransientError } = require('../models/exceptions');

class RetryManager {
    static async execute(fn, config, serviceName) {
        let lastError;
        let delay = config.initialDelay || 5000;

        for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (!(error instanceof TransientError) || attempt === config.maxRetries) {
                    throw error;
                }

                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
        throw lastError;
    }
}

module.exports = RetryManager;