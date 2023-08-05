# Introducing Polkasafe SDK:

Simplifying Multi-Sig Interactions for Polkadot Network
Polkasafe SDK revolutionizes the way you interact with your multi-signature (multi-sig) setups, offering a seamless experience that simplifies the complexities of working with the PolkadotJS API. Our SDK empowers developers by providing intuitive tools to effortlessly engage with their multi-sig configurations.
With Polkasafe, the process of interacting with your multi-sig becomes incredibly smooth and efficient. Say goodbye to the intricate intricacies that once accompanied PolkadotJS API usage. Our SDK streamlines the entire workflow, enabling you to effortlessly interact with your multi-sig without compromising on functionality or security.
Unlock a new level of convenience and productivity as you navigate the Polkadot network. Polkasafe SDK empowers you to focus on building innovative solutions, abstracting away the underlying intricacies and offering a user-friendly experience that unleashes your development potential.

`Note: Polkasafe SDK currently support Polkadot, Kusama, Aster, Rococo and Westend networks`

## Installation

Setting up the Polkasafe SDK is a straightforward process. Here's a step-by-step guide to installing and using the SDK:


`Install the SDK using npm or yarn:`

```javascript
// npm
npm install polkasafe
```

# Geting started

Setting up the Polkasafe SDK is a straightforward process.
Here's a step-by-step guide to installing and using the SDK:

Creating an Instance
```javascript
import Polkasafe from 'polkasafe-sdk';
const client = new Polkasafe();
```
`NOTE: Connecting with polkasafe is essential. Before using any functions, use connect function to set the network, address, and injector.`

```javascript
/**
 * @param {string} network
 * @param {string} address
 * @param {Injected} injector
 */
// injector: Simplify transaction signing and submission using the injector parameter
client.connect(network, address, injector)
```

Replace network, address, and injector with your specific values. That's it! You have now set up the Polkasafe SDK and you are ready to start using it in your application.

# Usage Guide:
Here are the core functionalities of the Polkasafe SDK for managing multi-signature (multisig) wallets:

- **Connect Address**
```
import Polkasafe from 'polkasafe';
const client = new Polkasafe();
client.connect(network, address, injector);

const substrateAddress = '....' // You need to provide your substrate address to connect the polkasafe SDK

const { data, error } = await client.connectAddress(substrateAddress);

if (data){
    // Use your data
    console.log(data.multisigAddresses)
}
else if(error){
    console.log(error)
}
```

- **Add to Address Book**
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

- **Remove from Address Book**

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

- **Create Multisig**
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

- **Get Multisig Data by Address**
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

- **Get Transactions for Multisig**
```
const multisigAddress = '...'; 
const proposalIndex = 101 // number
const vote = { Standard: { balance: lockedBalance, vote: { aye, conviction } }

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.voteOnProposal(multisigAddress, proposalIndex, vote, statusGrabber, proposalType);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Get Assets for Multisig Address**
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

- **Get Multisig Queue**
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

- **Rename Multisig**
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

- **Delete Multisig**
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

- **Create Proxy**
```
const multisigAddress = '...'; // multisig address for which you want create proxy.

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}
const { data, error } = await client.createProxy(multisigAddress, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Edit Multisig**
```
const multisigAddress = '...'; // multisig address for which you want create proxy.

const newSignatories = ['..', '...'] // Array of new signatories
const newThreshold = 3 // number
// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}
const { data, error } = await client.editMultisig(multisigAddress, newSignatories, newThreshold, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Transfer Funds**
```
const recipientAddress = '...'; // multisig address for which you want create proxy.
const amount = 10 // number
const address = 'sender address' // should be your address

const multisig; // Your multisig object with address, proxy, signatories, threshold data
const isProxy = false // boolean require to check trasaction is from proxy wallet or multisig wallet
// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.transferFunds(recipientAddress, amount, address, multisig, isProxy, setLoadingMessages);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Approve Transaction**
```
const multisigAddress = '...'; 
const callHash = '...' // trasaction callHash
const callData = '...' // trasaction callData

const requestType = 'proxy' // requestType can be 3 types 'proxy'| 'wallet' | 'edit_proxy'

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.approveTransaction(multisigAddress, callHash, callData, requestType, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Cancel Transaction**
```
const multisigAddress = '...'; 
const callHash = '...' // trasaction callHash

// A function that takes a single parameter.
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}

const { data, error } = await client.cancelTransaction(multisigAddress, callHash, eventGrabber);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```

- **Custom Transaction**
```
const multisigAddress = '...'; // user's multisig address.
const tx = api.tx.system.remark('custom trasaction as multi'); // Should be SubmittableExtrinsic type
const eventGrabber = (message)=>{
    // use message to track transaction progress and events using eventGrabber for real-time visibility
    console.log(message)
}
const isProxy = false // boolean required to check trasaction from a proxy wallet or multisig wallet
const tip = 10000000000 // Optional param tip makes transaction fast: BN value 
const { data, error } = await client.customTransactionAsMulti(multisigAddress, tx, eventGrabber, isProxy, tip);

if (data){
    console.log(data)
    // use your data
}
else if(error){
    console.log(error)
}
```



These are some core functionalities, feel free to read more about [Polkasafe SDK](https://polkasafe.gitbook.io/polkasafe-sdk).
