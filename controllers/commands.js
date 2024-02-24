require('dotenv').config({ path: './config/.env' })

const ADMIN_ID = Number(process.env.ADMIN_ID)

const { getPool } = require('../database/initPool.js')

const { adminButtons, userButtons } = require('../utils/inlineButtons')

const botStart = async (ctx) => {
  const userTelegramID = ctx.message.from.id
  const pool = await getPool()
  const client = await pool.connect()
  const result = await new Promise((resolve, reject) => {
    client.query(
      `SELECT * FROM subscribed_users WHERE telegram_id = ${userTelegramID}`,
      (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      }
    )
  })
  if (result.rowCount > 0) {
    await ctx.replyWithHTML(
      `<b>👋 Добро пожаловать в чекер сид-фраз!</b>
      \nНажмите на любую из кнопок выше, что бы начать пользоваться ботом`,
      userButtons
    )
    await client.end()
  } else {
    await ctx.replyWithHTML(
      `<b>👋 Добро пожаловать в чекер сид-фраз!</b>\n\nДля того, что бы использовать функционал бота, вам необходимо купить подписку у @bilbords_lzt`
    )
  }
}

const userPanel = async (ctx) => {
  ctx.reply(
    'Добро пожаловать в чекер сидок! Выбери нужный пункт',
    checkOneMnemonic_button
  )
}

const adminPanel = async (ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    ctx.replyWithHTML(
      '<b>Добро пожаловать в админ-панель!</b>\n\nВоспользоваться функционалом панели администратора можно по кнопкам ниже',
      adminButtons
    )
  }
}

const helpText = async (ctx) => {
  ctx.reply(
    'Доступные команды: \n\n/start - запуск бота\n/help - все команды бота\n/about - о боте\n/ruler - правила использования\n\nЕсли у вас возникли проблемы с ботом, напишите @bilbords_lzt'
  )
}

const aboutText = async (ctx) => {
  ctx.reply(
    'Telegram-бот для проверки seed-фраз на баланс\n\nСтоимость подписки уточнять у @bilbords_lzt'
  )
}

const rulesText = async (ctx) => {
  ctx.reply(
    'Бот создан исключительно в ознакомительных целях, к использованию допускаются лишь личные seed-фразы\nВозврат средств администрацией не предусмотрен, однако может быть получен исходя из личной инициативы администрации\n\nПокупая данный продукт, Вы подтверждаете, что согласны с описанными выше правилами'
  )
}

const startGetMnemonic = (ctx) => {
  return ctx.scene.enter('get-mnemonic')
}

const leaveGetMnemonic = (ctx) => {
  return ctx.scene.leave('get-mnemonic')
}

const startGetManyMnemonic = (ctx) => {
  return ctx.scene.enter('')
}

const leaveGetManyMnemonic = (ctx) => {
  return ctx.scene.leave('')
}

const startMakeNewsletter = (ctx) => {
  return ctx.scene.enter('make-newsletter')
}

const leaveMakeNewsletter = (ctx) => {
  return ctx.scene.leave('make-newsletter')
}

const startAddUser = (ctx) => {
  return ctx.scene.enter('add-user')
}

const leaveAddUser = (ctx) => {
  return ctx.scene.leave('add-user')
}

const startDeleteUser = (ctx) => {
  return ctx.scene.enter('delete-user')
}

const leaveDeleteUser = (ctx) => {
  return ctx.scene.leave('delete-user')
}

module.exports = {
  botStart,
  adminPanel,
  userPanel,
  helpText,
  aboutText,
  rulesText,
  startGetMnemonic,
  leaveGetMnemonic,
  startGetManyMnemonic,
  leaveGetManyMnemonic,
  startAddUser,
  leaveAddUser,
  startDeleteUser,
  leaveDeleteUser,
  startMakeNewsletter,
  leaveMakeNewsletter,
}