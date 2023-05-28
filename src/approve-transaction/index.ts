import { chainProperties, networks } from '../utils/constants/network_constants'
import { responseMessages } from '../utils/constants/response_messages'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { approveTransactionForWallet } from './approveTransaction'
import { getMultisigInfo } from '../utils/getMultisigInfo'
import decodeCallData from '../utils/decodeCallData'
import { calcWeight } from '../utils/calcWeight'
import { BN } from 'bn.js'
import { ApproveTransactionPayload } from './types'
import { fetchProxyData } from './fetchProxyData'
import { handleEditProxyMultisigCreate } from './handleEditProxyMultisigCreate'

type Props = {
	signature: string,
	address: string,
	network: string,
	data: ApproveTransactionPayload
}

export async function approveTransaction({
	signature,
	address,
	network,
	data,
}: Props) {

	const { senderAddress, injector, multisig, callHash, callDataString, requestType, statusGrabber } = data

	if (
		!senderAddress
		|| !injector
		|| !multisig
		|| !callHash
		|| !requestType
	) {
		return { status: 400, error: responseMessages.invalid_params }
	}
	try {
		if (!Object.values(networks).includes(network)) return { status: 500, error: responseMessages.internal }

		const provider = new WsProvider(chainProperties[network].rpcEndpoint)
		const api = new ApiPromise({ provider })
		await api.isReady

		if (!api || !api.isReady) return { status: 500, error: responseMessages.internal }

		const multisigInfos = await getMultisigInfo(multisig.address, api)
		const [, multisigInfo] = multisigInfos?.find(([h]) => h.eq(callHash)) || [null, null]

		if (!multisigInfo) {
			console.log('No multisig info found')
			return { status: 400, error: 'No multisig info found' }
		}
		const numApprovals = multisigInfo.approvals.length
		const lastApproval = !(numApprovals < multisig.threshold - 1)
		const otherSignatories = multisig.signatories.sort().filter((signatory: string) => signatory !== senderAddress)

		const { data, error } = decodeCallData(callDataString, api) as any
		if (error || !data) return { status: 400, error: 'Invalid Call Data' }

		if (data?.extrinsicCall?.hash.toHex() !== callHash) {
			return { status: 500, error: responseMessages.internal }
		}

		const decodedCallData = data.extrinsicCall?.toJSON()

		if (
			(!decodedCallData || !decodedCallData?.args?.value || !decodedCallData?.args?.dest?.id) &&
			!decodedCallData?.args?.proxy_type &&
			(!decodedCallData?.args?.call?.args?.value || !decodedCallData?.args?.call?.args?.dest?.id) &&
			(!decodedCallData?.args?.call?.args?.delegate || !decodedCallData?.args?.call?.args?.delegate?.id)
		) {
			return { status: 400, error: 'Invalid Call Data' }
		}

		const amount = new BN(decodedCallData?.args?.value || decodedCallData?.args?.call?.args?.value || 0)
		const recipientAddress = decodedCallData.args.dest?.id || decodedCallData?.args?.call?.args?.dest?.id || ''

		// TODO: Aleem => need to ask about storing callData in BE, we are already store data in add new transaction
		// (async () => {
		// 	if( callDataString || callData) return; // already stored

		// 	await fetch(`${FIREBASE_FUNCTIONS_URL}/setTransactionCallData`, {
		// 		body: JSON.stringify({
		// 			callData: callDataString,
		// 			callHash,
		// 			network
		// 		}),
		// 		headers: firebaseFunctionsHeader(network),
		// 		method: 'POST'
		// 	});
		// })();

		const ZERO_WEIGHT = new Uint8Array(0)
		let weight: any = ZERO_WEIGHT
		let AMOUNT_TO_SEND: number = 0
		let callData

		if (callDataString && amount && recipientAddress) {
			AMOUNT_TO_SEND = amount.toNumber()
			callData = api.createType('Call', callDataString)
			const { weight: WEIGHT } = await calcWeight(callData, api)
			weight = WEIGHT
			if (!callData.hash.eq(callHash)) return { status: 400, error: 'Invalid Call hash' }
		}

		if (callDataString) {
			callData = api.createType('Call', callDataString)
			const { weight: WEIGHT } = await calcWeight(callData, api)
			weight = WEIGHT
			if (!callData.hash.eq(callHash)) return { status: 400, error: 'Invalid Call hash' }
		}

		let afterApproveCall: any = () => { };
		if (requestType === 'proxy') {
			afterApproveCall = () => fetchProxyData(multisig, signature, address, network, statusGrabber)
		}
		else if (requestType === 'edit_proxy') {
			afterApproveCall = () => handleEditProxyMultisigCreate(multisig, multisig.proxy, signature, address, network, statusGrabber, decodedCallData?.args?.call?.args?.delegate?.id)
		}


		const payload = {
			api,
			amount: AMOUNT_TO_SEND,
			senderAddress,
			injector,
			network,
			lastApproval,
			multisig,
			otherSignatories,
			when: multisigInfo.when,
			callHash,
			callData,
			weight,
			afterSuccessFunction: afterApproveCall,
			statusGrabber,
			recipientAddress,
			callDataString,
			requestType,
		}

		const response = await approveTransactionForWallet(payload)
		if (!response.message) {
			return { status: 400, error: response.error }
		}
		
		return { status: 200, message: 'Transaction Successful', data: response.data || null }
	} catch (err: unknown) {
		return { status: 500, error: err }
	}
}
