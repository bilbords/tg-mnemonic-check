const { Scenes } = require('telegraf')

require('dotenv').config({ path: './config/.env' })

const { getPool } = require('../../database/initPool.js')

const { stopDeleteUser_button } = require('../../utils/inlineButtons.js')

const deleteUser = new Scenes.BaseScene('delete-user')

deleteUser.enter(async (ctx) => {
  await ctx.replyWithHTML(
    '<b>Введите ID пользователя, которого нужно удалить</b>',
    stopDeleteUser_button
  )
})

deleteUser.on('text', async (ctx) => {
  let userTelegramID = ctx.message.text
  const pool = await getPool()
  const client = await pool.connect()
  try {
    await new Promise((resolve, reject) => {
      client.query(
        `DELETE FROM subscribed_users WHERE telegram_id = ${userTelegramID}`,
        async (err, res) => {
          if (err) {
            await ctx.reply('❌ Произошла неожиданная ошибка! Попробуйте еще раз')
            console.log('Delete user error: ', err)
            reject(err)
          } else {
            ctx.replyWithHTML(`<b>✅ Вы успешно обнулили подписку у пользователя с ID ${userTelegramID}</b>`)
            resolve(res)
            client.end()
          }
        }
      )
    })
  } catch (error) {
    console.log('User deleting error: ', error)
  }
})

deleteUser.leave(async (ctx) => {
  await ctx.reply('Вы вышли из режима удаления пользователя')
})

module.exports = { deleteUser }
