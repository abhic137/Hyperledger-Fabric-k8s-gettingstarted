const { getCCP } = require("./buildCCP");
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");
const walletPath = path.join(__dirname, "wallet");
const {buildWallet} =require('./AppUtils')


/*
{
    org:Org1MSP,
    channelName:"mychannel",
    chaincodeName:"basic",
    userId:"aditya"
    data:{
        id:"asset1",
        color:"red",
        size:5,
        appraisedValue:200,
        owner:"TOM"
    }
}

*/
exports.createAsset = async (request) => {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);

    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: request.userId,
        discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(request.channelName);

    // Get the contract from the network.
    const contract = network.getContract(request.chaincodeName);
    let data=request.data;
    let result = await contract.submitTransaction('CreateAsset',data.ID,data.color,data.size,data.owner,data.appraisedValue);
    return (result);
}


/*
{
    org:Org1MSP,
    channelName:"mychannel",
    chaincodeName:"basic",
    userId:"aditya"
    data:{
        id:"asset1",
        color:"red",
        size:5,
        appraisedValue:200,
        owner:"TOM"
    }
}

*/
exports.updateAsset=async (request) => {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);

    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: request.userId,
        discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(request.channelName);

    // Get the contract from the network.
    const contract = network.getContract(request.chaincodeName);
    let data=request.data;
    let result = await contract.submitTransaction('UpdateAsset',data.ID,data.color,data.size,data.owner,data.appraisedValue);
    return (result);
}



/*
{
    org:Org1MSP,
    channelName:"mychannel",
    chaincodeName:"basic",
    userId:"aditya"
    data:{
        id:"asset1",
        color:"red",
        size:5,
        appraisedValue:200,
        owner:"TOM"
    }
}
*/
exports.deleteAsset=async (request) => {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);

    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: request.userId,
        discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(request.channelName);

    // Get the contract from the network.
    const contract = network.getContract(request.chaincodeName);
    let data=request.data;
    let result = await contract.submitTransaction('DeleteAsset',data.id);
    return (result);
}


/*
{
    org:Org1MSP,
    channelName:"mychannel",
    chaincodeName:"basic",
    userId:"aditya"
    data:{
        id:"asset1",
        newOwner:"TOM"
    }
}
*/
exports.TransferAsset=async (request) => {
    let org = request.org;
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);

    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: request.userId,
        discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(request.channelName);

    // Get the contract from the network.
    const contract = network.getContract(request.chaincodeName);
    let data=request.data;
    let result = await contract.submitTransaction('TransferAsset',data.id,data.newOwner);
    return JSON.parse(result);
}