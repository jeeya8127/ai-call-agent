const ElevenLabs = require('./src/services/elevenLabs');
const RetryManager = require('./src/core/retryManager');
const CircuitBreaker = require('./src/core/circuitBreaker');

const config = {
    maxRetries: 1, // Reduced for faster testing
    initialDelay: 100 
};


const breaker = new CircuitBreaker('ElevenLabs', 3, 5000);

async function startSimulation() {
    ElevenLabs.setFailMode(true);
    console.log("--- STARTING MULTI-CALL TEST ---");

    for (let i = 1; i <= 4; i++) {
        console.log(`\n--- Call #${i} ---`);
        try {
            await breaker.execute(async () => {
                return await RetryManager.execute(
                    () => ElevenLabs.makeCall({ name: "Test" }),
                    config,
                    'ElevenLabs'
                );
            });
        } catch (error) {
            console.log(`Caught: ${error.message}`);
            console.log(`Current Breaker State: ${breaker.state}`);
        }
    }
}

startSimulation();