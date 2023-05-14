import { FIREBASE_FUNCTIONS_URL } from "../uitils/utils";
import * as dayjs from 'dayjs';

export const handleEditProxyMultisigCreate = async (multisig: any, proxyAddress: string, signature: string, address: string, network: string, statusGrabber: any, newMultisigAddress: string) => {
    try {

        if (!address || !signature || !newMultisigAddress) {
            console.log('ERROR');
            return;
        }
        else {
            const getNewMultisigData = await fetch(`${FIREBASE_FUNCTIONS_URL}/getMultisigDataByMultisigAddress`, {
                body: JSON.stringify({
                    multisigAddress: newMultisigAddress,
                    network
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

            const { data: newMultisigData, error: multisigFetchError } = await getNewMultisigData.json() as { data: any, error: string };

            if (multisigFetchError || !newMultisigData) {
                return { status: 400, error: 'Not able to find data' };
            }
            // if approval is for removing old multisig from proxy
            if (dayjs(newMultisigData?.created_at).isBefore(multisig.created_at)) {
                return { status: 400, error: 'Not able to find data' };
            }
            statusGrabber('Creating Your Proxy.');
            const createMultisigRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/createMultisig`, {
                body: JSON.stringify({
                    proxyAddress,
                    multisigName: multisig?.name,
                    signatories: newMultisigData.signatories,
                    threshold: newMultisigData.threshold
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

            const { data: multisigData, error: multisigError } = await createMultisigRes.json() as { error: string; data: any };

            console.log('HandleEditMultisig', multisigData)

            if (multisigError) {
                return { status: 400, error: multisigError };
            }
            return { status: 200, data: multisigData };

        }
    } catch (error) {
        console.log('ERROR', error);
        return { status: 400, error };
    }
};