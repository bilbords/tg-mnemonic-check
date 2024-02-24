const { Scenes } = require('telegraf')

const bip39 = require('bip39')

const { stopMnemonicInput_button } = require('../../utils/inlineButtons')

const {
  getBTCBalance,
  getETHBalance,
  getSOLBalance,
  getTRXBalance,
  getBNBBBalance,
  getBSCBalance,
} = require('../../utils/checkOneMnemonic.js')

const getMnemonic = new Scenes.BaseScene('get-mnemonic')

getMnemonic.enter(async (ctx) => {
  await ctx.reply(
    `Введите mnemonic-фразу, которую нужно проверить на наличие баланса`,
    stopMnemonicInput_button
  )
})

getMnemonic.on('text', async (ctx) => {
  if (ctx.message.text !== undefined) {
    let mnemonicPhrase = ctx.message.text
    if (bip39.validateMnemonic(mnemonicPhrase) === false) {
      await ctx.reply(
        'Неверно введена seed-фраза! Повторите попытку',
        stopMnemonicInput_button
      )
    } else {
      await ctx.replyWithHTML('<b>Обработка mnemonic-фразы...</b>')
      await ctx.replyWithSticker(
        'CAACAgIAAxkBAAIoM2QbD7Z3XzSkLaqUWmDr1lgoq3rQAAISAAM7YCQUF_Z7M7pPlcQvBA'
      )
      const { addressBTC, balanceBTC } = await getBTCBalance(mnemonicPhrase)
      const { addressETH, balanceETH, balanceUSDT_ERC20, balanceUSDC_ERC20 } =
        await getETHBalance(mnemonicPhrase)
      const { addressSOL, balanceSOL } = await getSOLBalance(mnemonicPhrase)
      const { addressTRX, balanceTRX, balanceUSDT_TRC20, balanceUSDC_TRC20 } =
        await getTRXBalance(mnemonicPhrase)
      const { addressBNB, balanceBNB } = await getBNBBBalance(mnemonicPhrase)
      const { addressBSC, balanceBSC } = await getBSCBalance(mnemonicPhrase)
      await ctx.replyWithHTML(`
<b>
Обработка mnemonic-фразы успешно завершена!
\nФраза: <code>${mnemonicPhrase}</code>
</b>
      `)
      await ctx.replyWithHTML(
        `
<b>
BTC баланс: ${balanceBTC} BTC
ETH баланс: ${balanceETH} ETH
USDT (ERC) баланс: ${balanceUSDT_ERC20} USDT
USDC (ERC) баланс: ${balanceUSDC_ERC20} USDT
USDT (TRC) баланс: ${balanceUSDT_TRC20} USDT
USDC (TRC) баланс: ${balanceUSDC_TRC20} USDT
TRX баланс: ${balanceTRX} TRX
BNB баланс: ${balanceBNB} BNB
BSC баланс: ${balanceBSC} BSC
SOL баланс: ${balanceSOL} SOL
</b>
      `
      )
      await ctx.replyWithHTML(`
<b>
BTC адрес: <code>${addressBTC}</code>
ETH адрес: <code>${addressETH}</code>
USDT (ERC) адрес: <code>${addressETH}</code>
USDC (ERC) адрес: <code>${addressETH}</code>
USDT (TRC) адрес: <code>${addressTRX}</code>
USDC (TRC) адрес: <code>${addressTRX}</code>
TRX адрес: <code>${addressTRX}</code>
BNB адрес: <code>${addressBNB}</code>
BSC адрес: <code>${addressBSC}</code>
SOL адрес: <code>${addressSOL}</code>
</b>
      `)
      await ctx.scene.leave()
    }
  }
})

getMnemonic.leave(async (ctx) => {
  await ctx.reply('Вы вышли из режима ввода mnemonic-фразы')
})

module.exports = { getMnemonic }