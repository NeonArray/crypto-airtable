require('dotenv').config();

const axios = require('axios');
const Airtable = require('airtable');
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);


class AirtableTicker {

    constructor() {
        this.apiEndpoint = process.env.API_ENDPOINT;
        this.coinsIcareAbout = [
            'ripple',
            'litecoin',
        ];
        this.maxRecords = 50;
        this.recordColumn = 'Current Value (Per Coin)';
        this.millisecondsBetweeenUpdates = 10000;
        this.airtableBase = 'Portfolio';

        setInterval(() => this.main(), 60000);
    }

    main() {
        console.log('Executing Update.', new Date().toISOString());

        base(this.airtableBase).select({
            maxRecords: this.maxRecords,
            view: "Grid view"
        }).eachPage((records, fetchNextPage) => {
            this.updateAirtable(records);
        }, this.handleError);
    }

    handleError(error) {
        if (error) {
            console.error(error, new Date().toISOString());
            return;
        }
    }

    async fetchDataFromAPI() {
        return await axios
            .get(this.apiEndpoint)
            .then((response) => response.data).catch(this.handleError);
    }

    parseDataAgainstWhitelist(data, whitelist) {
        return data.filter((row) => {
            if (whitelist.join(' ').indexOf(row.id) > -1) {
                return row;
            }
        });
    }

    async updateAirtable(data) {
        const allTickers = await this.fetchDataFromAPI();

        if (!allTickers) {
            return;
        }

        const tickers = this.parseDataAgainstWhitelist(allTickers, this.coinsIcareAbout);
        
        this.coinsIcareAbout.forEach((row) => {
            const coin = tickers.filter((items) => items.id === row)[0];
            
            data.forEach((record) => {

                if (record.get('ID') !== row) {
                    return;
                }

                base(this.airtableBase).update(record.id, {
                    [this.recordColumn]: parseFloat(coin.price_usd),
                }, (err, record) => {
                    this.handleError(err);

                    console.log('Record Updated', record.id);
                });
            }); 
        });
    }
}

new AirtableTicker();
