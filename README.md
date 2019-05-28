# Crypto-Airtable

This script will poll an API endpoint for fresh ticker data on most crytpo-currencies, and then update a base in Airtable. I haven't abstracted the script enough to be used with just any API endpoint, so to get it working with no tweaks - use the `https://api.coinmarketcap.com/v1/ticker/` endpoint. You will need to set up an Airtable base though, and then supply the name of the base and column you want to update, as well as your API keys.


## The Airtable Base

1. Create a new base - I called mine "Portfolio"
2. You really only need at minimum, 2 columns on your base for this app to work (the [brackets] indicate the field type).
    a. `ID : [string]` - The ID of the crypto. Use the ID found in the `https://api.coinmarketcap.com/v1/ticker/` data, for example `ripple` or `litecoin`.
    b. `Current Value : [Currency]`


## Initializing The Class

The class accepts two positional arguments:

Name | Default | Description
--- | --- | ---
`timer delay` | `60000` | Indicates how often the app should poll the API.
`max records` | `50` | The max number of records to pull from Airtable on setup.

```js
new AirtableTicker(60000, 50);
```


## Configuring

All of the configuration is done in the `.env` file. Take note that the field `COLUMN_TO_UPDATE_IN_AIRTABLE` is expecting the full name of the column, spaces, punctuation, and all.

For example, if your column name is `Current Value (Per Coin)`, your `.env` should reflect that.

`COLUMN_TO_UPDATE_IN_AIRTABLE="Current Value (Per Coin)"`
