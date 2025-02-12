// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract URLReputation {
    struct URLData {
        string url;
        uint256 trustScore;
        uint256 reportCount;
    }

    mapping(bytes32 => URLData) public urlDatabase;

    function reportURL(string memory _url) external {
        bytes32 hash = keccak256(abi.encodePacked(_url));
        if (urlDatabase[hash].reportCount == 0) {
            urlDatabase[hash] = URLData({
                url: _url,
                trustScore: 0,
                reportCount: 1
            });
        } else {
            urlDatabase[hash].reportCount += 1;
            urlDatabase[hash].trustScore -= 10; // Decrease trust score on report
        }
    }

    function getURLData(string memory _url) external view returns (URLData memory) {
        bytes32 hash = keccak256(abi.encodePacked(_url));
        return urlDatabase[hash];
    }
}