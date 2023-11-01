// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/utils/math/Math.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/security/ReentrancyGuard.sol";

contract GST_ICO is ReentrancyGuard  {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // The token being sold
    IERC20 private _token;
    IERC20 private _usdt;

    // Address where funds are collected
    address private _wallet;
    address private _tokenWallet;

    uint256 private _rate;
    // Amount of wei raised
    uint256 private _weiRaised;

    uint256 private _minContribution = 50000000;
    uint256 private _totalDistribution;

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor (uint256 rate_, address wallet_, IERC20 token_, IERC20 usdt_, address tokenWallet_) {
        require(rate_ > 0, "Crowdsale: rate is 0");
        require(wallet_ != address(0), "Crowdsale: wallet is the zero address");
        require(address(token_) != address(0), "Crowdsale: token is the zero address");
        require(address(usdt_) != address(0), "Crowdsale: usdt is the zero address");
        require(tokenWallet_ != address(0), "Crowdsale: token wallet is the zero address");

        _rate = rate_; // as rate is 0.00000002 we will make it 2 and in getTokenAmount function we will divide the result with 100000000
        _wallet = wallet_;
        _token = token_;
        _usdt = usdt_;
        _tokenWallet = tokenWallet_;
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function wallet() public view returns (address) {
        return _wallet;
    }

    function tokenWallet() public view returns (address) {
        return _tokenWallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    function remainingTokens() public view returns (uint256) {
        return Math.min(token().balanceOf(_tokenWallet), token().allowance(_tokenWallet, address(this)));
    }

    function buyTokens(address beneficiary, uint256 amount) public nonReentrant {
        uint256 weiAmount = amount;
        _preValidatePurchase(beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        _usdt.safeTransferFrom(msg.sender, _wallet, weiAmount);

        // update state
        _weiRaised = _weiRaised.add(weiAmount);
        _totalDistribution = _totalDistribution.add(tokens);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(msg.sender, beneficiary, weiAmount, tokens);

    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        require(weiAmount >= _minContribution, "Crowdsale: amount is below minimum purchase limit");

        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }
    
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        token().safeTransferFrom(_tokenWallet, beneficiary, tokenAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.mul(_rate).div(100000000);
    }

}