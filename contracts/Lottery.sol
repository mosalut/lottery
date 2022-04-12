//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

/*
	Develop by mosalut
*/

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/access/Ownable.sol";

import "./Dai.sol";

contract Lottery is Ownable {
	// DAI owner address. recieve fee and send reward.
	private address daiOwner;

	// The orderNumber of round.
	private uint128 orderNumber;

	// The winning number of every round.
	private mapping(uint128 => string) winNumber;

	// The timestamp near by the next round start block time.
	// And if set it before it comes, then means overwrite it.
	private uint timestamp;

	// Reward pools, the key is orderNumber.
	private mapping(uint128 => uint) pools;

	// the total stakes at the round draw.
	private mapping(uint128 => uint) totalStakes;

	// users' stakes to the last round of the user join in.
	private mapping(address => uint) stakes;

	// users' last orderNumber stake.
	private mapping(address => uint128) lastStakeOrderNumber;

	// users' last chip in number. 
	private mapping(address => string) chipInNumbers;

	// The winners of each round.
	private mapping(uint128 => address[]) winners;
	private mapping(uint128 => uint128) winnerPoints;

	// send the updated timestamp of the next round notice message to user.
	event CreateRound(uint timestamp);

	// reward message.
	event Reward(uint128, address, uint);

	constructor(address daiAddress) external {
		// The ERC20 contract DAI should have been approved to this contract by migrating.
		dai = Dai(daiAddr);
	}

	/*
		@mosalut
		Create one round.
		Set the timestamp through arg0
	*/
	function createRound(uint _timestamp) external onlyOwner {
		require(_timestamp - block.timestamp > 60, "Each round shound at least have one minute for the users to ready");
		timestamp = _timestamp;

		
		// stake == 0 means the user hasn't join any round after last computing untill now.


	}

	/*
		@mosalut
		chip in a round.
	*/
	function chipIn(uint stake, string numbers) external {
		// Compute the reward of the last round of user join in.
		// Withdraw and clean it.
		uint stake = stakes[msg.sender];
		if stake != 0 {
			_orderNumber = lastStakeOrderNumber[msg.sender];

			// if win
			if(chipInNumbers[msg.sender] == winNumber[_orderNumber]) {
				// 5e18 = 1e18 * 5, cause 1 stake cost 5 DAI.
				uint rewardWithFee = totalStakes[_orderNumber] * 5e18 / countWinStakes(_orderNumber) / 5e18;
				reward = rewardWithFee * 80 / 100;
				fee = rewardWithFee * 20 / 100;

				pools[_orderNumber] -= rewardWithFee;

				// Because fee account is the same as reward account
				// so needn't recieve fee after below oparation.
				dai.transferFrom(daiOwner, msg.sender, reward);

				emit Reward(_orderNumber, msg.sender, reward);
			}

			emit CreateRound(_timestamp);
		}		

		// update the stakes of the user.
		stakes[msg.sender] = stake;

		// update the last round the user join in number.
		lastStakeOrderNumber[msg.sender] = orderNumber;
	}

	/*
		@mosalut
		Count all winners' stake in a round.
	*/
	function countWinStakes(uint128 _orderNumber) view internal return(uint) {
		uint winStakes;
		for(uint128 i = 0; i < winnerPoints[_orderNumber]; i++) {
			winStakes += stakes[winners[_orderNumber][i]];
		}

		return winStakes;
	}

	/*
		@mosalut
		History round info

		The frist return value is win number of this round.
		The Second return value is all winners account of this round. 
	*/
	function history(uint128 _orderNumber) external view return(string memory, address[] memory) {
		returns (
			winNumber[_orderNumber],
			winners[_orderNumber])
		);
	}

	/*
		@mosalut
		History winner stakes by account.

		The second param is the account wants to query.
		The return value is the stakes the winner stake.
	*/
	function historyWinnerStakes(uint128 _orderNumber, address account) external view return(uint) {
		for(uint128 i = 0; i < winnerPoints[_orderNumber]; i++ {
			if(account == winners[_orderNumber][i]) {
				return stakes[winners[_orderNumber][i]];
			}
		}
		returns 0;
	}
}
