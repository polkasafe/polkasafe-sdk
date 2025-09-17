import {SubmittableExtrinsic} from '@polkadot/api/types';
import {BN as BNType} from '@polkadot/util';
import getEncodedAddress from '../utils/getEncodedAddress';
import { ApiPromise } from '@polkadot/api';

type Props = {
    api: any;
    injector: any;
    network: string;
    multisig: any;
    tx: SubmittableExtrinsic<'promise'>;
    statusGrabber: any;
    senderAddress: string;
    isProxy: boolean;
    tip?: BNType;
};

export const customTransactionByMulti = async ({
    api,
    injector,
    network,
    tx,
    multisig,
    statusGrabber,
    senderAddress,
    isProxy,
    tip,
}: Props): Promise<any> => {
    // Validate inputs
    if (!api || !injector || !network || !tx || !multisig || !senderAddress) {
        throw new Error('Missing required parameters');
    }

    if (!multisig.signatories || !Array.isArray(multisig.signatories)) {
        throw new Error('Invalid multisig: signatories must be an array');
    }

    if (!multisig.threshold || multisig.threshold < 1) {
        throw new Error('Invalid multisig: threshold must be at least 1');
    }

    // Validate that the transaction is properly formatted
    try {
        // Try to get the human-readable version to validate the transaction
        const txHuman = tx.toHuman() as any;
        console.log('Transaction details:', txHuman);
        
        // Check if this is a balances.transferKeepAlive transaction
        if (txHuman?.method?.section === 'balances' && txHuman?.method?.method === 'transferKeepAlive') {
            const dest = txHuman?.args?.dest;
            if (!dest || !dest.Id) {
            console.log('Invalid destination address in transferKeepAlive transaction');            }
            console.log('Destination address:', dest.Id);
        }
    } catch (error) {
        console.log('Error in customTransactionByMulti:', error);
    }

    try {
        api.setSigner(injector.signer);
    } catch (error) {
        console.log('Error in customTransactionByMulti:', error);
    }

    // Get other signatories (excluding the sender)
    const otherSignatories = multisig.signatories
        .sort()
        .filter((signatory: string) => {
            const substrateSignatory = getEncodedAddress(signatory, network);
            const substrateSender = getEncodedAddress(senderAddress, network);
            return substrateSignatory && substrateSender && substrateSignatory !== substrateSender;
        });

    // Check if this transaction already exists in multisig
    const multisigAddress = isProxy ? multisig.proxy : multisig.address;
    const callHash = tx.method.hash.toHex();
    const info = await api.query.multisig.multisigs(multisigAddress, callHash);
    
    let timePoint = null;
    if (info.isSome) {
        timePoint = info.unwrap().when;
    }

    // Get payment info for weight calculation
    const paymentInfo = await tx.paymentInfo(senderAddress);
    let weight = paymentInfo.weight;

    // Wrap transaction in proxy if needed
    if (isProxy && multisig.proxy) {
        weight = 0 as any;
        tx = api.tx.proxy.proxy(multisig.proxy, null, tx);
    }

    console.log('-------------------This is from the custom transaction-------------------')
    
    console.log(multisig.threshold, otherSignatories.map((signatory: string) => getEncodedAddress(signatory, network)), timePoint, tx.toHuman(), weight);

    return new Promise<any>((resolve, reject) => {
        (api as ApiPromise).tx.multisig.asMulti(
            Number(multisig.threshold),
            otherSignatories.map((signatory: string) => getEncodedAddress(signatory, network)),
            timePoint,
            tx,
            weight
        )
        .signAndSend(
            senderAddress,
            tip ? { tip } : {},
            async ({ status, txHash, events }) => {
                try {
                    if (status.isInvalid) {
                        statusGrabber('Transaction invalid');
                    } else if (status.isReady) {
                        statusGrabber('Transaction is ready');
                    } else if (status.isBroadcast) {
                        statusGrabber('Transaction has been broadcasted');
                    } else if (status.isInBlock) {
                        statusGrabber('Transaction is in block');
                    } else if (status.isFinalized) {
                        statusGrabber('Transaction finalized');
                        
                        const blockHash = status.asFinalized.toHex();
                        const block = await api.rpc.chain.getBlock(blockHash);
                        const blockNumber = block.block.header.number.toNumber();

                        // Process events
                        for (const { event } of events) {
                            if (event.method === 'ExtrinsicSuccess') {
                                resolve({
                                    message: 'success',
                                    data: {
                                        amount: '0',
                                        block_number: blockNumber,
                                        callData: tx.method.toHex(),
                                        callHash: callHash,
                                        from: multisigAddress,
                                        network,
                                        note: 'A custom transaction',
                                        to: '',
                                    },
                                });
                                return;
                            } else if (event.method === 'ExtrinsicFailed') {
                                const errorModule = (event.data as any)?.dispatchError?.asModule;
                                if (!errorModule) {
                                    reject({ error: 'Transaction Failed' });
                                    return;
                                }
                                
                                const { method, section, docs } = api.registry.findMetaError(errorModule);
                                const errorMessage = `${section}.${method}${docs.length ? ` -- ${docs.join(' ')}` : ''}`;
                                reject({ error: errorMessage });
                                return;
                            }
                        }
                    }
                } catch (error) {
                    reject({ error: error.message || 'Unknown error occurred' });
                }
            }
        )
        .catch((error: any) => {
            reject({ error: error.message || 'Transaction failed' });
        });
    });
};
