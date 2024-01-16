const ethers = require('ethers');


const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/abc');


const token0 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH
const token1 = '0x6b175474e89094c44da98b954eedeac495271d0f'; // DAI
const uniRouterAddress = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const sushiRouterAddress = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'

const PATH = [token0, token1]

const routerAbi = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
]

const uniRouter = new ethers.Contract(uniRouterAddress, routerAbi, provider);
const sushiRouter = new ethers.Contract(sushiRouterAddress, routerAbi, provider);

const amountIn = ethers.utils.parseEther('1');

const main = async () => {
    const uniAmount = await uniRouter.getAmountsOut(amountIn, PATH)
    const sushiAmount = await sushiRouter.getAmountsOut(amountIn, PATH)

    const uniPrice = Number(uniAmount[1]) / Number(uniAmount[0])
    const sushiPrice = Number(uniAmount[1]) / Number(uniAmount[0])
    console.log('uniPrice', uniPrice)
    console.log('sushiPrice', sushiPrice)

    const TX_FEE = 0.003

    let effUniPrice
    let effSushiPrice
    let spread

    if (uniPrice > sushiPrice) {
        effUniPrice = uniPrice - (uniPrice * TX_FEE)
        effSushiPrice = sushiPrice + (sushiPrice * TX_FEE)
        spread = effUniPrice - effSushiPrice
        console.log('unii to sushi spread:', spread)
        if (spread > 0) {
            console.log('sell on uni, buy on sushi')
        } else {
            console.log('no arb opportunity')
        }
    } else if (sushiPrice > uniPrice) {
        effSushiPrice = sushiPrice - (sushiPrice * TX_FEE)
        effUniPrice = uniPrice + (uniPrice * TX_FEE)
        spread = effSushiPrice - effUniPrice
        console.log('sushi to uni spread:', spread)
        if (spread > 0) {
            console.log('sell on sushi, buy on uni')
        } else {
            console.log('no arb opportunity')
        }
    }
}
main()