const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {
  let token_farm = await TokenFarm.deployed()
  await token_farm.issueTokens()
  console.log("Tokens issued!")
  callback()
}