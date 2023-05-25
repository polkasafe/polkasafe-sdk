import { ApiPromise } from "@polkadot/api";
import { BN } from "bn.js";
import { ApproveTransactionResponse } from "./types";

type Props = {
    api: ApiPromise,
    senderAddress: string,
    injector: any,
    network: string,
    lastApproval: boolean,
    multisig: any,
    otherSignatories: Array<string>,
    when: any,
    callHash: any,
    callData: any,
    weight: any,
    afterSuccessFunction: any,
    statusGrabber: any,
    recipientAddress: string,
    amount: number,
    callDataString: string,
    requestType: 'wallet' | 'proxy' | 'edit_proxy'
}

export const approveTransactionForWallet = async ({
    api,
    senderAddress,
    injector,
    network,
    lastApproval,
    multisig,
    otherSignatories,
    when,
    callHash,
    weight,
    afterSuccessFunction,
    statusGrabber,
    recipientAddress,
    amount,
    callDataString,
    requestType
}: Props): Promise<any> => {
    try {
        api.setSigner(injector.signer);
    } catch (error) {
        throw new Error('Invalid injector, please use a valid injector');
    }
    const API_CALL = lastApproval ? api.tx.multisig.asMulti : api.tx.multisig.approveAsMulti
    let blockHash = '';
    return new Promise<ApproveTransactionResponse>((resolve, reject) => {
        API_CALL(multisig.threshold, otherSignatories, when, lastApproval ? callDataString : callHash, weight)
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
                    console.log(`approveAsMulti tx: https://${network}.subscan.io/extrinsic/${txHash}`);

                    const block = await api.rpc.chain.getBlock(blockHash);
                    const blockNumber = block.block.header.number.toNumber();
                    for (const { event } of events) {
                        if (event.method === 'ExtrinsicSuccess') {
                            if (lastApproval) {
                                const data = await afterSuccessFunction();
                                console.log(data)
                            }
                            resolve(lastApproval ? {
                                message: 'Transaction Successful.', data: {
                                    amount: amount || new BN(0),
                                    block_number: blockNumber,
                                    callData: callDataString,
                                    callHash: txHash.toHex(),
                                    from: multisig.address,
                                    network,
                                    note: requestType === 'proxy' ? 'Proxy Created' : requestType === 'edit_proxy' ? 'Proxy Updated' : '',
                                    to: recipientAddress || ''
                                }
                            } : { message: 'Transaction Successful.' });
                        } else if (event.method === 'ExtrinsicFailed') {
                            console.log('Transaction failed');
                            const errorModule = (event.data as any)?.dispatchError?.asModule;
                            const { method, section, docs } = api.registry.findMetaError(errorModule);
                            console.log(`Error: ${section}.${method}\n${docs.join(' ')}`);
                            reject(`Error: ${section}.${method}\n${docs.join(' ')}`);
                        }
                    }
                }
            }).catch((error: any) => {
                console.log(error);
                reject(error);
            })
    });
}