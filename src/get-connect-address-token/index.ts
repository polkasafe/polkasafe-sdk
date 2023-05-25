export function getConnectAddressToken(address:string) {
    if(!address){
        throw new Error('address are required');
    }
    return {
        endpoint: '/getConnectAddressToken', headers:{}, options: { method: 'POST' }
    }
}