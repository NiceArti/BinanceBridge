//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IBinanceBridge.sol";

contract BinanceBridge is IBinanceBridge, Ownable
{
    using SafeERC20 for IERC20;

    uint256 private immutable _chainID;
    mapping(bytes32 => mapping(address => InitAuthorization)) private _initialization;
    mapping(bytes32 => bool) private tokensReceived;
    mapping(address => mapping(uint256 => address)) public tokenEquivalent;

    constructor()
    {
        uint256 chainID;
        assembly { chainID := chainid() }
        _chainID = chainID;
    }

    function swap(
        address token,
        uint256 amount,
        uint256 nonce,
        uint256 chainIDTo
    ) external
    {
        address equivalent = tokenEquivalent[token][chainIDTo];
        require(equivalent != address(0), "BinanceBridge: equivalent do not exist yet");

        bytes32 key = keccak256(abi.encode(token, msg.sender, amount, nonce, _chainID, chainIDTo));
        _initialize(key, token, equivalent, msg.sender, amount, nonce, _chainID, chainIDTo);

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit SwapInitialized(token, msg.sender, amount, nonce, _chainID, chainIDTo);
    }
    


    function redeem(InitAuthorization calldata init) external
    {
        require(init.account == msg.sender, "BinanceBridge: not a caller for redeem");
        (bool status, string memory err) = _verify(init);
        require(status == true, err);

        IERC20(init.tokenB).safeTransfer(msg.sender, init.amount);
    }



    function setEquivalent(
        address tokenA,
        address tokenB,
        uint256 chainTo
    ) external onlyOwner
    {
        tokenEquivalent[tokenA][chainTo] = tokenB;
    }


    function donateToken(
        address tokenA,
        address tokenB,
        uint256 chainTo,
        uint256 amount
    ) external
    {
        tokenEquivalent[tokenA][chainTo] = tokenB;
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amount);
    }


    function returnTokens(bytes32 key) external
    {
        require(_initialization[key][msg.sender].status == Status.INITIALIZED, "BinanceBridge: not initialized");
        _initialization[key][msg.sender].status = Status.NOT_INITIALIZED;
        IERC20(_initialization[key][msg.sender].tokenA).transfer(msg.sender, _initialization[key][msg.sender].amount);
    }


    function _verify(InitAuthorization calldata init) 
        private
        returns(bool, string memory)
    {
        if(init.status != Status.INITIALIZED)
            return (false, "BinanceBridge: not initialized");

        bytes32 message = keccak256(abi.encodePacked(
            init.tokenA,
            init.account,
            init.amount,
            init.nonce,
            init.blockchainIdFrom,
            init.blockchainIdTo
        ));
        address recoveredAddress = ecrecover(_hashMessage(message), init.v, init.r, init.s);

        if(recoveredAddress == address(0) || recoveredAddress != init.account)
            return (false, "BinanceBridge: not a caller");
        
        tokensReceived[message] = true;

        return (true, "");
    }


    function _hashMessage(bytes32 message)
        private
        pure
        returns(bytes32) 
    {
       return keccak256(abi.encodePacked(bytes("\x19Ethereum Signed Message:\n32"), message));
    }


    function _initialize(
        bytes32 key,
        address tokenA,
        address tokenB,
        address account,
        uint256 amount,
        uint nonce,
        uint chainFrom,
        uint chainTo
    ) private
    {
        _initialization[key][account].tokenA = tokenA;
        _initialization[key][account].tokenB = tokenB;
        _initialization[key][account].account = account;
        _initialization[key][account].amount = amount;
        _initialization[key][account].nonce = nonce;
        _initialization[key][account].blockchainIdFrom = chainFrom;
        _initialization[key][account].blockchainIdTo = chainTo;
        _initialization[key][account].status = Status.INITIALIZED;
    }
}
