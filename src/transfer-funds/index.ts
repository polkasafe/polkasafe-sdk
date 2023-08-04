import { chainProperties, networks } from "../utils/constants/network_constants";
import { responseMessages } from "../utils/constants/response_messages";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { transferFundsFromWallet } from "./transferFunds";
import { TransferFundsPayloadType } from "./types";

type Props = {
    network: string,
    data: TransferFundsPayloadType
}

export async function transferFunds({
    network,
    data,
}: Props) {
    const { recipientAddress, amount, senderAddress, injector, multisig, isProxy, statusGrabber } = data;

    if (!recipientAddress || !amount || !senderAddress || !injector) {
        return { status: 400, error: responseMessages.invalid_params };
    }

    try {
        if (!Object.values(networks).includes(network)) return { status: 500, error: responseMessages.network_not_supported };

        const provider = new WsProvider(chainProperties[network].rpcEndpoint);
        const api = new ApiPromise({ provider });
        await api.isReady;

        if (!api || !api.isReady) return { status: 500, error: responseMessages.internal };

        const payload = {
            api,
            recipientAddress,
            amount,
            senderAddress,
            injector,
            network,
            multisig,
            isProxy,
            statusGrabber
        }
        const response = await transferFundsFromWallet(payload);
        if (!response.message) {
            return { status: 400, error: response.error };
        }
        return { status: 200, message: 'Transaction Successful', data: response.data };

    } catch (err: unknown) {
        return { status: 500, error: err };
    }
}