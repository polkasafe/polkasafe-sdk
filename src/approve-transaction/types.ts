import * as BN from "bn.js";
export type ApproveTransactionPayload = {
    senderAddress: string,
    injector: any,
    multisig: any,
    callHash: any,
    callDataString: string,
    requestType: 'proxy' | 'wallet' | 'edit_proxy',
    statusGrabber: any
}

export type NewTransactionData = {
    amount: BN | number;
    block_number: number;
    callData: string;
    callHash: string;
    from: string;
    network: string;
    note: string;
    to: string;
}

export type ApproveTransactionResponse = {
    message?: string;
    data?: NewTransactionData;
    error?: string
}