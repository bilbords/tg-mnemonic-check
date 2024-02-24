const { Telegraf, Scenes } = require('telegraf')

require('dotenv').config({ path: './config/.env' })

const ADMIN_ID = Number(process.env.ADMIN_ID)

const bot = new Telegraf(process.env.BOT_TOKEN)

const { getPool } = require('../../database/initPool.js')

const { stopNewsletter_button } = require('../../utils/inlineButtons.js')

const makeNewsletter = new Scenes.BaseScene('make-newsletter')

makeNewsletter.enter(async (ctx) => {
  await ctx.replyWithHTML(
    '<b>Введите нужный текст для рассылки</b>',
    stopNewsletter_button
  )
})

makeNewsletter.on('text', async (ctx) => {
  const pool = await getPool()
  const client = await pool.connect()
  const result = await new Promise((resolve, reject) => {
    client.query('SELECT * FROM subscribed_users', async (err, res) => {
      if (err) {
        ctx.reply('❌ Произошла неожиданная ошибка! Попробуйте еще раз')
        console.log('Make newsletter error: ', err)
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
  const neededText = ctx.message.text
  for (const row of result.rows) {
    if (Number(row.telegram_id) !== ADMIN_ID) {
      await bot.telegram
        .sendMessage(row.telegram_id, neededText)
        .catch(async () => {
          console.log(
            `Пользователю с ID ${row.telegram_id} не получилось отправить сообщение!`
          )
        })
    }
  }
  await ctx.replyWithHTML('<b>✅ Рассылка успешно завершена!</b>')
  await client.end()
  await ctx.scene.leave()
})

makeNewsletter.leave(async (ctx) => {
  await ctx.reply('Вы вышли из режима рассылки')
})

module.exports = { makeNewsletter }