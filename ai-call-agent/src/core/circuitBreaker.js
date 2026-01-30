const Logger = require('../views/logger');
const Alerter = require('../views/alerter');

class CircuitBreaker {
    constructor(serviceName, failureThreshold, recoveryTimeout) {
        this.serviceName = serviceName;
        this.failureThreshold = failureThreshold;
        this.recoveryTimeout = recoveryTimeout;
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = null;
    }

    async execute(action) {
        if (this.state === 'OPEN') {
            const timeSinceFailure = Date.now() - this.lastFailureTime;
            if (timeSinceFailure >= this.recoveryTimeout) {
                this.state = 'HALF_OPEN';
                Logger.log(this.serviceName, 'STATE_CHANGE', 'Testing recovery', this.state);
            } else {
                throw new Error(`Circuit is OPEN for ${this.serviceName}`);
            }
        }

        try {
            const result = await action();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        if (this.state === 'HALF_OPEN' || this.state === 'OPEN') {
            this.state = 'CLOSED';
            this.failureCount = 0;
            Alerter.sendAlert(`${this.serviceName} recovered. Circuit CLOSED.`);
            Logger.log(this.serviceName, 'RECOVERY', 'Service restored', this.state);
        }
    }

    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.failureThreshold && this.state !== 'OPEN') {
            this.state = 'OPEN';
            Alerter.sendAlert(`CRITICAL: ${this.serviceName} circuit is now OPEN.`);
            Logger.log(this.serviceName, 'STATE_CHANGE', 'Threshold exceeded', this.state);
        }
    }
}

module.exports = CircuitBreaker;