import {SubmittableExtrinsic} from '@polkadot/api/types';
import {calcWeight} from '../utils/calcWeight';
import {BN} from 'bn.js';
import getSubstrateAddress from 'src/utils/getSubstrateAddress';
import decodeCallData from 'src/utils/decodeCallData';
import parseDecodedValue from 'src/utils/parseDecodedValue';
import { BN as BNType } from '@polkadot/util';

type Props = {
    api: any;
    injector: any;
    network: string;
    multisig: any;
    tx: SubmittableExtrinsic<'promise'>;
    statusGrabber: any;
    senderAddress: string;
    isProxy: boolean;
    tip?: BNType
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
    tip
}: Props): Promise<any> => {
    try {
        api.setSigner(injector.signer);
    } catch (error) {
        throw new Error('Invalid injector, please use a valid injector');
    }
    const call = tx;
    const otherSignatories = multisig.signatories
        .sort()
        .filter(
            (signatory: string) =>
                getSubstrateAddress(signatory) !==
                getSubstrateAddress(senderAddress)
        );
    const TIME_POINT = null;

    const callData = api.createType('Call', call.method.toHex());

    const {data, error} = decodeCallData(call.method.toHex(), api);
    if (error || !data) return {error: error};
    const decodedCallData = data.extrinsicCall?.toJSON();
    
    const amount =//@ts-ignore
        decodedCallData?.args?.value ||//@ts-ignore
        decodedCallData?.args?.call?.args?.value ||//@ts-ignore
        decodedCallData?.args?.calls?.map((item: any) => item?.args?.value) ||//@ts-ignore
        decodedCallData?.args?.call?.args?.calls?.map(
            (item: any) => item?.args?.value
        ) ||
        '0';
    const token = parseDecodedValue({
        network,
        value: amount,
        withUnit: false,
    });

    const sendingAmount = Number(token);
    if (!isNaN(sendingAmount)) {
        const res = await api.query?.system?.account(multisig.address);
        const currentBalance = res?.data?.free?.toString() || '0';
        if (Number(currentBalance) < sendingAmount) {
            return {error: 'Balance is low to make the transaction'};
        }
    }
    
    const recipientAddress =//@ts-ignore
        decodedCallData?.args?.dest?.id ||//@ts-ignore
        decodedCallData?.args?.call?.args?.dest?.id ||//@ts-ignore
        decodedCallData?.args?.calls?.map(
            (item: any) => item?.args?.dest?.id
        ) ||//@ts-ignore
        decodedCallData?.args?.call?.args?.calls?.map(
            (item: any) => item?.args?.dest?.id
        );

    let {weight} = await calcWeight(callData, api);
    if (isProxy && multisig.proxy) {
        weight = 0 as any;
    }
    let blockHash = '';
    return new Promise<any>((resolve, reject) => {
        api.tx.multisig[isProxy ? 'asMulti' : 'approveAsMulti'](
            multisig.threshold,
            otherSignatories,
            TIME_POINT,
            isProxy ? tx : call.method.hash,
            weight
        )
            .signAndSend(
                senderAddress,
                { tip },
                async ({
                    status,
                    txHash,
                    events,
                }: {
                    status: any;
                    txHash: any;
                    events: any;
                }) => {
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
                        console.log(
                            `Transaction has been included in blockHash ${status.asFinalized.toHex()}`
                        );
                        console.log(
                            `transfer tx: https://${network}.subscan.io/extrinsic/${txHash}`
                        );
                        const block = await api.rpc.chain.getBlock(blockHash);
                        const blockNumber =
                            block.block.header.number.toNumber();
                        for (const {event} of events) {
                            if (event.method === 'ExtrinsicSuccess') {
                                resolve({
                                    message: 'success',
                                    data: {
                                        amount: sendingAmount
                                            ? new BN(sendingAmount)
                                            : new BN(0),
                                        block_number: blockNumber,
                                        callData: isProxy
                                            ? tx.method.toHex()
                                            : call.method.toHex(),
                                        callHash: isProxy
                                            ? tx.method.hash.toHex()
                                            : call.method.hash.toHex(),
                                        from: isProxy
                                            ? multisig.proxy
                                            : multisig.address,
                                        network,
                                        note: 'A custom transaction',
                                        to: recipientAddress ? recipientAddress : '',
                                    },
                                });
                            } else if (event.method === 'ExtrinsicFailed') {
                                console.log('Transaction failed');

                                const errorModule = (event.data as any)
                                    ?.dispatchError?.asModule;
                                if (!errorModule) {
                                    reject({error: 'Transaction Failed'});
                                    return;
                                }
                                const {method, section, docs} =
                                    api.registry.findMetaError(errorModule);
                                console.log(
                                    `Error: ${section}.${method}\n${docs.join(
                                        ' '
                                    )}`
                                );
                                reject({
                                    error: `${section}.${method} -- ${docs.join(
                                        ' '
                                    )}`,
                                });
                            }
                        }
                    }
                }
            )
            .catch((error: any) => {
                console.log(':( transaction failed');
                console.error('ERROR:', error);
                reject({error});
            });
    });
};
