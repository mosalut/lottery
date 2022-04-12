const { expect } = require("chai");
const { ethers } = require("hardhat");

var dai;
var lottery;
var accounts;

beforeEach(async function () {
	accounts = await ethers.getSigners();
	const Dai = await hre.ethers.getContractFactory("Dai");
	dai = await Dai.deploy();
	await dai.deployed();

	console.log("Dai deployed to:", dai.address);
	await dai.mint(accounts[0].address, ethers.utils.parseEther("100000000"));

	const Lottery = await hre.ethers.getContractFactory("Lottery");
	lottery = await Lottery.deploy(dai.address);
	await lottery.deployed();

	console.log("lottery deployed to:", lottery.address);

	await dai.approve(lottery.address, ethers.utils.parseEther("100000000"));
	console.log("allowance:", await dai.allowance(dai.address, lottery.address));
	await dai.transferOwnership(lottery.address);
});

/*
describe("Dai", function () {
	it("Total supply", async function () {
		for(let i = 0; i < accounts.length; i++) {
			console.log(accounts[i].address);
		}
		expect(await dai.totalSupply()).to.equal(ethers.utils.parseEther("100000000"));
		expect(await dai.balanceOf(accounts[0].address)).to.equal(ethers.utils.parseEther("100000000"));
	});
});
*/

describe("Lottery", function () {
	it("Create round", async function () {
		let timestamp = Date.parse(new Date()) / 1000;
		console.log("timestamp:", timestamp);
	//	await lottery.createRound(timestamp); // not passed
	//	await lottery.createRound(timestamp + 300); // sometimes not passed
		await lottery.createRound(timestamp + 600); // passed
		console.log("Newest order", await lottery.newest());
		expect(await lottery.newest()).to.equal(1);
	});

	it("Chip in", async function () {
		let timestamp = Date.parse(new Date()) / 1000;
		console.log("timestamp:", timestamp);
		await lottery.createRound(timestamp + 600);

		await dai.transfer(accounts[1].address, ethers.utils.parseEther("100000"));
		console.log("account1:", await dai.balanceOf(accounts[1].address));
		console.log("dai:", await dai.balanceOf(dai.address));

		await dai.connect(accounts[1]).approve(lottery.address, ethers.utils.parseEther("500")); 
		let winNumber = await lottery.debug();
		await lottery.connect(accounts[1]).chipIn(10, winNumber);

		await network.provider.send("evm_increaseTime", [1000])
		await network.provider.send("evm_mine");

		console.log(await lottery.lastStake(accounts[1].address));
		console.log(await lottery.runingRound());
		await network.provider.send("evm_mine");
		timestamp = Date.parse(new Date()) / 1000;
		await network.provider.send("evm_increaseTime", [1000])
		await network.provider.send("evm_mine");
		await lottery.createRound(timestamp + 2600);
		await lottery.connect(accounts[1]).chipIn(1, winNumber);
		console.log("account1:", await dai.balanceOf(accounts[1].address));
		console.log("dai:", await dai.balanceOf(dai.address));
	});
});

// 两次投注英语解释太复杂，第一轮投了10 花费 10 * 5e18 wei
// 第一次投注的结算要等到，第二轮再次投注投注
// 由于第一轮总池只有一注，虽然中奖了，但是手续费20%，其实是亏手续费，因为只有一注，赢不到别人的
// 这个时候第二轮投注进来，但是第二轮奖励还未结算，所以看起来亏很多，但是数字是对的
