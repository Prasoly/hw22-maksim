import dotenv from 'dotenv'

if (process.env.CI !== 'true') {
  dotenv.config({ path: 'env/prod.env.example' })
  console.log('Running in local environment')
} else {
  console.log('Running in CI environment')
}

const requiredVars = ['URL', 'TEST_USERNAME', 'TEST_PASSWORD']

// Check for missing variables
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export const SERVICE_URL: string = process.env.URL!
export const USERNAME: string = process.env.TEST_USERNAME!
export const PASSWORD: string = process.env.TEST_PASSWORD!