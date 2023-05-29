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
