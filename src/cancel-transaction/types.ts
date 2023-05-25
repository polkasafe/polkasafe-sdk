export type CancelTransactionPayloadType = {
    injector: any,
    multisig: any,
    callHash: any,
    statusGrabber: any
}

export type CancelTransactionResponse = {
    message?: string;
    error?: string
}