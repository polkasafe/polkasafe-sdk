import * as BN from 'bn.js'
import { EditMultisigResponse, RemoveOldMultisigFromProxyType, TransactionCallBack } from './types';

export const removeOldMultisig = async ({
    otherSignatories,
    newThreshold,
    network,
    api,
    proxyTx,
    weight,
    statusGrabber,
    senderAddress,
    proxyAddress
}: RemoveOldMultisigFromProxyType) => {
    console.log(JSON.stringify({ otherSignatories, newThreshold, network, weight, senderAddress, proxyAddress }))

    let blockHash = '';

    return new Promise<EditMultisigResponse>((resolve, reject) => {

        api.tx.multisig
            .asMulti(newThreshold, otherSignatories, null, proxyTx, weight as any)
            .signAndSend(senderAddress, async ({ status, txHash, events }: TransactionCallBack) => {
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
                            const newTransactionData = {
                                amount_token: new BN(0),
                                block_number: blockNumber,
                                callData: proxyTx.method.toHex(),
                                callHash: proxyTx.method.hash.toHex(),
                                from: senderAddress,
                                network,
                                note: 'Removing Old Multisig from Proxy',
                                to: proxyAddress
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