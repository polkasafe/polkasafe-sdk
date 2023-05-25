import { FIREBASE_FUNCTIONS_URL } from "../uitils/utils";

export const handleMultisigCreate = async (multisig: any, proxyAddress: string, signature: string, address: string, network: string, statusGrabber: any) => {
    try {
        if (!multisig || !proxyAddress) {
            console.log('ERROR');
            return { error: 'required params' };
        }
        else {
            statusGrabber('Creating Your Proxy.');
            const createMultisigRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/createMultisig`, {
                body: JSON.stringify({
                    signatories: multisig.signatories,
                    threshold: multisig.threshold,
                    multisigName: multisig.name,
                    proxyAddress
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-address': address,
                    'x-network': network,
                    'x-signature': signature
                },
                method: 'POST'
            });

            const { data: multisigData, error: multisigError } = await createMultisigRes.json();

            if (multisigError) {
                return { error: multisigError };
            }
            if (multisigData) {
                return { message: 'success' };
            }
            return { error: multisigError };
        }
    } catch (error) {
        console.log('ERROR', error);
        return { error };
    }
};