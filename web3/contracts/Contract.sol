// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

error CrowdFunding__CampaignDoesNotExist();
error InputsCantBeNull();
error DeadlineShouldBeInFuture();
error DeadlineReached(uint campaignDeadline, uint timeRequested);

contract Crowdfunding {
    struct Campaign {
        address owner;
        string name;
        string title;
        string category;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 amountCollectedNotRefunded;
        string image;
        address[] donators;
        uint256[] donations;
        string[] donateNames; // Array baru untuk menyimpan nama donasi
        string[] donateMessages; // Array baru untuk menyimpan pesan donasi

    }

    event Action(
        uint256 id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );


    address public manager;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => uint256[]) public ownerCampaigns;
    mapping(uint256 => mapping(address => bool)) public refundedDonations;
    mapping(uint256 => bool) public fundsWithdrawn;
    mapping(uint256 => mapping(address => bool)) public fundsWithdrawnByDonator;




    uint256 public numberOfCampaigns = 0;

        modifier onlyManager() {
        require(msg.sender == manager, "not owner");
        _;
    }

    modifier authorisedPerson(uint _id) {
        require(msg.sender == campaigns[_id].owner, "Not Authorised");
        _;
    }

    function createCampaign(address _owner, string memory _name, string memory _title, string memory _category, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
    // Periksa apakah pemilik sudah memiliki campaign yang sedang berjalan
        uint256[] memory ownerCampaignIds = ownerCampaigns[_owner];
        for (uint256 i = 0; i < ownerCampaignIds.length; i++) {
            uint256 campaignId = ownerCampaignIds[i];
            Campaign storage existingCampaign = campaigns[campaignId];
        if (existingCampaign.deadline > block.timestamp && existingCampaign.amountCollected < existingCampaign.target) {
            revert("You already have an active campaign");
        }
        }

        // Lanjutkan dengan pembuatan campaign baru
        Campaign storage newCampaign = campaigns[numberOfCampaigns];

        require(newCampaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        newCampaign.owner = _owner;
        newCampaign.name = _name;
        newCampaign.category = _category;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.amountCollected = 0;
        newCampaign.image = _image;

        ownerCampaigns[_owner].push(numberOfCampaigns); // Tambahkan campaign baru ke daftar campaign pemilik

        numberOfCampaigns++;

    return numberOfCampaigns - 1;
}


    function updateCampaign(
        uint256 _id,
        string memory _name,
        string memory _title,
        string memory _category,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public authorisedPerson(_id) returns (bool) {
        Campaign storage campaign = campaigns[_id];

        // make sure the inputs can't be null
        if (
            (bytes(_title).length <= 0 &&
                bytes(_description).length <= 0 &&
                _target <= 0 &&
                _deadline <= 0 &&
                bytes(_image).length <= 0)
        ) {
            revert InputsCantBeNull();
        }

        if (block.timestamp > _deadline) {
            revert DeadlineShouldBeInFuture();
        }

        require(campaign.owner > address(0), "No campaign exist with this ID");

        campaign.name = _name;
        campaign.title = _title;
        campaign.category = _category;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;

        emit Action(_id, "Campaign updated", msg.sender, block.timestamp);

        return true;
    }

    function donateToCampaign(uint256 _id, string memory _donateName, string memory _donateMessage) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.donateNames.push(_donateName);
        campaign.donateMessages.push(_donateMessage);

        campaign.amountCollected += amount;
        campaign.amountCollectedNotRefunded += amount; // Update amountCollectedNotRefunded
    }


    function deleteCampaign( uint256 _id) public authorisedPerson(_id) returns (bool) {
        if (campaigns[_id].owner == address(0)) {
            revert CrowdFunding__CampaignDoesNotExist();
        }
        delete campaigns[_id];

        numberOfCampaigns = numberOfCampaigns - 1;

        emit Action(_id, "Campaign Deleted", msg.sender, block.timestamp);

        return (true);
    }

    function getContractBalance() public view returns (uint256) {
    return address(this).balance;
    }


    event RefundAttempt(address indexed donator, uint256 amount, bool success);

    function refundDonation(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner != address(0), "Campaign does not exist");
        require(!fundsWithdrawnByDonator[_id][msg.sender], "You have already withdrawn funds for this campaign");

        uint256 donationIndex = findDonationIndex(_id, msg.sender);
        require(donationIndex != type(uint256).max, "You have not donated to this campaign");

        require(!refundedDonations[_id][msg.sender], "You have already refunded your donation");

        uint256 donationAmount = campaign.donations[donationIndex];

        campaign.amountCollected -= donationAmount;
        campaign.amountCollectedNotRefunded -= donationAmount;
        refundedDonations[_id][msg.sender] = true;

        (bool success, ) = msg.sender.call{value: donationAmount}("");
        require(success, "Refund failed");
    }


    function findDonationIndex(uint256 _id, address _donor) private view returns (uint256) {
        Campaign storage campaign = campaigns[_id];
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            if (campaign.donators[i] == _donor) {
                return i;
            }
        }
        revert("You have not donated to this campaign");
    }

    function withdrawFunds(uint256 _id) public authorisedPerson(_id) {
        Campaign storage campaign = campaigns[_id];

        uint256 amountToWithdraw = campaign.amountCollectedNotRefunded;
        campaign.amountCollectedNotRefunded = 0;

        (bool success, ) = campaign.owner.call{value: amountToWithdraw}("");
        require(success, "Withdrawal failed");

        for (uint256 i = 0; i < campaign.donators.length; i++) {
            fundsWithdrawnByDonator[_id][campaign.donators[i]] = true;
        }
    }


    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory, string[] memory, string[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations, campaigns[_id].donateNames, campaigns[_id].donateMessages);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}