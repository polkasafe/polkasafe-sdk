type Props = {
    multisigAddress: string,
    page: number,
    limit: number
}

export function getMultisigQueue({
    multisigAddress,
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
        multisigAddress,
        page,
        limit
    })

    return {
        endpoint: '/getMultisigQueue', headers: {}, options: { method: 'POST', body: body }
    }
}