// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiPromise, WsProvider } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { sortAddresses } from '@polkadot/util-crypto';
import { calcWeight } from '../utils/calcWeight';
import { chainProperties, networks } from '../utils/constants/network_constants';
import { responseMessages } from '../utils/constants/response_messages';
import _createMultisig from './_createMultisig';
import { addNewMultisigToProxy } from './addNewMultisig';
import { removeOldMultisig } from './removeOldMultisig';
import { AddNewMultisigToProxyType, EditProxyPayloadType } from './types';
import { handleAfterEdit } from './handleAfterEditCreate';

type Props = {
	address: string,
	network: string,
	signature:string,
	data: EditProxyPayloadType
}

export async function editMultisigProxy({
	address,
	network,
	signature,
	data,
}: Props) {
	const response: any = {};

	const {
		oldSignatories,
		oldThreshold,
		multisigName,
		multisigAddress,
		newSignatories,
		newThreshold,
		proxyAddress,
		injector,
		statusGrabber
	}: EditProxyPayloadType = data;

	if (
		!oldSignatories ||
		!oldThreshold ||
		!newSignatories ||
		!newThreshold ||
		!proxyAddress ||
		!injector ||
		!multisigAddress
	) {
		return { status: 400, error: responseMessages.invalid_params };
	}

	try {
		if (!Object.values(networks).includes(network)) {
			return { status: 500, error: responseMessages.internal };
		}

		const provider = new WsProvider(chainProperties[network].rpcEndpoint);
		const api = new ApiPromise({ provider });
		await api.isReady;

		if (!api || !api.isReady) {
			return { status: 500, error: responseMessages.internal };
		}

		try {
			api.setSigner(injector.signer);
		} catch (error) {
			throw new Error('Invalid injector, please use a valid injector');
		}

		const otherSignatories = oldSignatories.filter((sig: string) => sig !== address);

		const multisigResponse = _createMultisig(
			newSignatories,
			newThreshold,
			chainProperties[network].ss58Format
		);

		const newMultisigAddress = encodeAddress(multisigResponse?.multisigAddress || '');
		const addProxyTx = api.tx.proxy.addProxy(newMultisigAddress, 'Any', 0);
		const proxyTx = api.tx.proxy.proxy(proxyAddress, null, addProxyTx);

		const callData = api.createType('Call', proxyTx.method.toHex());
		// @ts-ignore
		const { weight } = await calcWeight(callData, api);

		const payload: AddNewMultisigToProxyType = {
			api,
			otherSignatories,
			oldThreshold,
			network,
			proxyTx,
			weight,
			statusGrabber,
			proxyAddress,
			senderAddress: address
		};

		const addNewMultiResponse = await addNewMultisigToProxy(payload);

		if (!addNewMultiResponse.callData) {
			response.addNewMultiResponse = { status: 400, error: addNewMultiResponse.error };
		} else {
			response.addNewMultiResponse = { ...addNewMultiResponse, status: 200 };
		}
		const removeTxOtherSignatories = sortAddresses(newSignatories.filter((sig: string) => sig !== address));

		const removeProxyTx = api.tx.proxy.removeProxy(multisigAddress, 'Any', 0);
		const proxyRemoveTx = api.tx.proxy.proxy(proxyAddress, null, removeProxyTx);

		const removeCallData = api.createType('Call', proxyRemoveTx.method.toHex());
		// @ts-ignore
		const { weight: removeWeight } = await calcWeight(removeCallData, api);

		const removePayload = {
			api,
			network,
			otherSignatories: removeTxOtherSignatories,
			proxyTx: proxyRemoveTx,
			weight: removeWeight,
			newThreshold,
			statusGrabber,
			senderAddress: address,
			proxyAddress
		};
		const removeOldMultiResponse = await removeOldMultisig(removePayload);
		if (!removeOldMultiResponse.callData) {
			response.removeOldMultiResponse = { status: 400, error: removeOldMultiResponse.error };
		} else {
			response.removeOldMultiResponse = { ...removeOldMultiResponse, status: 200 };
		}

		const newMulti = await handleAfterEdit(address, network, signature, multisigName, newSignatories, newThreshold, statusGrabber)
		
		if(newMulti.data){
			response.newMulti = newMulti.data
		}else{
			response.newMulti = undefined
		}

		return response;
	} catch (err: unknown) {
		console.log(err);
		return { status: 500, error: err };
	}
}
