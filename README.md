# Introducing Polkasafe SDK: 
Simplifying Multi-Sig Interactions for Polkadot Network
Polkasafe SDK revolutionizes the way you interact with your multi-signature (multi-sig) setups, offering a seamless experience that simplifies the complexities of working with the PolkadotJS API. Our SDK empowers developers by providing intuitive tools to effortlessly engage with their multi-sig configurations.
With Polkasafe, the process of interacting with your multi-sig becomes incredibly smooth and efficient. Say goodbye to the intricate intricacies that once accompanied PolkadotJS API usage. Our SDK streamlines the entire workflow, enabling you to effortlessly interact with your multi-sig without compromising on functionality or security.
Unlock a new level of convenience and productivity as you navigate the Polkadot network. Polkasafe SDK empowers you to focus on building innovative solutions, abstracting away the underlying intricacies and offering a user-friendly experience that unleashes your development potential.

`Note: Polkasafe SDK currently support Polkadot, Kusama, Rococo and Westend networks`

# What is polkadot.JS?
Polkadot is a versatile blockchain platform that facilitates the secure and seamless transfer of data and assets between different blockchains. The Polkadot.js library is a powerful JavaScript toolkit that simplifies the development process for interacting with the Polkadot network. It provides essential functionalities such as managing accounts, interacting with the network through APIs, and handling data structures efficiently. With Polkadot.js, developers can easily build decentralized applications on the Polkadot platform.
If you want to dive deeper into [Polkadot.js]() and explore its capabilities, I recommend referring to the Polkadot.js Documentation. The documentation provides comprehensive information, examples, and guides to help you understand and leverage the features of Polkadot.js effectively.


## Installation

Setting up the Polkasafe SDK is a straightforward process. Here's a step-by-step guide to installing and using the SDK:


`Install the SDK using npm or yarn:`

```javascript
// npm
npm install polkasafe-sdk

// Yarn
yarn add polkasafe-sdk
```

# Geting started

Creating an Instance
```javascript
import Polkasafe from 'polkasafe-sdk';
const client = new Polkasafe();
```
Setting Signature, Network, and Address
`NOTE: Before using any functions, set the signature, network, and address:`

```javascript
client.setSignature(signature, network, address);
```

Replace signature, network, and address with your specific values.
That's it! You have now set up the Polkasafe SDK and are ready to start using it in your application.

# Usage Guide:
Here are the core functionalities of the Polkasafe SDK for managing multi-signature (multisig) wallets:

- **Connect Address**

- **Add to Address Book**

- **Remove from Address Book**

- **Create Multisig**

- **Get Multisig Data by Address**

- **Get Transactions for Multisig**

- **Get Assets for Multisig Address**

- **Get Multisig Queue**

- **Rename Multisig**

- **Delete Multisig**

- **Create Proxy**

- **Edit Multisig**

- **Transfer Funds**

- **Approve Transaction**

- **Cancel Transaction**

- **Vote on Proposal***


These core functionalities of the Polkasafe SDK provide developers with comprehensive tools for managing multisig wallets, including connecting to addresses, managing the address book, creating and configuring multisig wallets, retrieving wallet information, handling transactions, approving or canceling transactions, and participating in governance-related activities.

# Examples and Tutorials:
**Connect Address:**
The SDK allows developers to connect to a specific address, enabling them to interact with the associated address.

`NOTE: make sure before using any functions, set the signature, network, and address:`
```javascript
import Polkasafe from 'polkasafe-sdk';
const client = new Polkasafe();
client.setSignature(signature, network, address);
// you need to provide you substrate address to connet the polkasafe SDK
const { data, error } = await client.connectAddress(substrateAddress);

if (data){
    // use your data
    console.log(data.multisigAddresses)
}
else if(error){
    console.log(error)
}
```

