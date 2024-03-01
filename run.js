const axios = require('axios');
const { uploadToTelegram } = require('./unity/telegram.js');
// const { auto_bank } = require('./unity/auto_bank.js');
const fs = require('fs').promises;

let config = {}

const url = 'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history';

let fist_run = true
let previousBalance = null;


function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}


const Datenow = new Date();
const time_run = formatDateTime(Datenow);

const status = `Auto Bank runing at: ${time_run}`
console.log(status);
uploadToTelegram(status)


function formatCurrency(amount) {
    const currencyString = (amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return currencyString;
}


async function Autobank(user, amount) {
    console.log('Auto Bank here')
    // const check = await auto_bank(user, amount)
}

const startDate = '28/02/2024'

const sendRequest = async () => {
    try {
        let rawdata = await fs.readFile('config/config.json', 'utf8');
        config = JSON.parse(rawdata);
    } catch (error) {
        console.log('Lỗi: Chưa cấu hình config');
        return;
    }
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'vi,en;q=0.9',
        'Authorization': `Basic ${config.token}`,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Length': '224',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': config.token,
        'Deviceid': config.deviceid,
        'Dnt': '1',
        'Host': 'online.mbbank.com.vn',
        'Origin': 'https://online.mbbank.com.vn',
        'Pragma': 'no-cache',
        'Referer': 'https://online.mbbank.com.vn/information-account/source-account',
        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'X-Request-Id': `${config.user}-${config.id_run}`,
        'Refno': `${config.user}-${config.id_run}`,
    };

    const payload = {
        "accountNo": config.accountNo,
        "fromDate": startDate,
        "toDate": formattedDate,
        "sessionId": config.sessionId,
        "refNo": `${config.user}-${config.id_run}`,
        "deviceIdCommon": config.deviceid,
    };

    try {
        const response = await axios.post(url, payload, { headers });

        const firstTransaction = response.data.transactionHistoryList[0];
        const firstBalance = parseInt(firstTransaction.availableBalance.replace(/\D/g, ''), 10);
        if (fist_run) {
            previousBalance = firstBalance
            fist_run = false
            const status = `Số dư hiện tại: ${formatCurrency(firstBalance)}`
            console.log(status);
            await uploadToTelegram(status)
        }

        if (firstBalance !== previousBalance) {
            previousBalance = firstBalance
            console.log('Tài khoản:', firstTransaction.accountNo);
            console.log('Số dư hiện tại:', formatCurrency(firstBalance));
            console.log('Trừ Tiền:', firstTransaction.debitAmount);
            console.log('Nạp Tiền:', firstTransaction.creditAmount);
            console.log('Nội Dung:', firstTransaction.addDescription);
            console.log('Thời gian giao dịch:', firstTransaction.transactionDate);
            console.log('--------------------------------------');
            if (firstTransaction.creditAmount > 0) {
                const status = `Bank: ${firstTransaction.accountNo}\nBalance: ${formatCurrency(firstBalance)}\nCredit Amount: ${firstTransaction.creditAmount}\nDescription: ${firstTransaction.addDescription}\nDate: ${firstTransaction.transactionDate}`
                await uploadToTelegram(status)
                const addDescription = firstTransaction.addDescription;
                const regex = /NAP\d+/gi; // Thay đổi để xác định nội dung. Ví dụ lấy : NAP1234567
                const found = addDescription.match(regex);
                if (found) {
                    await Autobank(found[0], firstTransaction.creditAmount)
                }
            }

        } else {
            // console.log('Not Changed!');
        }
    } catch (error) {
        console.error('Error:', error.message);
        const currentDate = new Date();
        const time_erro = formatDateTime(currentDate);
        const status = `Auto Bank Erro at: ${time_erro} | Mgs: ${error.message}`
        await uploadToTelegram(status)
    }
};


setInterval(sendRequest, 10000);
