// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Presale is Ownable, Pausable {
    string public projectName;
    uint256 public constant maxCap = 4033043919 * 10 ** 18;
    uint256 public totalRaised;
    uint8 public currentRound = 0;

    uint256 public cliffDuration;
    uint256 public vestingStartTime;
    uint256 public vestingDuration;
    uint256 public vestingInterval;
    uint256 public cliffPercentage;

    IERC20 public depositToken; // deposit token
    IERC20 public vestingToken; // deposit token

    struct Round {
        uint256 maxDepositToken;
        uint256 amountRaised;
        uint256 price;
        uint256 vestedTokens;
        uint256 tokensSold;
    }

    struct User {
        uint256 investedAmount;
        uint256 totalVestedAmounts;
        uint256 claimedTokens;
    }

    struct RoundTime {
        uint256 start;
        uint256 end;
    }

    Round[10] public rounds;
    mapping(address => User) public userDetails;
    mapping(uint256 => RoundTime) public roundTime;

    event TokensDeposited(address indexed user, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    event TokenAdded(address indexed token, uint256 amount);
    event TokenWithdraw(address indexed token, uint256 amount);
    event RoundTimeUpdated(uint256 indexed round, uint256 start, uint256 end);

    constructor(
        string memory _projectName,
        address _vestingToken,
        address _depositToken,
        uint256 _vestingDuration,
        uint256 _vestingInterval,
        uint256 _cliffDuration,
        uint256 _vestingStartTime,
        uint256 _cliffPercentage
    ) Ownable(msg.sender) {
        require(
            _depositToken != address(0) && _vestingToken != address(0),
            "Zero token address"
        );
        projectName = _projectName;
        vestingToken = IERC20(_vestingToken);
        depositToken = IERC20(_depositToken);
        vestingDuration = _vestingDuration;
        cliffDuration = _cliffDuration;
        vestingStartTime = _vestingStartTime;
        vestingInterval = _vestingInterval;
        cliffPercentage = _cliffPercentage;

        // Initialize rounds with prices in wei
        rounds[0] = Round(250000 * 10 ** 18, 0, 1000000000000000, 250000000 * 10 ** 18, 0); // 0.001 ether
        rounds[1] = Round(350000 * 10 ** 18, 0, 1120000000000000, 312500000 * 10 ** 18, 0); // 0.00112 ether
        rounds[2] = Round(450000 * 10 ** 18, 0, 1240000000000000, 362903226 * 10 ** 18, 0); // 0.00124 ether
        rounds[3] = Round(550000 * 10 ** 18, 0, 1380000000000000, 398550725 * 10 ** 18, 0); // 0.00138 ether
        rounds[4] = Round(650000 * 10 ** 18, 0, 1520000000000000, 427631579 * 10 ** 18, 0); // 0.00152 ether
        rounds[5] = Round(750000 * 10 ** 18, 0, 1680000000000000, 446428571 * 10 ** 18, 0); // 0.00168 ether
        rounds[6] = Round(850000 * 10 ** 18, 0, 1860000000000000, 456989247 * 10 ** 18, 0); // 0.00186 ether
        rounds[7] = Round(950000 * 10 ** 18, 0, 2060000000000000, 461165049 * 10 ** 18, 0); // 0.00206 ether
        rounds[8] = Round(1050000 * 10 ** 18, 0,2280000000000000, 460526316 * 10 ** 18,0);
        rounds[9] = Round(1150000 * 10 ** 18, 0,2520000000000000, 456349206 * 10 ** 18, 0 );
    }

    function updateVestingStartTime(uint256 _start) public onlyOwner {
        require(
            vestingStartTime > block.timestamp,
            "Vesting has already started"
        );
        require(
            _start > vestingStartTime,
            "New vesting start time must be greater than the current vesting start time"
        );
        vestingStartTime = _start;
    }

    function updateRoundTimes(
        uint8[] calldata _rounds,
        uint256[] calldata _starts,
        uint256[] calldata _ends
    ) external onlyOwner {
        require(
            _rounds.length == _starts.length && _starts.length == _ends.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < _rounds.length; i++) {
            uint8 round = _rounds[i];
            uint256 start = _starts[i];
            uint256 end = _ends[i];

            require(round < rounds.length, "Invalid round");
            require(start < end, "Start time must be less than end time");

            roundTime[round] = RoundTime(start, end);
            emit RoundTimeUpdated(round, start, end);
        }
    }

    function nextRound() external onlyOwner {
        require(
            block.timestamp > roundTime[currentRound].end,
            "Current round is not ended yet!"
        );
        currentRound += 1;
    }

    function depositTokens(uint256 amount) public whenNotPaused {
        require(block.timestamp >= roundTime[currentRound].start, "Sale not started yet");
        require(block.timestamp <= roundTime[currentRound].end, "Sale Ended");
        require(
            currentRound < rounds.length,
            "All presale rounds are completed"
        );
        require(amount > 0, "Insufficient amount sent");

        uint256 tokensToBuy = (amount / rounds[currentRound].price) * 10**18;
        require(
            amount + rounds[currentRound].amountRaised <= rounds[currentRound].maxDepositToken,
            "Max cap reached for this round"
        );

        rounds[currentRound].tokensSold += tokensToBuy;
        rounds[currentRound].amountRaised += amount;
        totalRaised += amount;
        userDetails[msg.sender].investedAmount += amount;
        userDetails[msg.sender].totalVestedAmounts += tokensToBuy;

        depositToken.transferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(msg.sender, amount);
    }

    function claimTokens() public whenNotPaused {
        require(
            block.timestamp >= vestingStartTime + cliffDuration,
            "Cliff period not over"
        );
        uint256 claimableTokens = calculateUnlockedToken(msg.sender);
        require(claimableTokens > 0, "No tokens available for claim");

        vestingToken.transfer(msg.sender, claimableTokens);
        userDetails[msg.sender].claimedTokens += claimableTokens;
        emit TokensClaimed(msg.sender, claimableTokens);
    }

    function calculateUnlockedToken(
        address _wallet
    ) public view returns (uint256) {
        uint256 totalVested = userDetails[_wallet].totalVestedAmounts;

        if (block.timestamp < vestingStartTime + cliffDuration) {
            return 0;
        } else if (
            block.timestamp >=
            vestingStartTime + cliffDuration + vestingDuration
        ) {
            return totalVested - userDetails[_wallet].claimedTokens;
        } else {
            uint256 elapsedTime = block.timestamp -
                (vestingStartTime + cliffDuration);
            uint256 vestingPeriods = elapsedTime / vestingInterval;
            uint256 cliffReleaseAmount = (totalVested * cliffPercentage) / 100; // cliffPercentage is a value between 0-100
            uint256 totalUnlocked = cliffReleaseAmount +
                ((totalVested - cliffReleaseAmount) *
                    vestingPeriods *
                    vestingInterval) /
                vestingDuration;
            return totalUnlocked - userDetails[_wallet].claimedTokens;
        }
    }

    function addTokensToPresale(uint256 amount) external onlyOwner {
        vestingToken.transferFrom(msg.sender, address(this), amount);
        emit TokenAdded(address(vestingToken), amount);
    }

    function withdrawTokens(address _token) external onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(msg.sender, amount);
        emit TokenWithdraw(address(_token), amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
