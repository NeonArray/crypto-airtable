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

    async getRecordRowIDsFromAirtable() {
        console.log('Caching Record ID\'s.', new Date().toISOString());

        return await new Promise((resolve, reject) => {
            base(this.baseToUpdateInAirtable).select({
                maxRecords: this.maxRecords,
                view: "Grid view"
            }).eachPage((records, fetchNextPage) => {
                this.cacheRowIDs(records);
                fetchNextPage();
            }, (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }

    async fetchDataFromAPI() {
        return await axios
            .get(process.env.API_ENDPOINT)
            .then((response) => response.data)
            .catch((err) => console.error(err, new Date().toISOString()));
    }

    async getFilteredTickerData() {
        const allTickerData = await this.fetchDataFromAPI();

        return allTickerData.filter((entry) => {
            if (this.rowIDs.has(entry.id)) {
                entry.airtableID = this.rowIDs.get(entry.id);
                return entry;
            }
        });
    }

    async updateAirtable(data) {
        const allTickers = await this.fetchDataFromAPI();

        if (!allTickers) {
            return;
        }

    async updateAirtableFields() {
        const updateObject = await this.getUpdateObjectFromTickerData();

        base(this.baseToUpdateInAirtable)
            .update(updateObject, function done(err) {
                if (err) {
                    console.error(err, new Date().toISOString());
                    return;
                }

                console.log('Records Updated');
            });
    }
}

const AT = new AirtableTicker(3000);
AT.initializeTimer();
