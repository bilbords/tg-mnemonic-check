'use strict'

require('dotenv').config({ path: './config/.env' })

const bip39 = require('bip39')
const HDKey = require('hdkey')
const bitcoin = require('bitcoinjs-lib')
const EthereumUtils = require('ethereumjs-util')
const Web3 = require('web3')
const TronWeb = require('tronweb')
const { Keypair } = require('@solana/web3.js')
const axios = require('axios')
const ed25519 = require('ed25519-hd-key')
const { Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js')
const Binance = require('@binance-chain/javascript-sdk')

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL))
const tronWeb = new TronWeb({
  fullHost: process.env.TRONGRID_URL,
  solidityNode: process.env.TRONGRID_URL,
  eventServer: process.env.TRONGRID_URL,
})

async function getBTCBalance(mnemonic) {
  const path = "m/84'/0'/0'/0/0"
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const node = HDKey.fromMasterSeed(seed)
  const child = node.derive(path)
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: bitcoin.networks.bitcoin,
  })
  const addressBTC = address
  const { data } = await axios.get(
    `https://blockchain.info/q/addressbalance/${addressBTC}`
  )
  const balanceBTC = data / 100000000
  return { addressBTC, balanceBTC }
}

async function getETHBalance(mnemonic) {
  const USDTContractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  const USDCContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  const USDTABI = require('../config/usdt-abi.json')
  const USDCABI = require('../config/usdc-abi.json')
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const rootNode = HDKey.fromMasterSeed(seed)
  const childNode = rootNode.derive("m/44'/60'/0'/0/0")
  const publicKey = childNode.publicKey
  const addressETH = EthereumUtils.toChecksumAddress(
    '0x' + EthereumUtils.publicToAddress(publicKey, true).toString('hex')
  )
  const balanceETH = await new Promise((resolve, reject) => {
    web3.eth.getBalance(addressETH, async (error, balance) => {
      if (error) reject(error)
      const balanceInEther = await web3.utils.fromWei(balance, 'ether')
      resolve(balanceInEther)
    })
  })
  const USDTContract = new web3.eth.Contract(USDTABI, USDTContractAddress)
  const balanceUSDT_ERC20 = await USDTContract.methods
    .balanceOf(addressETH)
    .call()
    .then((balance) => {
      const balanceWithDecimals = balance / 10 ** 6
      return balanceWithDecimals
    })
    .catch((error) => {
      console.error('Get USDT ERC20 balance error: ', error)
    })
  const USDCContract = new web3.eth.Contract(USDCABI, USDCContractAddress)
  const balanceUSDC_ERC20 = await USDCContract.methods
    .balanceOf(addressETH)
    .call()
    .then((balance) => {
      const balanceWithDecimals = balance / 10 ** 6
      return balanceWithDecimals
    })
    .catch((error) => {
      console.error('Get USDC ERC20 balance error: ', error)
    })
  return { addressETH, balanceETH, balanceUSDT_ERC20, balanceUSDC_ERC20 }
}

async function getSOLBalance(mnemonic) {
  const connection = new Connection(process.env.MAINBET_BETA_URL)
  const path = "m/44'/501'/0'"
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const derivedSeed = ed25519.derivePath(path, seed.toString('hex')).key
  const keypair = Keypair.fromSeed(derivedSeed)
  const addressSOL = keypair.publicKey.toBase58()
  const balance = await connection.getBalance(keypair.publicKey)
  const balanceSOL = balance / LAMPORTS_PER_SOL
  return { addressSOL, balanceSOL }
}

async function getTRXBalance(mnemonic) {
  const path = "m/44'/195'/0'/0/0"
  const USDTTokenAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  const USDCTokenAddress = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const masterNode = HDKey.fromMasterSeed(seed)
  const childNode = masterNode.derive(path)
  const privateKeyHex = childNode.privateKey.toString('hex')
  const addressTRX = await tronWeb.address.fromPrivateKey(privateKeyHex)
  const balanceTRX = (await tronWeb.trx.getBalance(addressTRX)) / 10 ** 6
  const balanceUSDT_TRC20 = await axios
    .get(`https://apilist.tronscan.org/api/account?address=${addressTRX}`)
    .then((response) => {
      const USDTTokenBalance = response.data.trc20token_balances.find(
        (token) => token.tokenId === USDTTokenAddress
      )
      if (USDTTokenBalance !== undefined) {
        return USDTTokenBalance.balance / 10 ** 6
      } else {
        return 0
      }
    })
    .catch((error) => {
      console.log('Get USDT TRC20 balance error: ', error)
    })
  const balanceUSDC_TRC20 = await axios
    .get(`https://apilist.tronscan.org/api/account?address=${addressTRX}`)
    .then((response) => {
      const USDCTokenBalance = response.data.trc20token_balances.find(
        (token) => token.tokenId === USDCTokenAddress
      )
      if (USDCTokenBalance !== undefined) {
        return USDCTokenBalance.balance / 10 ** 6
      } else {
        return 0
      }
    })
    .catch((error) => {
      console.log('Get USDC TRC20 balance error: ', error)
    })
  return { addressTRX, balanceTRX, balanceUSDT_TRC20, balanceUSDC_TRC20 }
}

async function getBSCBalance(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const rootNode = HDKey.fromMasterSeed(seed)
  const childNode = rootNode.derive("m/44'/60'/0'/0/0")
  const publicKey = childNode.publicKey
  const addressBSC = EthereumUtils.toChecksumAddress(
    '0x' + EthereumUtils.publicToAddress(publicKey, true).toString('hex')
  )
  const balanceBSC = await axios
    .get(
      `https://api.bscscan.com/api?module=account&action=balance&address=${addressBSC}&apikey=${process.env.BSCSCAN_API_KEY}`
    )
    .then((response) => {
      return Number(response.data.result / 10 ** 18).toFixed(18)
    })
    .catch((error) => {
      console.log('Get BSC balance error: ', error)
      return 0
    })
  return { addressBSC, balanceBSC }
}

async function getBNBBBalance(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const rootNode = HDKey.fromMasterSeed(seed)
  const childNode = rootNode.derive(`m/44'/714'/0'/0/0`)
  const privateKey = childNode.privateKey.toString('hex')
  const publicKey = Binance.crypto.getPublicKeyFromPrivateKey(privateKey)
  const addressBNB = Binance.crypto.getAddressFromPublicKey(publicKey, 'bnb')
  const balanceBNB = await axios
    .get(`https://dex.binance.org/api/v1/account/${addressBNB}`)
    .then((response) => {
      const BNB = response.data.balances.find(
        (balances) => balances.symbol === 'BNB'
      )
      console.log("BNB Result: ", BNB)
      if (BNB === undefined) {
        return 0
      } else {
        return BNB.free
      }
    })
    .catch((error) => {
      console.log('Get BNB balance error: ', error)
      return 0
    })
  return { addressBNB, balanceBNB }
}

module.exports = {
  getBTCBalance,
  getETHBalance,
  getSOLBalance,
  getTRXBalance,
  getBNBBBalance,
  getBSCBalance,
}
