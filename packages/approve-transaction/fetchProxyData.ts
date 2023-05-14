import { chainProperties } from "../uitils/constants/network_constants";
import { SUBSCAN_API_HEADERS } from "../uitils/constants/subscan_consts";
import { encodeAddress, } from '@polkadot/util-crypto';
import { handleMultisigCreate } from "./handleMultisigCreate";

export const fetchProxyData = async (multisig: any, signature: string, address: string, network: string, statusGrabber: any) => {
    const response = await fetch(
        `https://${network}.api.subscan.io/api/scan/events`,
        {
            body: JSON.stringify({
                row: 1,
                page: 0,
                module: 'proxy',
                call: 'PureCreated',
                address: multisig.address
            }),
            headers: SUBSCAN_API_HEADERS,
            method: 'POST'
        }
    );

    const responseJSON = await response.json();
    if (responseJSON.data.count === 0) {
        return;
    }
    else {
        const params = JSON.parse(responseJSON.data?.events[0]?.params);
        const proxyAddress = encodeAddress(params[0].value, chainProperties[network].ss58Format);
        await handleMultisigCreate(multisig, proxyAddress, signature, address, network, statusGrabber);
    }
};