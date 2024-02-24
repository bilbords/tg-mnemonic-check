const { Telegraf, Scenes } = require('telegraf')

require('dotenv').config({ path: './config/.env' })

const bot = new Telegraf(process.env.BOT_TOKEN)

const addUser = new Scenes.BaseScene('add-user')

const { getPool } = require('../../database/initPool.js')

const { stopAddUser_button } = require('../../utils/inlineButtons.js')

addUser.enter(async (ctx) => {
  await ctx.replyWithHTML(
    '<b>Введите ID пользователя, которого нужно добавить</b>',
    stopAddUser_button
  )
})

addUser.on('text', async (ctx) => {
  const pool = await getPool()
  const client = await pool.connect()
  let userTelegramID = Number(ctx.message.text)
  bot.telegram
    .getChat(userTelegramID)
    .then(async (chat) => {
      if (typeof chat == 'object') {
        client.query(
          `INSERT INTO subscribed_users ("telegram_id") VALUES ('${userTelegramID}')`,
          async (err, res) => {
            if (err) {
              await ctx.reply(`❌ Произошла неожиданная ошибка! Попробуйте еще раз`)
              console.log('Error: ', err)
            } else {
              await ctx.reply(
                `<b>✅ Вы успешно выдали подписку пользователю с ID ${userTelegramID}</b>`
              )
              await bot.telegram.sendMessage(
                userTelegramID,
                '❗️ Вам был выдан доступ к боту! \n\nНапишите /start что бы начать пользоваться ботом'
              )
              await ctx.scene.leave()
              await client.end()
            }
          }
        )
      }
    })
    .catch(() => {
      ctx.reply(
        `Не существует диалогом с пользователем с таким ID`,
        stopAddUser_button
      )
    })
})

addUser.leave(async (ctx) => {
  await ctx.reply('Вы вышли из режима добавления пользователя')
})

module.exports = { addUser }
