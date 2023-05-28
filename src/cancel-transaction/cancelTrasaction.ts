import { CancelTransactionResponse } from "./types";

type Props = {
	api: any,
	senderAddress: string,
	injector: any,
	network: string,
	multisig: any,
	otherSignatories: Array<string>,
	when: any,
	callHash: any,
	statusGrabber: any
}

export const cancelTransactionForWallet = async ({
	api,
	senderAddress,
	injector,
	network,
	multisig,
	otherSignatories,
	when,
	callHash,
	statusGrabber
}: Props): Promise<any> => {
	try {
		api.setSigner(injector.signer);
	} catch (error) {
		throw new Error('Invalid injector, please use a valid injector');
	}
	return new Promise<CancelTransactionResponse>((resolve, reject) => {
		api.tx.multisig
			.cancelAsMulti(multisig.threshold, otherSignatories, when, callHash)
			.signAndSend(senderAddress, async ({ status, txHash, events }: { status: any, txHash: any, events: any }) => {
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
					console.log('Transaction is in block');
					statusGrabber('Transaction is in block');
				} else if (status.isFinalized) {
					console.log(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`);
					console.log(`cancelAsMulti tx: https://${network}.subscan.io/extrinsic/${txHash}`);

					for (const { event } of events) {
						if (event.method === 'ExtrinsicSuccess') {
							resolve({ message: 'Transaction cancel successful' });
						} else if (event.method === 'ExtrinsicFailed') {
							console.log('Transaction failed');
							const errorModule = (event.data as any)?.dispatchError?.asModule;
							if (!errorModule) {
								reject({ 'Transaction Failed': errorModule });
								return;
							}

							const { method, section, docs } = api.registry.findMetaError(errorModule);
							console.log(`Error: ${section}.${method}\n${docs.join(' ')}`);
							reject(`Error: ${section}.${method}\n${docs.join(' ')}`);
						}
					}
				}
			}).catch((error: any) => {
				console.log(error);
				reject(error);
			});
	});
}