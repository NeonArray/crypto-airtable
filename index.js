require('dotenv').config();

const axios = require('axios');
const Airtable = require('airtable');
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);


class AirtableTicker {

    constructor(millisecondsBetween = 60000, maxRecords = 50) {
        this.maxRecords = maxRecords;
        this.columnToUpdateInAirtable = process.env.COLUMN_TO_UPDATE_IN_AIRTABLE;
        this.millisecondsBetweeenUpdates = millisecondsBetween;
        this.baseToUpdateInAirtable = process.env.BASE_TO_UPDATE_IN_AIRTABLE;
        this.rowIDs = new Map();

        this.getRecordRowIDsFromAirtable();
    }

    initializeTimer() {
        setInterval(() => this.updateAirtableFields(), this.millisecondsBetweeenUpdates);
    }

    cacheRowIDs(records) {
        records.forEach((record) => this.rowIDs.set(record.get('ID'), record.id));
    }

        base(this.baseToUpdateInAirtable).select({
            maxRecords: this.maxRecords,
            view: "Grid view"
        }).eachPage((records, fetchNextPage) => {
            this.updateAirtable(records);
        }, this.handleError);
    }

                resolve();
            });
        });
    }
    }

    async fetchDataFromAPI() {
        return await axios
            .get(process.env.API_ENDPOINT)
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

                base(this.baseToUpdateInAirtable).update(record.id, {
                    [this.columnToUpdateInAirtable]: parseFloat(coin.price_usd),
                }, (err, record) => {
                    this.handleError(err);

                    console.log('Record Updated', record.id);
                });
            }); 
        });
    }
}

new AirtableTicker([
    'ripple',
    'litecoin',
], 60000);
