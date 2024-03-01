const axios = require('axios');


async function uploadToTelegram(AlertStatus, botToken, chatId) {
    const headers_post = {
        'User-Agent': 'Mozilla/5.0 (1dayvn-AppServer) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
        const response = await axios.post(apiUrl, {
            chat_id: chatId,
            text: AlertStatus,
            parse_mode: 'Markdown',
        }, {
            timeout: 5000,
            headers: headers_post,
        });

        if (response.status === 429) {
            console.log('Rate limited, retrying...');
            return uploadToTelegram(AlertStatus)
        }
        if (response.status === 200) {
            console.error('Telegram message status:', response.status);
        }

    } catch (error) {
        console.error('Error sending Telegram message:', error.message);
    }
}




module.exports = {
    uploadToTelegram,
};
