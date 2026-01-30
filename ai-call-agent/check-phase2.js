const ElevenLabs = require('./src/services/elevenLabs');
const RetryManager = require('./src/core/retryManager');
const CircuitBreaker = require('./src/core/circuitBreaker');

const config = { maxRetries: 1, initialDelay: 100 };
const breaker = new CircuitBreaker('ElevenLabs', 3, 5000);

async function runPhase2Check() {
    ElevenLabs.setFailMode(true);
    console.log("--- STARTING PHASE 2 CHECK ---");

    for (let i = 1; i <= 3; i++) {
        try {
            await breaker.execute(() => 
                RetryManager.execute(() => ElevenLabs.makeCall({ name: "User" }), config, 'ElevenLabs')
            );
        } catch (e) {
            console.log(`Call ${i} handled.`);
        }
    }
    
    console.log("\n--- CHECKING OUTPUTS ---");
    console.log("1. Check your console for '📧 ALERT' and '📲 ALERT' messages.");
    console.log("2. Check the 'logs/system.log' file for JSON entries.");
}

runPhase2Check();