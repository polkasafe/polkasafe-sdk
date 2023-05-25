export type TransferFundsPayloadType = {
    recipientAddress: string,
    amount: number,
    senderAddress: string,
    injector: any,
    multisig: any,
    isProxy: boolean,
    statusGrabber: any
}

export type NewTransactionData = {
    amount: number;
    block_number: number;
    callData: string;
    callHash: string;
    from: string;
    network: string;
    note: string;
    to: string;
}

export type TransferFundsResponse = {
    message?: string;
    data?: NewTransactionData;
    error?: string
}