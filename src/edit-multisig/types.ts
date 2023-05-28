import { ApiPromise } from "@polkadot/api"
import * as BN from 'bn.js'

export type EditProxyPayloadType = {
    multisigAddress: string,
    multisigName:string,
    oldSignatories: Array<string>,
    oldThreshold: number,
    newSignatories: Array<string>,
    newThreshold: number,
    proxyAddress: string,
    injector: any,
    statusGrabber: any,
}

export type AddNewMultisigToProxyType = {
    api: ApiPromise,
    otherSignatories: Array<string>,
    oldThreshold: number,
    network: string,
    proxyTx: any,
    weight: any,
    statusGrabber: any,
    proxyAddress: string,
    senderAddress: string
}

export type RemoveOldMultisigFromProxyType = {
    otherSignatories: Array<string>,
    newThreshold: number,
    network: string,
    api: ApiPromise,
    proxyTx: any,
    weight: any,
    statusGrabber: any,
    senderAddress: string,
    proxyAddress: string
}

export type NewTransactionData = {
    amount_token: BN;
    block_number: number;
    callData: string;
    callHash: string;
    from: string;
    network: string;
    note: string;
    to: string;
}

export type EditMultisigResponse = {
    callData?: string;
    callHash?: string;
    created_at?: Date;
    transactionData?: NewTransactionData;
    error?: string
}

export type TransactionCallBack = {
    status: any;
    txHash: any;
    events: any
}
