type Props = {
    addresses: [string],
    link: string,
    message: string,
    type: string
}

export function sendNotification({
    addresses,
    link,
    message,
    type,
}: Props) {
    if (!addresses) {
        throw new Error('addresses is required');
    }
    if (!link) {
        throw new Error('link is required');
    }
    if (!message) {
        throw new Error('message is required');
    }
    if (!type) {
        throw new Error('type is required');
    }
    const body = JSON.stringify({
        addresses,
        link,
        message,
        type
    })
    return {
        endpoint: '/sendNotification', headers: {}, options: { method: 'POST', body: body }
    }
}