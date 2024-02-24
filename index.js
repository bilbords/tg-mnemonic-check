require('dotenv').config({ path: './config/.env' })

const { setupBot } = require('./bot.js')

;(async function () {
  try {
    await setupBot().launch()
    console.log('</ Бот успешно запущен >')
  } catch (error) {
    console.log('Ошибка запуска: ', error)
  }
})()