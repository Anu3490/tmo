import { environment } from '../environments/environment';
 
const request = require('request');

export class StockHandler { 
// invoke API to fetch stock data
    public async fetchStock(symbol, timePeriod, token) {
        const url = environment.apiURL + symbol + '/chart/' + timePeriod + '?token=' + token;
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error){
                    reject(error);   
                } else if (response && response['statusCode'] === 200) {
                    console.log("Test cache");
                    resolve(body);
                } else if (response && response['statusCode'] !== 200) {
                    reject("Invalid Response");
                }
            });
        });
    }
} 