### Response Data
 ```{
  "address": "14XoE2TiRHxD6nY5LSiSVuMWVXRgNHovkEeKESK8Jducmjh4",
  "email": null,
  "created_at": "2023-04-27T09:02:44.206Z",
  "addressBook": [
    {
      "address": "14XoE2TiRHxD6nY5LSiSVuMWVXRgNHovkEeKESK8Jducmjh4",
      "name": "Tom"
    },
    {
      "address": "14DdRPYpieZZrJPNMpbFttsjxfXMYxjfSwhGa9oPPxptu2nS",
      "name": "Harry"
    }
  ],
  "multisigAddresses": [
    {
      "signatories": [
        "14XoE2TiRHxD6nY5LSiSVuMWVXRgNHovkEeKESK8Jducmjh4",
        "15mRD99sUWKZLoXM8hfakXceWbBqwwsRkayNUQ5Xu1iZ3gh6"
      ],
      "address": "15aVHqroZpeRqCtdmB5TsgBg6d41MreToip4f5gpv6NsZwdk",
      "updated_at": "2023-05-04T15:01:57.179Z",
      "name": "Multi-test",
      "created_at": "2023-05-04T15:01:57.179Z",
      "disabled": false,
      "threshold": 2,
      "network": "polkadot"
    }
  ],
  "multisigSettings": {
    "15LFPgXducxgriD5zWwiqrBeNATYqSonMa9r13EWcWRZtG3H": {
      "deleted": false,
      "name": "Testing Wallet"
    }
  }
} 
```

**Create Multisig:**
Developers can create multisig wallets using the SDK. This functionality enables the setup of wallets with multiple signatories, enhancing the security and decentralization of fund management.

`Note: createMultisig will only create a multisig you need to do a existential deposite to onchain your multisig wallet`
```
// To create a multisig wallet, a minimum of two signatories and a threshold of two are required.
// The signatories can be other user addresses participating in the multisig setup.
// Threshold represents the minimum number of approvals required from the signatories to send a transaction

const signatories = ['...', '...', '...'] // Array of substrate address
const threshold = 2 // number
const multisigName = 'Polka Multisig'

const { data, error } = await client.createMultisig(signatories, threshold, multisigName);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
{
  "address": "5Hq6ZUJQi5PeRNVxXgi8tgjnuLdok2fyCXske1GixE5vZZ4X",
  "created_at": "2023-05-16T12:36:39.240Z",
  "updated_at": "2023-05-16T12:36:39.240Z",
  "disabled": false,
  "name": "Doc Test",
  "signatories": [
    "5CFSybkjCJsddmUoYpCuobzcZntmDqbnNBxknpn8rTRwt7DC",
    "5DZeMuT9k1NhaZHH9unxNakK4sGPpkXaV4x6zKmPuUMyxn83",
    "5EF9om9xiFbRMgjPcrH9fc2G8QUUXF4iibnFoPW2PRTC2shS",
  ],
  "network": "rococo",
  "threshold": 3
}
```

**Add to Address Book:**
Developers can use the SDK to add addresses to the address book associated with a multisig wallet. This functionality simplifies the management of addresses and provides a convenient way to keep track of contacts.

```
const address = '...' // The address you want to add to your address book
const name = 'Mat' // The name you want to assign to the address
const { data, error } = await client.addToAddressBook(address, name);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
// updated addressbook
[
  {
    "address": "5FHLH4HkrsJ6QmNrQBYFkk3b73XhrfBXNSxnQrp2qsoNimak"
    "name": "Tom",
  },
  {
    "address": "5Fe8gVNXoNoB5tbTc2jtTPBi5VAoBaRmMcjqZGnSZSYtVXiL",
    "name": "Harry"
  },
  {
    "address": "5EF9om9xiFbRMgjPcrH9fc2G8QUUXF4iibnFoPW2PRTC2shS",
    "name": "Mat"
  },
]
```

**Remove from Address Book:**
The SDK provides the ability to remove addresses from the address book of a multisig wallet. This feature allows developers to update the address book and remove unnecessary or outdated entries.

```
const address = '...' // The address you want to remove from your address book
const name = '...' // The name of the address
const { data, error } = await client.removeFromAddressBook(address, name);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
// updated addressbook
[
  {
    "address": "5FHLH4HkrsJ6QmNrQBYFkk3b73XhrfBXNSxnQrp2qsoNimak"
    "name": "Tom",
  },
  {
    "address": "5Fe8gVNXoNoB5tbTc2jtTPBi5VAoBaRmMcjqZGnSZSYtVXiL",
    "name": "Harry"
  },
]
```

