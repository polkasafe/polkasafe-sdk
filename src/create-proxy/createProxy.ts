import { ApiPromise } from '@polkadot/api';
import * as BN from 'bn.js'
import { MultiTransferResponse } from './types';

export type Props = {
	recipientAddress: string;
	senderAddress: string;
	api: ApiPromise;
	network: string;
	transferTx: any;
	proxyTx: any;
	multiSigProxyCall: any;
	statusGrabber: any;
	amount:any
}

export const createProxyTransaction = async ({ api, network, recipientAddress, senderAddress, transferTx, multiSigProxyCall, proxyTx, statusGrabber, amount }: Props) => {
	const batchTx = amount?.isZero() ? api.tx.utility.batchAll([multiSigProxyCall]) : api.tx.utility.batchAll([transferTx, multiSigProxyCall]);
	let blockHash = '';
	return new Promise<MultiTransferResponse>((resolve, reject) => {
		batchTx
			.signAndSend(senderAddress, async ({ status, txHash, events }) => {
				if (status.isInvalid) {
					console.log('Transaction invalid');
					statusGrabber('Transaction invalid');
				} else if (status.isReady) {
					console.log('Transaction is ready');
					statusGrabber('Transaction is ready');
				} else if (status.isBroadcast) {
					console.log('Transaction has been broadcasted');
					statusGrabber('Transaction has been broadcasted');
				} else if (status.isInBlock) {
					blockHash = status.asInBlock.toHex();
					console.log('Transaction is in block');
					statusGrabber('Transaction is in block');
				} else if (status.isFinalized) {
					console.log(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`);
					console.log(`transfer tx: https://${network}.subscan.io/extrinsic/${txHash}`);

					const block = await api.rpc.chain.getBlock(blockHash);
					const blockNumber = block.block.header.number.toNumber();

					for (const { event } of events) {
						if (event.method === 'ExtrinsicSuccess') {
							const reservedProxyDeposit = (api.consts.proxy.proxyDepositFactor as unknown as BN)
								.muln(1)
								.iadd(api.consts.proxy.proxyDepositBase as unknown as BN);
							// Create a new transaction data to store in backend
							const newTransactionData = {
								amount_token: reservedProxyDeposit,
								block_number: blockNumber,
								callData: proxyTx.method.toHex(),
								callHash: proxyTx.method.hash.toHex(),
								from: senderAddress,
								network,
								note: 'Creating a New Proxy.',
								to: recipientAddress
							};
							resolve({
								callData: proxyTx.method.toHex(),
								callHash: proxyTx.method.hash.toHex(),
								created_at: new Date(),
								transactionData: newTransactionData,
							});

						} else if (event.method === 'ExtrinsicFailed') {
							console.log('Transaction failed');

							const errorModule = (event.data as any)?.dispatchError?.asModule;
							if (!errorModule) {
								reject({ error: 'Transaction Failed' });
								return;
							}

							const { method, section, docs } = api.registry.findMetaError(errorModule);
							console.log(`Error: ${section}.${method}\n${docs.join(' ')}`);
							reject({ error: `Error: ${section}.${method}\n${docs.join(' ')}` });
						}
					}
				}
			}).catch((error) => {
				console.log(':( transaction failed');
				console.error('ERROR:', error);
				reject({ error });
			});
	});
}