const axios = require('axios');

class Alerter {
    static async sendAlert(message) {
        // 1. Console Logs (For Technical Visibility)
        console.log(`📧 ALERT (Email): ${message}`);
        console.log(`📲 ALERT (Telegram): ${message}`);

        // 2. Real Telegram Implementation
        try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            if (botToken && chatId) {
                await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    chat_id: chatId,
                    text: `⚠️ CRITICAL SYSTEM ALERT:\n${message}`
                });
                console.log("✅ Telegram message delivered.");
            }
        } catch (error) {
            console.error('❌ Failed to send Telegram alert:', error.message);
        }

        // 3. Real Webhook Implementation
        try {
            if (process.env.WEBHOOK_URL) {
                await axios.post(process.env.WEBHOOK_URL, { 
                    event: "CIRCUIT_OPEN",
                    details: message,
                    timestamp: new Date().toISOString()
                });
                console.log("✅ Webhook payload delivered.");
            }
        } catch (error) {
            console.error('❌ Failed to send Webhook alert');
        }
    }
}

module.exports = Alerter;