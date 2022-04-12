require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: {
		version: "0.8.9",
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000
			}
		}
	},
	defaultNetwork: "localhost",
	networks: {
		localhost: {
			url: "http://0.0.0.0:8545",
		},
		testnet: {
			url: "https://eth-ropsten.alchemyapi.io/v2/q9dkePbPFo_irrYcnQdyYegtY5z8XcK-",
			chainId: 3,
			gasPrice: 20000000000,
			accounts: ["0x6473d773ad0941f0b096083b9823435c5f955bef3f878578b3cf7856dec81779"]
		}
	}
};
