const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet'); // Ensure npm install google-spreadsheet
const { JWT } = require('google-auth-library');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../../logs');
        this.logFile = path.join(this.logDir, 'system.log');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    async log(service, event, details, state) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            serviceName: service,
            event: event,
            details: details,
            circuitBreakerState: state
        };

        // 1. Local JSON Logging (Requirement 4)
        fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
        console.log(`[${logEntry.timestamp}] ${service} - ${event}: ${details} [State: ${state}]`);

        // 2. Google Sheets Logging (Requirement 4 - Non-Technical Visibility)
        try {
            const auth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            
            await sheet.addRow({
                Timestamp: logEntry.timestamp,
                Service: service,
                Event: event,
                Details: details,
                State: state
            });
        } catch (error) {
            console.error('❌ Google Sheets Logging Failed:', error.message);
        }
    }
}

module.exports = new Logger();