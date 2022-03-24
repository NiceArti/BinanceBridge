//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


interface IBinanceBridge 
{
    enum Status {NOT_INITIALIZED, INITIALIZED, CLAIMED}
    struct InitAuthorization
    {
        address account;
        address tokenA;
        address tokenB;
        uint256 amount;
        uint256 nonce;
        uint256 blockchainIdFrom;
        uint256 blockchainIdTo;
        uint8 v;
        bytes32 r;
        bytes32 s;
        Status status;
    }


    event SwapInitialized
    (
        address indexed token,
        address indexed account,
        uint256 amount,
        uint256 indexed nonce,
        uint256 chainFrom,
        uint256 chainTo
    );
}