type Props = {
    name:string,
    addressToAdd:string
}

export function addToAddressBook({ name, addressToAdd}:Props){
    if(!addressToAdd){
        throw new Error('address is required');
    }
    if(!name){
        throw new Error('name is required');
    }
    const body = JSON.stringify({
        address:addressToAdd,
        name
    })
    return {
        endpoint: '/addToAddressBook', headers:{}, options: { method: 'POST', body }
    }
}