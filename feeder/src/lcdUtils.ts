import { Dec, LCDClient } from '@terra-money/terra.js'
import axios from 'axios'

interface Price {
  denom: string
  price: string
}

export async function getPricesFromLCD(client: LCDClient): Promise<Price[]> {
  console.info(`timestamp: ${new Date().toUTCString()}`)
  console.info(`getting price data from lcd`)

  // const lastPrice = await lastBinancePrice()
  return client.oracle.exchangeRates().then((results) => {
    console.log('oracle from lcd', results)

    return results.toArray().map((coin) => {
      return {
        denom: coin.denom.substring(1).toUpperCase(),
        price: coin.amount.plus(new Dec(Math.random() / 1000000)).toString(),
      }
    })
  })
}

// const lastBinancePrice = async (): Promise<number> => {
//   const params = { symbol: 'LUNAUSDT', interval: '1m', limit: 1 }
//   const query = Object.keys(params)
//     .map((key) => `${key}=${params[key]}`)
//     .join('&')
//
//   return await axios
//     .get(`https://api.binance.com/api/v3/klines?${query}`)
//     .then((res) => {
//       return parseFloat(res.data[0][4])
//     })
//     .catch((e) => {
//       console.log(`lastPrice(): invalid api response:`, e ? JSON.stringify(e) : 'empty')
//       throw new Error(`lastPrice(): invalid response`)
//     })
// }
