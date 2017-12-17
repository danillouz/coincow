#!/usr/bin/env node

'use strict';

const dns = require('dns');
const chalk = require('chalk');
const fetch = require('node-fetch');
const ora = require('ora');
const cowsay = require('cowsay');
const lolcatjs = require('lolcatjs');

lolcatjs.options.animate = true;

const HOSTNAME = 'api.coinbase.com';
const API = `https://${HOSTNAME}/v2`;

const VALID_COINS = ['ltc', 'eth', 'btc'];
const VALID_CURRENCIES = ['eur', 'usd'];

const COIN_SYMBOLS = {
  ltc: 'LTC',
  eth: 'ETH',
  btc: 'BTC'
};

const CURRENCY_SYMBOLS = {
  eur: '€',
  usd: '$'
};

const _bold = chalk.bold;

const _printHelp = () =>
  console.log(`
  Usage
    > coin [${_bold('ltc')}|${_bold('eth')}|${_bold('btc')}] [${_bold('eur')}|${_bold('usd')}]

  Examples
    > coin ltc eur
    > coin eth usd
`);

const _printError = msg => console.log(`  ${chalk.red(msg)}`);

dns.lookup(HOSTNAME, err => {
  if (err && err.code === 'ENOTFOUND') {
    _printError('Please check your internet connection');
    process.exit(1);
  }
});

const [, , coin, currency] = process.argv;

if (coin === 'help' || coin === '--help') {
  _printHelp();
  process.exit(0);
}

if (!coin || !currency) {
  _printError(`Please provide a ${_bold('coin type')} and ${_bold('currency')}`);
  _printHelp();
  process.exit(1);
}

const isValidCoin = VALID_COINS.includes(coin);
const isValidCurrency = VALID_CURRENCIES.includes(currency);

if (!isValidCoin) {
  _printError(`Sorry! "${_bold(coin)}" is an unsupported coin type`);
}

if (!isValidCurrency) {
  _printError(`Sorry! "${_bold(currency)}" is an unsupported currency`);
}

if (!isValidCoin || !isValidCurrency) {
  _printHelp();
  process.exit(1);
}

const spinner = ora('Fetching data from Coinbase..');
const url = `${API}/prices/${coin}-${currency}/spot`;

const options = {
  headers: {
    Accept: 'application/json'
  }
};

spinner.start();

fetch(url, options)
  .then(res => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  })
  .then(json => {
    spinner.stop();

    const { amount } = json.data;
    const coinKey = coin.toLowerCase();
    const coinSymbol = COIN_SYMBOLS[coinKey];
    const currencyKey = currency.toLowerCase();
    const currencySymbol = CURRENCY_SYMBOLS[currencyKey];
    const msg = cowsay.say({
      text: `${coinSymbol} ${currencySymbol}${amount}`,
      e: 'oO',
      T: 'U '
    });

    lolcatjs.fromString(msg);
  })
  .catch(err => {
    spinner.stop();
    _printError(err);
    process.exit(1);
  });
