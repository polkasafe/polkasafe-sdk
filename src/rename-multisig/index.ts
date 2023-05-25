type Props = {
    multisigAddress: string,
    name: string
}

export function renameMultisig({
    multisigAddress,
    name,
}: Props) {
    if (!multisigAddress) {
        throw new Error('Multisig address is required');
    }
    if (!name) {
        throw new Error('name is required');
    }
    const body = JSON.stringify({
        address: multisigAddress,
        name
    })
    return {
        endpoint: '/renameMultisig', headers: {}, options: { method: 'POST', body: body }
    }
}