const hre = require("hardhat");

async function main() {
	deployDai();
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});

async function deployDai() {
	const Dai = await hre.ethers.getContractFactory("Dai");
	const dai = await Dai.deploy();

	await dai.deployed();

	console.log("Dai deployed to:", dai.address);
	await dai.mint(accounts[0].address, ethers.utils.parseEther("100000000"));
}

async function deployLottery() {
	const Lottery = await hre.ethers.getContractFactory("Lottery");
	const lottery = await Lottery.deploy(dai.address, "0xe925a77b1dC55803d35D84d01105DBD4a4b47560");

	await lottery.deployed();

	console.log("lottery deployed to:", lottery.address);

	await dai.approve(lottery.address, ethers.utils.parseEther("100000000"));
	await dai.transferOwnership(lottery.address);
}
