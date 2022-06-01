const stakeToken = artifacts.require('Stakecoin')
const daiToken = artifacts.require('MockDai')
const tokenFarm = artifacts.require('TokenFarm')

contract('TokenFarm', async ([owner, user]) => {

    let dai_token, stake_token, token_farm

    before(async () =>{
        dai_token = await daiToken.new()
        stake_token = await stakeToken.new()
        token_farm = await tokenFarm.new(stake_token.address, dai_token.address)

        let dai_balance = await dai_token.balanceOf(owner)
        await dai_token.transfer(user,dai_balance)

        let stake_token_balance = await stake_token.balanceOf(owner)
        await stake_token.transfer(token_farm.address,stake_token_balance)

        await dai_token.increaseAllowance(token_farm.address,dai_balance)
        await dai_token.increaseAllowance(user,dai_balance)

        await stake_token.increaseAllowance(token_farm.address,stake_token_balance)
        await stake_token.increaseAllowance(user,stake_token_balance)
    })

    it('Stake tokens', async () => {
        let user_balance = await dai_token.balanceOf(user)

        await dai_token.approve(token_farm.address, user_balance, {from:user})
        await token_farm.stakeTokens(user_balance, {from:user})

        let token_farm_balance = await token_farm.stakingBalance(user)
        assert.equal(user_balance.toString(),token_farm_balance.toString(), "DAI balance now updated")

        user_balance = await dai_token.balanceOf(user)
        assert.equal('0',user_balance.toString(),'DAI balance should be zero')
    })

    it('Issue tokens', async () => {
        let stake_token_balance = await stake_token.balanceOf(token_farm.address)
        await token_farm.issueTokens({from:owner})
        let issued_balance = await stake_token.balanceOf(user)
        assert(stake_token_balance.toString(),issued_balance.toString(),"Issued tokens not received")
    })

    it('Unstake tokens', async () => {
        let staked_balance = await token_farm.stakingBalance(user)

        await token_farm.unstakeTokens({from:user})

        let user_balance = await dai_token.balanceOf(user)
        assert.equal(user_balance.toString(),staked_balance.toString(), "DAI balance not unstaked")
    })
})