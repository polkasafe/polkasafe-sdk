import { handleHeaders } from "../utils/handleHeaders";

export function connectAddress(address: string, network: string, signature: string) {
    if (!address || !network || !signature) {
        throw new Error('Invalid signature, use setSignature method to set the signature');
    }
    const headers = handleHeaders({ address, network, signature })
    return {
        endpoint: '/connectAddress', headers, options: { method: 'POST' }
    }
}