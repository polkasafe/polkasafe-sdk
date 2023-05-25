export function deleteMultisig(multisigAddress: string) {
    if (!multisigAddress) {
        throw new Error('Multisig address is required');
    }

    const body = JSON.stringify({
        multisigAddress: multisigAddress,
    })

    return {
        endpoint: '/deleteMultisig', headers: {}, options: { method: 'POST', body: body }
    }
}