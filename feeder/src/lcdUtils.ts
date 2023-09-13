import { Dec, LCDClient } from '@terra-money/terra.js'
import axios from 'axios'

interface Price {
  denom: string
  price: string
}

export async function getPricesFromLCD(client: LCDClient): Promise<Price[]> {
  console.info(`timestamp: ${new Date().toUTCString()}`)
  console.info(`getting price data from lcd`)

  const lastPrice = await lastLuncPriceFromGecko()
  return client.oracle.exchangeRates().then((results) => {
    console.log('oracle from lcd', results)

    results.set('ulunc', lastPrice)
    return results.toArray().map((coin) => {
      if (coin.denom === 'ulunc') {
        return {
          denom: coin.denom.substring(1).toUpperCase(),
          price: coin.amount.toString(),
        }
      }

      return {
        denom: coin.denom.substring(1).toUpperCase(),
        price: new Dec(lastPrice).div(coin.amount).toString(),
      }
    })
  })
}

const lastLuncPriceFromGecko = async (): Promise<number> => {
  return await axios
    .get(`https://api.coingecko.com/api/v3/simple/price?ids=terra-luna&vs_currencies=usd`)
    .then((res) => {
      return parseFloat(res.data['terra-luna']['usd'])
    })
    .catch((e) => {
      console.log(`lastLuncPriceFromGecko(): invalid api response:`, e ? JSON.stringify(e) : 'empty')
      throw new Error(`lastLuncPriceFromGecko(): invalid response`)
    })
}
