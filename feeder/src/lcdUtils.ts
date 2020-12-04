import { LCDClient } from '@terra-money/terra.js'

interface Price {
  currency: string
  price: string
}

export async function getPricesFromLCD(client: LCDClient): Promise<Price[]> {
  console.info(`timestamp: ${new Date().toUTCString()}`)
  console.info(`getting price data from lcd`)

  return client.oracle.exchangeRates().then((results) => {
    return results.toArray().map((coin) => {
      return { currency: coin.denom.substring(1).toUpperCase(), price: coin.amount.toString() }
    })
  })
}
