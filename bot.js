const { Telegraf, Scenes, session } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const {
  botStart,
  adminPanel,
  helpText,
  aboutText,
  rulesText,
  startGetMnemonic,
  leaveGetMnemonic,
  startAddUser,
  leaveAddUser,
  startDeleteUser,
  leaveDeleteUser,
  startMakeNewsletter,
  leaveMakeNewsletter,
} = require('./controllers/commands.js')

const { getMnemonic } = require('./controllers/scenes/getMnemonicScene.js')

const { addUser } = require('./controllers/scenes/addUserScene.js')

const {
  makeNewsletter,
} = require('./controllers/scenes/makeNewsletterScene.js')

const { deleteUser } = require('./controllers/scenes/deleteUserScene.js')

const stage = new Scenes.Stage([
  getMnemonic,
  addUser,
  makeNewsletter,
  deleteUser,
])

const setupBot = () => {
  bot.use(session())
  bot.use(stage.middleware())

  bot.start(botStart)

  bot.command('admin', adminPanel)
  bot.command('help', helpText)
  bot.command('about', aboutText)
  bot.command('rules', rulesText)

  bot.action('check_one_mnemonic', startGetMnemonic)
  bot.action('check_many_mnemonics', (ctx) => {
    ctx.reply('В разработке...')
  })
  bot.action('stop_mnemonic_input', leaveGetMnemonic)
  bot.action('add_user', startAddUser)
  bot.action('stop_add_user', leaveAddUser)
  bot.action('make_newsletter', startMakeNewsletter)
  bot.action('stop_newsletter', leaveMakeNewsletter)
  bot.action('delete_user', startDeleteUser)
  bot.action('stop_delete_user', leaveDeleteUser)

  return bot
}

module.exports = { setupBot }