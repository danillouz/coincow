# 💰 Coin 🐮 Cow

A magical cow that tells you the current LTC, ETH or BTC price, in EUR or USD, right from your
terminal.

![](coincow.gif)

Powered by the [Coinbase API](https://developers.coinbase.com/api/v2#get-spot-price).

## Install

You'll need to have [Node.js](https://nodejs.org) version 9 or greater installed, then run:

```
npm i -g coincow
```

## Usage

```
> coin help

  Usage
    > coin [ltc|eth|btc] [eur|usd]

  Examples
    > coin ltc eur
    > coin eth usd
```

Alternatively, you can use `npx` if you don't want to install globally, for example:

```
npx coincow ltc eur
```
