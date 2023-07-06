import {ApiPromise, WsProvider} from '@polkadot/api';
import {chainProperties, networks} from 'src/utils/constants/network_constants';
import {responseMessages} from 'src/utils/constants/response_messages';
import {IMultisigAddress} from 'src/utils/globalTypes';
import {customTransactionByMulti} from './customTransaction';
import { Balance } from '@polkadot/types/interfaces';

type Props = {
    multisig: IMultisigAddress;
    tx: any;
    address: string;
    network: string;
    injector: any;
    statusGrabber: any;
    isProxy: boolean;
    tip?:Balance
};

export async function customTransaction({
    network,
    multisig,
    injector,
    address,
    tx,
    isProxy,
    statusGrabber = () => {},
    tip
}: Props) {
    try {
        if (!Object.values(networks).includes(network))
            return {status: 400, error: responseMessages.network_not_supported};

        const provider = new WsProvider(chainProperties[network].rpcEndpoint);
        const api = new ApiPromise({provider});
        await api.isReady;

        if (!api || !api.isReady)
            return {status: 500, error: responseMessages.internal};

        const payload = {
            api,
            injector,
            network,
            tx,
            multisig,
            statusGrabber,
            senderAddress: address,
            isProxy,
            tip
        };
        const response = await customTransactionByMulti(payload);
        if (!response.message) {
            return {status: 400, error: response.error};
        }
        return {
            status: 200,
            message: 'Transaction Successful',
            data: response.data,
        };
    } catch (err: unknown) {
        return {status: 500, error: err};
    }
}
