const hre = require("hardhat");

async function main() {
	await deployDai();
	await deployLottery();
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});

var dai;
var lottery;

async function deployDai() {
//	accounts = await ethers.getSigners();
	const Dai = await hre.ethers.getContractFactory("Dai");
	dai = await Dai.deploy();

	await dai.deployed();

	console.log("Dai deployed to:", dai.address);
//	await dai.mint(accounts[0].address, ethers.utils.parseEther("100000000"));
	await dai.mint("0xe925a77b1dC55803d35D84d01105DBD4a4b47560", ethers.utils.parseEther("100000000"));
}

async function deployLottery() {
	const Lottery = await hre.ethers.getContractFactory("Lottery");
	lottery = await Lottery.deploy(dai.address);

	await lottery.deployed();

	console.log("lottery deployed to:", lottery.address);

	await dai.approve(lottery.address, ethers.utils.parseEther("100000000"));
	await dai.transferOwnership(lottery.address);
}
