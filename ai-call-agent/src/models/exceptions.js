class AppError extends Error {
    constructor(message, serviceName) {
        super(message);
        this.serviceName = serviceName;
        this.timestamp = new Date().toISOString();
    }
}

class TransientError extends AppError {
    constructor(message, serviceName) {
        super(message, serviceName);
        this.name = 'TransientError';
    }
}

class PermanentError extends AppError {
    constructor(message, serviceName) {
        super(message, serviceName);
        this.name = 'PermanentError';
    }
}

module.exports = { TransientError, PermanentError };