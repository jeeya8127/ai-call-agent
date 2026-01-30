module.exports = {
    elevenLabs: {
        maxRetries: 3,
        initialDelay: 5000,
        failureThreshold: 3,
        recoveryTimeout: 30000 
    },
    llmProvider: {
        maxRetries: 2,
        initialDelay: 2000,
        failureThreshold: 5,
        recoveryTimeout: 60000
    },
    alerting: {
        email: "admin@example.com",
        telegramToken: "YOUR_BOT_TOKEN",
        webhookUrl: "https://your-webhook-endpoint.com/alerts"
    },
    healthCheck: {
        interval: 10000
    }
};