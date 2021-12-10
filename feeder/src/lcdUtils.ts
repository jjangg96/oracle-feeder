import { Dec, Denom, LCDClient } from '@terra-money/terra.js'
import axios from 'axios'

interface Price {
  currency: string
  price: string
}

export async function getPricesFromLCD(client: LCDClient): Promise<Price[]> {
  console.info(`timestamp: ${new Date().toUTCString()}`)
  console.info(`getting price data from lcd`)

  const lastPrice = await lastBinancePrice()
  return client.oracle.exchangeRates().then((results) => {
    const usd = results.get(Denom.USD)?.amount || new Dec(0)
    console.log('oracle from lcd', results)
    console.log(`binance ${lastPrice}, oracle ${usd}`)

    if (usd.minus(new Dec(lastPrice)).abs().gt(2)) {
      throw new Error(`USD price invalid, binance ${lastPrice}, oracle ${usd}`)
    }

    return results.toArray().map((coin) => {
      return {
        currency: coin.denom.substring(1).toUpperCase(),
        price: coin.amount.plus(new Dec(Math.random() / 10000)).toString(),
      }
    })
  })
}

const lastBinancePrice = async (): Promise<number> => {
  const params = { symbol: 'LUNAUSDT', interval: '1m', limit: 1 }
  const query = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return await axios
    .get(`https://api.binance.com/api/v3/klines?${query}`)
    .then((res) => {
      return parseFloat(res.data[0][4])
    })
    .catch((e) => {
      console.log(`lastPrice(): invalid api response:`, e ? JSON.stringify(e) : 'empty')
      throw new Error(`lastPrice(): invalid response`)
    })
}
