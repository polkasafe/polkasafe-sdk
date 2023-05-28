import { responseMessages } from "src/utils/constants/response_messages";
import { handleHeaders } from "src/utils/handleHeaders";
import { FIREBASE_FUNCTIONS_URL } from "src/utils/utils";

export const handleAfterEdit = async (address: string, network: string, signature: string, multisigName: string, newSignatories: string[], newThreshold: number, statusGrabber: any) => {
    try {
        if (!address || !signature || !newSignatories || !newThreshold) {
            console.log('ERROR');
            return;
        }
        else {
            statusGrabber('Creating Your Proxy.');
            const createMultisigRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/createMultisig`, {
                body: JSON.stringify({
                    disabled: true,
                    multisigName: multisigName,
                    signatories: newSignatories,
                    threshold: newThreshold
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...handleHeaders({ network, address, signature }),
                },
                method: 'POST'
            });

            const { data: multisigData, error: multisigError } = await createMultisigRes.json();
            if (multisigError) {
                return { error: responseMessages.multisig_create_error, message: multisigError }
            }

            return { message: responseMessages.success, data: multisigData }

        }
    } catch (error) {
        console.log('ERROR', error);
    }
};