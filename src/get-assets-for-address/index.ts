type Props = {
    multisigAddress: string,
    network: string,
    page: number,
    limit: number
}

export function getAssetsForAddress({
    multisigAddress,
    network,
    page = 1,
    limit = 10,
}: Props) {
    if (!multisigAddress) {
        throw new Error('Multisig address is required');
    }
    if (!Number(page)) {
        throw new Error('Invalid request please check you params');
    }
    if (!Number(limit)) {
        throw new Error('Invalid request please check you params');
    }
    const body = JSON.stringify({
        address: multisigAddress,
        network: network,
        page,
        limit
    })
    return {
        endpoint: '/getAssetsForAddress', headers: {}, options: { method: 'POST', body: body }
    }
}