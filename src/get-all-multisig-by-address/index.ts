import axios from "axios";
import { SUBSCAN_API_HEADERS } from "../uitils/constants/subscan_consts";
import { responseMessages } from "../uitils/constants/response_messages";

export const getAllMultisigByAddress = async (address:string, network:string)=>{
    const {data} = await axios.post(`https://${network}.api.subscan.io/api/v2/scan/search`, {
        'row': 1,
        'key': address
    }, {
        headers: SUBSCAN_API_HEADERS
    });

    if(data?.multisig?.multi_account){
        return {status: 200, message: 'success', data: data?.multisig?.multi_account}
    }
    return {status: 400, error:responseMessages.internal}
}