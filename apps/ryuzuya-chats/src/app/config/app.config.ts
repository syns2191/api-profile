export default () => ({
  port: parseInt(process.env.PORT ?? '3034', 10),
  TELEGRAM_API: process.env.TELEGRAM_API || 'https://api.telegram.org'
})
