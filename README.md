# Crypto-Airtable

This script will poll an API endpoint for fresh ticker data on most crytpo-currencies, and then update a base in Airtable. I haven't abstracted the script enough to be used with just any API endpoint, so to get it working with no tweaks - use the `https://api.coinmarketcap.com/v1/ticker/` endpoint. You will need to set up an Airtable base though, and then supply the name of the base and column you want to update, as well as your API keys.


## Initializing The Class

The class takes an array of strings that define which currencies you care about as well as the milliseconds in time between polls.

```js
new AirtableTicker(['litecoin', 'ripple'], 60000);
```


## Configuring

All of the configuration is done in the `.env` file.


---


Better documentation to come - not that anybody cares, but I care.