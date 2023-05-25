type Props = {
    multisigAddress: string,
    network: string
}

export function getMultisigDataByMultisigAddress({
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
        endpoint: '/getMultisigDataByMultisigAddress', headers: {}, options: { method: 'POST', body: body }
    }
}