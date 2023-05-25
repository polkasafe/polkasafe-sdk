type Props = {
    name:string,
    addressToRemove:string
}

export function removeFromAddressBook({name, addressToRemove}:Props){
    if(!addressToRemove){
        throw new Error('address is required');
    }
    if(!name){
        throw new Error('name is required');
    }
    const body = JSON.stringify({
        address:addressToRemove,
        name
    })
    
    return {
        endpoint: '/removeFromAddressBook', headers:{}, options: { method: 'POST', body }
    }
}