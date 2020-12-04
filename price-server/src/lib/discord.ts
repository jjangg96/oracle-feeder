import nodeFetch, { Response } from 'node-fetch'
import * as config from 'config'

export function sendDiscord(message: string): Promise<Response | void> {
  if (!config?.discord?.url) {
    return Promise.resolve()
  }

  return nodeFetch(config.get('discord.url'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      avatar_url: '',
      username: 'Oracle PriceServer',
      content: message,
    }),
  })
}