**Get Multisig Data by Address:**
Using the SDK, developers can retrieve information about a specific multisig wallet by providing its address. This includes details such as the signatories, threshold, and other relevant data associated with the multisig wallet. 

```
const multisigAddress = '...' // multisig address for which you want to fetch details.
const { data, error } = await client.getMultisigDataByAddress(multisigAddress);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
{
  "data": {
    "address": "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD",
    "created_at": "2023-05-16T13:09:25.681Z",
    "updated_at": "2023-05-16T13:09:25.681Z",
    "name": "Untitled Multisig",
    "signatories": [],
    "network": "rococo",
    "threshold": 0
  }
}
```

**Get Transactions for Multisig:**
The SDK allows developers to retrieve a list of transactions pending for approval for a given multisig wallet. This functionality streamlines the transaction management process for multisig wallets.

```
const multisigAddress = '...'; // multisig address for which you want to fetch details.
const limit = 10;
const page = 1;

const { data, error, count } = await client.getTransactionsForMultisig(multisigAddress, limit, page);
if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
[
  {
    "amount_token": 5,
    "amount_usd": 0,
    "block_number": 5367695,
    "callHash": "0x29eec0f6915ec77894ede3910cd1b14b1d363fa42550d6ff3162d35c7816132c",
    "created_at": "2023-05-13T07:02:48.000Z",
    "from": "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD",
    "id": "0x29eec0f6915ec77894ede3910cd1b14b1d363fa42550d6ff3162d35c7816132c",
    "network": "rococo",
    "to": "5GmLM8NQRiL47wQji1GjaAdGDLX63fcdrSUDxk8h2yondLCM",
    "token": "ROC"
  },
  {
    "amount_token": 4,
    "amount_usd": 0,
    "block_number": 5361418,
    "callHash": "0x640a80c293ee4e6f46d5bc4882059207d59757a8798d419f27d1750beeb04c52",
    "created_at": "2023-05-12T20:35:06.000Z",
    "from": "5GmLM8NQRiL47wQji1GjaAdGDLX63fcdrSUDxk8h2yondLCM",
    "id": "0x640a80c293ee4e6f46d5bc4882059207d59757a8798d419f27d1750beeb04c52",
    "network": "rococo",
    "to": "5DZeMuT9k1NhaZHH9unxNakK4sGPpkXaV4x6zKmPuUMyxn83",
    "token": "ROC"
  },
  {
    "amount_token": 0.000033333333,
    "amount_usd": 0,
    "block_number": 5367669,
    "callHash": "0xe01fa7111dc222988582ccd46863aa1ea95a4f03084765bdcd074d8bc5026a6d",
    "created_at": "2023-05-13T07:00:12.000Z",
    "from": "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD",
    "id": "0xe01fa7111dc222988582ccd46863aa1ea95a4f03084765bdcd074d8bc5026a6d",
    "network": "rococo",
    "to": "5D88PPANHvcFqEH94Vo3NL2Gd2EFYJRKW4NNVvRxaY19bu6E",
    "token": "ROC"
  }
]
```

**Get Assets for Multisig Address:**
Developers can utilize the SDK to retrieve the list of assets held by a specific multisig address. This functionality enables convenient access to asset information within the multisig wallet.

```
const multisigAddress = '...'; // multisig address for which you want to fetch details.

const { data, error } = await client.getAssetsForAddress(multisigAddress);
if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
[
  {
    "name": "Rasputin Online Coin",
    "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/2156.png",
    "symbol": "ROC",
    "balance_usd": "",
    "balance_token": "5.000"
  }
]
```

**Get Multisig Queue:**
The SDK provides the ability to retrieve the list of pending transactions in the multisig queue. Developers can utilize this functionality to keep track of pending transactions and their status.

