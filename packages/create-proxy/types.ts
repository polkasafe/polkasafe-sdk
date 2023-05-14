import * as BN from 'bn.js'

export type Data = {
    signatories: Array<string>,
    address: string,
    threshold: number,
    recipientAddress: string,
    injector: any,
    statusGrabber: any
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

export type MultiTransferResponse = {
    callData?: string;
    callHash?: string;
    created_at?: Date;
    transactionData?: NewTransactionData;
    error?: string
}