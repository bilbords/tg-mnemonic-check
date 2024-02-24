const { Markup } = require('telegraf')

const checkOneMnemonic_button = Markup.inlineKeyboard([
  Markup.button.callback('🧤 Проверить одну фразу', 'check_one_mnemonic'),
])

const stopMnemonicInput_button = Markup.inlineKeyboard([
  Markup.button.callback('❌ Остановить ввод фразы', 'stop_mnemonic_input'),
])

const stopAddUser_button = Markup.inlineKeyboard([
  Markup.button.callback(
    '❌ Остановить добавление пользователя',
    'stop_add_user'
  ),
])

const addUser_button = Markup.inlineKeyboard([
  Markup.button.callback('👨 Добавить пользователя', 'add_user'),
])

const deleteUser_button = Markup.inlineKeyboard([
  Markup.button.callback('💀 Удалить пользователя', 'delete_user'),
])

const stopDeleteUser_button = Markup.inlineKeyboard([
  Markup.button.callback(
    '❌ Отменить удаление пользователя',
    'stop_delete_user'
  ),
])

const makeNewsletter_button = Markup.inlineKeyboard([
  Markup.button.callback('📨 Сделать рассылку', 'make_newsletter'),
])

const stopNewsletter_button = Markup.inlineKeyboard([
  Markup.button.callback('❌ Остановить ввод текста', 'stop_newsletter'),
])

const userButtons = Markup.inlineKeyboard([
  [
    Markup.button.callback('🧤 Проверить одну фразу', 'check_one_mnemonic'),
    Markup.button.callback(
      '🤑 Проверить несколько фраз',
      'check_many_mnemonics'
    ),
  ],
])

const adminButtons = Markup.inlineKeyboard([
  [
    Markup.button.callback('👨 Добавить пользователя', 'add_user'),
    Markup.button.callback('💀 Удалить пользователя', 'delete_user'),
  ],
  [Markup.button.callback('📨 Сделать рассылку', 'make_newsletter')],
])

module.exports = {
  checkOneMnemonic_button,
  stopMnemonicInput_button,
  addUser_button,
  stopAddUser_button,
  deleteUser_button,
  stopDeleteUser_button,
  makeNewsletter_button,
  stopNewsletter_button,
  userButtons,
  adminButtons,
}