```
const multisigAddress = '...'; // multisig address for which you want to fetch details.
const limit = 10;
const page = 1;

const { data, error } = await client.getMultisigQueue(multisigAddress, 1, 10);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
[
  {
    "callData": "0x1e0000993e3543815c927847276796f0b8e5c537fcd8a1494ea955ff720bb2fff3b64b001e02001b363e3a3e4ccf78f3d7fccb044f583b8fd96e3e5e626f4a4bfee7f44a036ab30000000000",
    "callHash": "0x1e611cfbff5c5258dc5b1052da5ebbd9569e044e3dbf2da1ae89debc40649fb7",
    "status": "Approval",
    "network": "rococo",
    "created_at": "2023-05-12T19:27:00.000Z",
    "threshold": 4,
    "approvals": [
      "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD"
    ],
    "note": "Removing Old Multisig from Proxy"
  }
]
```

**Rename Multisig:**
Using the SDK, developers can rename a multisig wallet by providing its address and a new name. This feature allows for better organization and identification of multisig wallets.

```
const multisigAddress = '...'; // multisig address for which you want to fetch details.
const newName = '...';

const { data, error } = await client.renameMultisig(multisigAddress, newName);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
{
    "message":"success"
}
```

**Delete Multisig:**
The SDK allows developers to delete a multisig wallet by providing its address. This functionality facilitates the removal of unnecessary or no longer needed multisig wallets.

```
const multisigAddress = '...'; // multisig address that you want to delete.

const { data, error } = await client.deleteMultisig(multisigAddress);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

### Response Data
```
{
    "data":"success"
}
```

**Create Proxy:**
Developers can create proxy accounts for multisig wallets using the SDK. This feature enables multisig wallets to interact with other contracts or perform actions on behalf of the linked proxy account.

```
const multisigAddress = '...'; // multisig address for which you want create proxy.

// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}
const { data, error } = await client.createProxy(multisigAddress, injector, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
  "status": 200,
  "message": "Transaction Successful"
}
```

**Edit Multisig:**
The SDK provides functionality to edit a multisig wallet, such as modifying the threshold associated with a proxy account. Developers can utilize this feature to adjust the multisig configuration as needed.

Edit multisig needs two transaction 1st to add a new multisig and 2nd to remove old multisig from proxy

`Note: Linking a proxy with your multisig wallet is necessary to edit the multisig configuration`

```
const multisigAddress = '...'; // multisig address for which you want create proxy.

// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

const newSignatories = ['..', '...'] // Array of new signatories
const newThreshold = 3 // number
// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}
const { data, error } = await client.editMultisig(multisigAddress, newSignatories, newThreshold, injector, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
  "status": 200,
  "addNewMultiResponse": {
    "callData": "0x1e00008d435807bc34a477f6a94bbc191f9650e22ac8a2d601214e48c6c248f5ba42b0001e0100a80b155354f355bf7740c91f85000cd94ad04158c8688868b6cc4bad7e4febce0000000000",
    "callHash": "0xffa103e8a924054f77f1f13e35979c670a0bc2d06d9c19c10be6a7dfee76f075",
    "created_at": "Wed May 17 2023 02:09:15 GMT+0530 (India Standard Time)",
    "transactionData": {
      "amount_token": "BN {negative: 0, words: Array(1), length: 1, red: null}",
      "block_number": 5419057,
      "callData": "0x1e00008d435807bc34a477f6a94bbc191f9650e22ac8a2d601214e48c6c248f5ba42b0001e0100a80b155354f355bf7740c91f85000cd94ad04158c8688868b6cc4bad7e4febce0000000000",
      "callHash": "0xffa103e8a924054f77f1f13e35979c670a0bc2d06d9c19c10be6a7dfee76f075",
      "from": "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD",
      "network": "rococo",
      "note": "Adding New Signatories to Multisig",
      "to": "5FFvcaTdeELPWNZ5z8JVxZBZS6phbMW61KMoHo4Ci2cyrYX6"
    }
  },
  "removeOldMultiResponse": {
    "callData": "0x1e00008d435807bc34a477f6a94bbc191f9650e22ac8a2d601214e48c6c248f5ba42b0001e0100a80b155354f355bf7740c91f85000cd94ad04158c8688868b6cc4bad7e4febce0000000000",
    "callHash": "0xffa103e8a924054f77f1f13e35979c670a0bc2d06d9c19c10be6a7dfee76f075",
    "created_at": "Wed May 17 2023 02:09:15 GMT+0530 (India Standard Time)",
    "transactionData": {
      "amount_token": "BN {negative: 0, words: Array(1), length: 1, red: null}",
      "block_number": 5419057,
      "callData": "0x1e00008d435807bc34a477f6a94bbc191f9650e22ac8a2d601214e48c6c248f5ba42b0001e0100a80b155354f355bf7740c91f85000cd94ad04158c8688868b6cc4bad7e4febce0000000000",
      "callHash": "0xffa103e8a924054f77f1f13e35979c670a0bc2d06d9c19c10be6a7dfee76f075",
      "from": "5FbW5hCeZWgjfFXZNofSMkXMduS2fzFnfjuq59KmkYt6bDvD",
      "network": "rococo",
      "note": "Adding New Signatories to Multisig",
      "to": "5FFvcaTdeELPWNZ5z8JVxZBZS6phbMW61KMoHo4Ci2cyrYX6"
    }
  }
}
```

**Transfer Funds:**
Using the SDK, developers can initiate transfers of funds from a multisig wallet. This functionality enables secure and controlled fund management within the multisig setup.

```
const recipientAddress = '...'; // multisig address for which you want create proxy.
const amount = 10 // number
const address = 'sender address' // should be your address
// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

