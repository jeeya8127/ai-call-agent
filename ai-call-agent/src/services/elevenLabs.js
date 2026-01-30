const { TransientError } = require('../models/exceptions');

class ElevenLabsService {
    constructor() {
        this.shouldFail = false;
    }

    async makeCall(contact) {
        if (this.shouldFail) {
            throw new TransientError('Service Unavailable (503)', 'ElevenLabs');
        }
        return { status: 'success', contact: contact.name };
    }

    setFailMode(value) {
        this.shouldFail = value;
    }
}

module.exports = new ElevenLabsService();