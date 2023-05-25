import { ApiPromise, WsProvider } from "@polkadot/api";
import { voteOnProposalByMultisig } from "./voteOnProposalByMultisig";
import { responseMessages } from "../uitils/constants/response_messages";
import { chainProperties, networks } from "../uitils/constants/network_constants";

type Props = {
    address: string,
    network: string,
    data: any
}

export async function voteOnProposal({ address, network, data }: Props) {
    const {
        injector,
        multisig,
        statusGrabber,
        proposalIndex,
        proposalType,
        vote
    } = data;

    if (!multisig || !statusGrabber || !proposalIndex || !vote || !injector || !proposalType) {
        return { status: 400, error: responseMessages.invalid_params };
    }
    try {
        if (!Object.values(networks).includes(network)) return { status: 500, error: responseMessages.internal };

        const provider = new WsProvider(chainProperties[network].rpcEndpoint);
        const api = new ApiPromise({ provider });
        await api.isReady;
        if (!api || !api.isReady) return { status: 500, error: responseMessages.internal };
        const payload = {
            api,
            proposalIndex,
            vote,
            senderAddress: address,
            injector,
            network,
            multisig,
            proposalType,
            statusGrabber
        }
        const response = await voteOnProposalByMultisig(payload);
        if (!response.message) {
            return { status: 400, error: response.error };
        }
        return { status: 200, message: 'Transaction Successful', data: response.data };
    } catch (err: unknown) {
        return { status: 500, error: responseMessages.internal };
    }
}