const multisig; // Your multisig object with address, proxy, signatories, threshold data
const isProxy = false // boolean require to check trasaction is from proxy wallet or multisig wallet
// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.transferFunds(recipientAddress, amount, address, injected, multisig, isProxy, setLoadingMessages);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
  "status": 200,
  "message": "Transaction Successful",
  "data": {
    "amount": "01d1a94a2000",
    "block_number": 5419242,
    "callData": "0x1e00008d435807bc34a477f6a94bbc191f9650e22ac8a2d601214e48c6c248f5ba42b0000403008e563f5e1d5dd4f7a5b0bc4482bca973d44d030fced751abf1f40cf6d8d674270b00204aa9d101",
    "callHash": "0x2721fcbda479c2e0176494cd910a0de15986fb1bc9fddae11d0edace03f78403",
    "from": "5FFvcaTdeELPWNZ5z8JVxZBZS6phbMW61KMoHo4Ci2cyrYX6",
    "network": "rococo",
    "note": "",
    "to": "5FHLH4HkrsJ6QmNrQBYFkk3b73XhrfBXNSxnQrp2qsoNimak"
  }
}
```

**Approve Transaction:**
The SDK supports the approval process for multisig transactions. Developers can use the SDK to initiate the approval of a pending transaction by other signatories associated with the multisig wallet.

```
const multisigAddress = '...'; 
const callHash = '...' // trasaction callHash
const callData = '...' // trasaction callData

// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

const requestType = 'proxy' // requestType can be 3 types 'proxy'| 'wallet' | 'edit_proxy'

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.approveTransaction(multisigAddress, callHash, callData, injector, requestType, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
  "status": 200,
  "message": "Transaction Successful"
}
```

**Cancel Transaction:**
Developers can utilize the SDK to cancel a pending transaction within a multisig wallet. This feature provides flexibility and control over the transaction lifecycle.

`Note: Only the creator of a transaction can cancel it.`
```
const multisigAddress = '...'; 
const callHash = '...' // trasaction callHash

// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.cancelTransaction(multisigAddress, callHash, injector, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
    "status":200,
    "message":"Transaction Cancel Successful"
}
```


**Vote on Proposal:**
The SDK allows developers to vote on specific proposals within the governance framework of the Polkadot network using the multisig wallet. This functionality enables active participation in the decision-making process.

`Note: only working for ReferendumV1 and ReferendumV2`
```
const multisigAddress = '...'; 
const proposalIndex = 101 // number
const vote = 'Aye' 
// The injector is a crucial in the Polkadot.js API that enables secure interactions with the Polkadot network. 
// When using the setSigner function, the injector associates a signer with the API instance.
// Ensuring that transactions are properly signed and verified for secure and authenticated interactions.
const injector; 

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.voteOnProposal(multisigAddress, injector, proposalIndex:, vote, statusGrabber, proposalType);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```
### Response Data
```
{
    "status":200,
    "message":"Success"
}
```