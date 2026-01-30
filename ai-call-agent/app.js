const ElevenLabs = require('./src/services/elevenLabs');
const CircuitBreaker = require('./src/core/circuitBreaker');
const HealthCheck = require('./src/core/healthCheck');
const CallController = require('./src/controllers/callController');
const settings = require('./src/config/settings');
const Alerter = require('./src/views/alerter');
const labsBreaker = new CircuitBreaker(
    'ElevenLabs', 
    settings.elevenLabs.failureThreshold, 
    settings.elevenLabs.recoveryTimeout
);

HealthCheck.start(labsBreaker);

const controller = new CallController(labsBreaker, settings.elevenLabs);

const contacts = [
    { name: "Asha Saini" }, 
    { name: "Kritika Devi" }, 
    { name: "Jeeya Mishra" }
];

async function startSystem() {
    await Alerter.sendAlert("🚨 Test Alert: System is starting!");
    console.log("🚀 AI Call Agent Resilience System Active.");
    
    ElevenLabs.setFailMode(true);
    
    await controller.processQueue(contacts, (c) => ElevenLabs.makeCall(c));
}

startSystem();