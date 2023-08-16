type Props = {
    multisigAddress: string,
    network: string
}

export function getMultisigDataByAddress({
    multisigAddress,
    network,
}: Props) {
    if (!multisigAddress) {
        throw new Error('Multisig address is required');
    }

    const body = JSON.stringify({
        multisigAddress: multisigAddress,
        network: network,
    })

    return {
        endpoint: '/getMultisigDataByAddress', headers: {}, options: { method: 'POST', body: body }
    }
}