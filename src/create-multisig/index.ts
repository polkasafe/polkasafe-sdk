type Props = {
    signatories:Array<string>,
    threshold:number,
    multisigName:string,
    type:'wallet'|'proxy',
    address:string,
    proxy?:string   
}

export function createMultisig ({
    signatories,
    threshold,
    multisigName,
    type,
    address,
    proxy,
}:Props){
    if(type === 'proxy'&& !proxy){
        new Error('proxy are required');
    }
    if(!signatories || !signatories.length){
        throw new Error('You should have at least one signatories');
    }
    if(!threshold){
        throw new Error('threshold is required');
    }
    if(threshold > signatories.length + 1){
        throw new Error('threshold can not be grater than total signatories');
    }
    if(!multisigName){
        throw new Error('multisig name is required');
    }
    
    const body = JSON.stringify({
        proxyAddress: proxy,
        multisigName: multisigName,
        signatories: [address, ...signatories],
        threshold: threshold
    })

    return {
        endpoint: '/createMultisig', headers:{}, options: { method: 'POST', body:body }
    }
}