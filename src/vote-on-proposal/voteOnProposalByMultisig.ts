import { BN } from 'bn.js'

type Props = {
    api: any
    proposalIndex: number
    vote: any
    senderAddress: string
    injector: any
    network: string
    multisig: any
    statusGrabber: any
    proposalType: any
}

export const voteOnProposalByMultisig = async ({
    api,
    proposalIndex,
    vote,
    senderAddress,
    injector,
    network,
    multisig,
    proposalType,
    statusGrabber,
}: Props) => {
    try {
        api.setSigner(injector.signer)
    } catch (error) {
        throw new Error(`Invalid injector, please use a valid injector${error}`)
    }
    const otherSignatories = multisig.signatories.sort().filter((signatory: string) => signatory !== senderAddress)
    let tx;
    if(proposalType === 'referendums_v2'){
        tx = api.tx.convictionVoting.vote(proposalIndex, vote);
    }else{
        tx = api.tx.democracy.vote(proposalIndex, vote);
    }
    
    const TIME_POINT = null;
    let blockHash = '';
    return new Promise<any>((resolve, reject) => {
        api.tx.multisig
            .asMulti(multisig.threshold, otherSignatories, TIME_POINT, tx, 0)
            .signAndSend(senderAddress, async ({ status, txHash, events }: { status: any; txHash: any; events: any }) => {
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
                                message: 'success',
                                data: {
                                    amount_token: new BN(0),
                                    block_number: blockNumber,
                                    callData: tx.method.toHex(),
                                    callHash: tx.method.hash.toHex(),
                                    from: multisig.address,
                                    network,
                                    note: '',
                                    to: '',
                                },
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
            })
            .catch((error: any) => {
                console.log(':( transaction failed');
                console.error('ERROR:', error);
                reject({ error });
            });
    });
};