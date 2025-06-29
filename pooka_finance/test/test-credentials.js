// test-credentials.js - Run this to verify your Chainlink credentials work
import crypto from "crypto";
// Replace these with your actual credentials
const USERNAME = 'chainlink_username'
const PASSWORD = 'chainlink_password'

const FEED_ID = '0x00037da06d56d083fe599397a4769a042d63aa73dc4ef57709d31e9971a5b439' // BTC/USD
const BASE_URL = 'https://api.testnet-dataengine.chain.link'

function generateAuthHeaders(method, path, apiKey, apiSecret) {
  const timestamp = Date.now()
  const bodyHash = crypto.createHash('sha256').update('').digest('hex')
  const stringToSign = `${method} ${path} ${bodyHash} ${apiKey} ${timestamp}`
  const signature = crypto.createHmac('sha256', apiSecret).update(stringToSign).digest('hex')

  return {
    'Authorization': apiKey,
    'X-Authorization-Timestamp': timestamp.toString(),
    'X-Authorization-Signature-SHA256': signature
  }
}

async function testConnection() {
  try {
    const path = `/api/v1/reports/latest?feedID=${FEED_ID}`
    const headers = generateAuthHeaders('GET', path, USERNAME, PASSWORD)

    console.log('Headers:', headers)

    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers
    })

    
    if (response.ok) {
      const data = await response.json()
      console.log('BTC/USD Report received:', {
        feedID: data.report.feedID,
        timestamp: data.report.observationsTimestamp,
        reportLength: data.report.fullReport.length
      })
    } else {
      const errorText = await response.text()
      console.log('❌ FAILED! Error:', response.status, errorText)
    }
  } catch (error) {
    console.log('❌ CONNECTION ERROR:', error.message)
  }
}

testConnection()