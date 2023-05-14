import { calcWeight } from "../uitils/calcWeight";
import { chainProperties, networks } from "../uitils/constants/network_constants";
import { responseMessages } from "../uitils/constants/response_messages";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createProxyTransaction } from "./createProxy";
import * as BN from 'bn.js';
import { Data } from "./types";

type Props = {
	network: string,
	data: Data,
}

export async function createProxyForWallet({
	network,
	data,
}: Props) {

	const { signatories, address: senderAddress, threshold, recipientAddress, injector, statusGrabber }: Data = data;

	if (!signatories || !senderAddress || !threshold || !recipientAddress || !injector) {
		return { status: 400, error: responseMessages.invalid_params };
	}

	try {
		if (!Object.values(networks).includes(network)) {
			return {
				status: 500,
				error: responseMessages.internal
			};
		}

		const provider = new WsProvider(chainProperties[network].rpcEndpoint);
		const api = new ApiPromise({ provider });
		await api.isReady;

		if (!api || !api.isReady) return { status: 500, error: responseMessages.internal };

		try {
			api.setSigner(injector.signer);
		} catch (error) {
			throw new Error('Invalid injector, please use a valid injector');
		}
		const amount = (api.consts.proxy.proxyDepositFactor as unknown as BN)
			.muln(1)
			.iadd(api.consts.proxy.proxyDepositBase as unknown as BN);

		const otherSignatories = signatories.filter((sig: string) => sig !== senderAddress);
		const proxyTx = api.tx.proxy.createPure('Any', 0, new Date().getMilliseconds());
		const transferTx = api.tx.balances.transferKeepAlive(recipientAddress, amount);
		const callData = api.createType('Call', transferTx.method.toHex());
		const { weight } = await calcWeight(callData, api);

		const multiSigProxyCall = api.tx.multisig.asMulti(
			threshold,
			otherSignatories,
			null,
			proxyTx,
			weight as any
		);

		const payload = {
			api,
			network,
			recipientAddress,
			senderAddress,
			injector,
			transferTx,
			multiSigProxyCall,
			proxyTx,
			statusGrabber
		}
		const response = await createProxyTransaction(payload)
		if (!response.callData) {
			return {
				status: 400,
				error: response.error
			};
		}

		return {
			status: 200,
			message: 'Transaction Successful',
			transactionData: response.transactionData
		};

	} catch (err: unknown) {
		return { status: 500, error: err };
	}
}