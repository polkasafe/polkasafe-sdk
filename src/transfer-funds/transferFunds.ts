import { SubmittableExtrinsic } from "@polkadot/api/types";
import { calcWeight } from "../uitils/calcWeight";
import { TransferFundsResponse } from "./types";

type Props = {
    api: any,
    recipientAddress: string,
    amount: number,
    senderAddress: string,
    injector: any,
    network: string
    multisig: any,
    isProxy: boolean,
    statusGrabber: any
}

export const transferFundsFromWallet = async ({
    api,
    recipientAddress,
    amount,
    senderAddress,
    injector,
    network,
    multisig,
    isProxy,
    statusGrabber
}: Props): Promise<any> => {
    try {
        api.setSigner(injector.signer);
    } catch (error) {
        throw new Error('Invalid injector, please use a valid injector');
    }
    let tx: SubmittableExtrinsic<'promise'>;
    const call = api.tx.balances.transferKeepAlive(recipientAddress, amount)

    if (isProxy && multisig.proxy) {
        tx = api.tx.proxy.proxy(multisig.proxy, null, call);
    }
    const otherSignatories = multisig.signatories.sort().filter((signatory: string) => signatory !== senderAddress);

    const TIME_POINT = null;

    const callData = api.createType('Call', call.method.toHex());
    let { weight } = await calcWeight(callData, api);
    if (isProxy && multisig.proxy) {
        weight = 0 as any
    }
    let blockHash = '';
    return new Promise<TransferFundsResponse>((resolve, reject) => {
        api.tx.multisig[isProxy ? 'asMulti' : 'approveAsMulti'](multisig.threshold, otherSignatories, TIME_POINT, isProxy ? tx : call.method.hash, weight)
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
                            resolve({
                                message: 'success', data: {
                                    amount,
                                    block_number: blockNumber,
                                    callData: isProxy ? tx.method.toHex() : call.method.toHex(),
                                    callHash: isProxy ? tx.method.hash.toHex() : call.method.hash.toHex(),
                                    from: isProxy ? multisig.proxy : multisig.address,
                                    network,
                                    note: '',
                                    to: recipientAddress
                                }
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
                            reject({ error: `${section}.${method} -- ${docs.join(' ')}` });
                        }
                    }
                }
            }).catch((error: any) => {
                console.log(':( transaction failed');
                console.error('ERROR:', error);
                reject({ error });
            });
    });
}