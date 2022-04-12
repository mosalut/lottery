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

		await dai.connect(accounts[1]).approve(lottery.address, ethers.utils.parseEther("500")); 
		await lottery.connect(accounts[1]).chipIn(10, 4567);

		await network.provider.send("evm_increaseTime", [1000])
		await network.provider.send("evm_mine") // this one will have 02:00 PM as its timestamp

		console.log(await lottery.lastStake(accounts[1].address));
	});
});
