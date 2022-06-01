const stakeToken = artifacts.require('Stakecoin')
const daiToken = artifacts.require('MockDai')
const tokenFarm = artifacts.require('TokenFarm')

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(daiToken)
    const dai_token = await daiToken.deployed()

    await deployer.deploy(stakeToken)
    const stake_token = await stakeToken.deployed()

    await deployer.deploy(tokenFarm, stake_token.address, dai_token.address)
    const token_farm = await tokenFarm.deployed()

    let stake_token_balance = await stake_token.balanceOf(accounts[0])

    await stake_token.transfer(token_farm.address, stake_token_balance)

    let dai_balance = await dai_token.balanceOf(accounts[0])
    await dai_token.transfer(accounts[1], dai_balance)
}