import { addToAddressBook } from './add-to-address-book'
import { approveTransaction } from './approve-transaction'
import { Base } from './base'
import { cancelTransaction } from './cancel-transaction'
import { connectAddress } from './connect-address'
import { createMultisig } from './create-multisig'
import { createProxyForWallet } from './create-proxy'
import { deleteMultisig } from './delete-multisig'
import { editMultisigProxy } from './edit-multisig'
import { getAllMultisigByAddress } from './get-all-multisig-by-address'
import { getAssetsForAddress } from './get-assets-for-address'
import { getConnectAddressToken } from './get-connect-address-token'
import { getMultisigDataByMultisigAddress } from './get-multisig-data-by-address'
import { getMultisigQueue } from './get-multisig-queue'
import { getTransactionsForMultisig } from './get-transactions-for-multisig'
import { removeFromAddressBook } from './remove-from-address-book'
import { renameMultisig } from './rename-multisig'
import { sendNotification } from './send-notifications'
import { transferFunds } from './transfer-funds'
import formatBnBalance from './uitils/formatBnBalance'
import { handleHeaders } from './uitils/handleheaders'
import { voteOnProposal } from './vote-on-proposal'

export class Polkasafe extends Base {
    protected getHeaders() {
        if (!this.address || !this.network || !this.signature) {
            throw new Error('Address, network, signature is required please use setSignature first')
        }
        return handleHeaders({ address: this.address, network: this.network, signature: this.signature })
    }

    getConnectAddressToken(address: string): Promise<any> {
        const { endpoint, headers, options } = getConnectAddressToken(address)
        return this.request(endpoint, { ...headers, ...handleHeaders({address}) }, options)
    }

    connectAddress(address: string): Promise<any> {
        const { endpoint, headers, options } = connectAddress(address, this.network, this.signature)
        return this.request(endpoint, headers, options)
    }

    addToAddressBook(
        address: string,
        name: string
    ): Promise<any> {
        const { endpoint, headers, options } = addToAddressBook({
            name,
            addressToAdd: address
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    removeFromAddressBook(
        address: string,
        name: string
    ): Promise<any> {
        const { endpoint, headers, options } = removeFromAddressBook({
            name,
            addressToRemove: address
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    createMultisig(
        signatories: Array<string>,
        threshold: number,
        multisigName: string,
        type: 'wallet' | 'proxy',
        proxy?: string,
    ): Promise<any> {
        const { endpoint, headers, options } = createMultisig({
            signatories,
            threshold,
            multisigName,
            type,
            address: this.address,
            proxy,
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    getMultisigDataByAddress(multisigAddress: string): Promise<any> {
        const { endpoint, headers, options } = getMultisigDataByMultisigAddress({
            multisigAddress,
            network: this.network
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    getTransactionsForMultisig(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<any> {
        const { endpoint, headers, options } = getTransactionsForMultisig({
            multisigAddress,
            page,
            limit,
            network: this.network
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    getAssetsForAddress(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<any> {
        const { endpoint, headers, options } = getAssetsForAddress({
            multisigAddress,
            page,
            limit,
            network: this.network
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    getMultisigQueue(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<any> {
        const { endpoint, headers, options } = getMultisigQueue({
            multisigAddress,
            page,
            limit
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    renameMultisig(
        multisigAddress: string,
        name: string
    ): Promise<any> {
        const { endpoint, headers, options } = renameMultisig({
            multisigAddress,
            name
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    sendNotification(
        addresses: [string],
        link: string,
        message: string,
        type: string
    ): Promise<any> {
        const { endpoint, headers, options } = sendNotification({
            addresses,
            link,
            message,
            type
        })
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    // Aleem TODO: currently not using, need to discuss
    getNotifications(): Promise<any> {
        const { endpoint, headers, options } = { endpoint: '/getNotifications', headers: this.getHeaders(), options: {} }
        return this.request(endpoint, headers, options)
    }

    deleteMultisig(multisigAddress: string): Promise<any> {
        const { endpoint, headers, options } = deleteMultisig(multisigAddress)
        return this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
    }

    async createProxy(
        multisigAddress: string,
        injector: any,
        statusGrabber?: any
    ): Promise<any> {
        const { data } = await this.getMultisigDataByAddress(multisigAddress)
        // If statusGrabber is empty
        const emptyFunction = () => { }
        const payload = {
            signatories: data.signatories,
            address: this.address,
            threshold: data.threshold,
            recipientAddress: multisigAddress,
            injector,
            statusGrabber: statusGrabber || emptyFunction,
        }
        const { error, status, message, transactionData } = await createProxyForWallet({
            network: this.network,
            data: payload,
        })
        if (!error && status === 200 && transactionData) {
            try {
                const newTransactionData = {
                    amount_token: Number(
                        formatBnBalance(
                            transactionData.amount_token,
                            { numberAfterComma: 3, withThousandDelimitor: false, withUnit: false },
                            this.network,
                        ),
                    ),
                    block_number: transactionData.block_number,
                    callData: transactionData.callData,
                    callHash: transactionData.callHash,
                    from: transactionData.from,
                    network: transactionData.network,
                    note: transactionData.note,
                    to: transactionData.to,
                }
                const { endpoint, headers, options } = {
                    endpoint: '/addTransaction',
                    headers: this.getHeaders(),
                    options: { body: JSON.stringify(newTransactionData), method: 'POST' },
                }
                this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
            } catch (e) {
                console.log(e)
            }
            return { status: 200, message: message }
        }
        return { status, error }
    }

    async editMultisig(
        multisigAddress: string,
        newSignatories: Array<string>,
        newThreshold: number,
        injector: any,
        statusGrabber: any,
    ): Promise<any> {
        const response: any = {}
        const { data } = await this.getMultisigDataByAddress(multisigAddress)
        const emptyFucn = () => { }
        const payload = {
            multisigAddress,
            oldSignatories: data.signatories,
            oldThreshold: data.threshold,
            newSignatories,
            newThreshold,
            proxyAddress: data.proxy,
            injector,
            statusGrabber: statusGrabber || emptyFucn,
        }
        const { addNewMultiResponse, removeOldMultiResponse } = await editMultisigProxy({
            address: this.address,
            network: this.network,
            data: payload,
        })
        console.log('response of addNewMultisig:', addNewMultiResponse)
        console.log('response of removeOldMultisig:', removeOldMultiResponse)
        if (!addNewMultiResponse.error && addNewMultiResponse.status === 200) {
            const { status, transactionData } = addNewMultiResponse

            const newTransactionData = {
                amount_token: Number(
                    formatBnBalance(
                        transactionData.amount_token,
                        { numberAfterComma: 3, withThousandDelimitor: false, withUnit: false },
                        this.network,
                    ),
                ),
                block_number: transactionData.block_number,
                callData: transactionData.callData,
                callHash: transactionData.callHash,
                from: transactionData.from,
                network: transactionData.network,
                note: transactionData.note,
                to: transactionData.to,
            }
            console.log(newTransactionData)
            const { endpoint, headers, options } = {
                endpoint: '/addTransaction',
                headers: this.getHeaders(),
                options: { body: JSON.stringify(newTransactionData), method: 'POST' },
            }
            this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
            response.addNewMultiResponse = { status: status, data: transactionData }
        }
        if (!removeOldMultiResponse.error && removeOldMultiResponse.status === 200) {
            const { status, transactionData } = removeOldMultiResponse

            const newTransactionData = {
                amount_token: Number(
                    formatBnBalance(
                        transactionData.amount_token,
                        { numberAfterComma: 3, withThousandDelimitor: false, withUnit: false },
                        this.network,
                    ),
                ),
                block_number: transactionData.block_number,
                callData: transactionData.callData,
                callHash: transactionData.callHash,
                from: transactionData.from,
                network: transactionData.network,
                note: transactionData.note,
                to: transactionData.to,
            }
            console.log(newTransactionData)
            const { endpoint, headers, options } = {
                endpoint: '/addTransaction',
                headers: this.getHeaders(),
                options: { body: JSON.stringify(newTransactionData), method: 'POST' },
            }
            this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
            response.removeOldMultiResponse = { status: status, data: transactionData }
        }

        if (response.addNewMultiResponse && response.removeOldMultiResponse) {
            response.status = 200
            return response
        }
        return { status: 400, removeError: removeOldMultiResponse.error, addError: addNewMultiResponse.error }
    }

    async transferFunds(
        recipientAddress: string,
        amount: number,
        senderAddress: string,
        injector: any,
        multisig: any,
        isProxy: any,
        statusGrabber: any,
    ): Promise<any> {
        const payload = { recipientAddress, amount, senderAddress, injector, multisig, isProxy, statusGrabber }
        const {
            status,
            error,
            message,
            data: transactionData,
        } = await transferFunds({
            network: this.network,
            data: payload
        })
        if (!error && status === 200) {
            try {
                const newTransactionData = {
                    amount_token: Number(
                        formatBnBalance(
                            transactionData.amount,
                            { numberAfterComma: 3, withThousandDelimitor: false, withUnit: false },
                            this.network,
                        ),
                    ),
                    block_number: transactionData.block_number,
                    callData: transactionData.callData,
                    callHash: transactionData.callHash,
                    from: transactionData.from,
                    network: transactionData.network,
                    note: transactionData.note,
                    to: transactionData.to,
                }
                const { endpoint, headers, options } = {
                    endpoint: '/addTransaction',
                    headers: this.getHeaders(),
                    options: { body: JSON.stringify(newTransactionData), method: 'POST' },
                }
                this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
            } catch (e) {
                console.log(e)
            }
            return { status: 200, message: message, data: transactionData }
        }
        return { status, error }
    }

    async approveTransaction(
        multisigAddress: string,
        callHash: string,
        callData: string,
        injector: any,
        requestType: 'proxy' | 'wallet' | 'edit_proxy',
        statusGrabber: any,
    ) {
        const senderAddress = this.address
        const { data: multisig } = await this.getMultisigDataByAddress(multisigAddress)
        console.log(multisig.address, multisigAddress)
        const data = {
            senderAddress,
            injector,
            multisig,
            callHash,
            callDataString: callData,
            requestType,
            statusGrabber,
        }
        const {
            status,
            error,
            message,
            data: transactionData,
        } = await approveTransaction({
            signature: this.signature,
            address: this.address,
            network: this.network,
            data
        })
        if (!error && status === 200) {
            if (transactionData) {
                if (requestType === 'wallet') {
                    const newTransactionData = {
                        amount_token: Number(
                            formatBnBalance(
                                transactionData.amount,
                                { numberAfterComma: 3, withThousandDelimitor: false, withUnit: false },
                                this.network,
                            ),
                        ),
                        block_number: transactionData.block_number,
                        callData: transactionData.callData,
                        callHash: transactionData.callHash,
                        from: transactionData.from,
                        network: transactionData.network,
                        note: transactionData.note,
                        to: transactionData.to,
                    }
                    const { endpoint, headers, options } = {
                        endpoint: '/addTransaction',
                        headers: this.getHeaders(),
                        options: { body: JSON.stringify(newTransactionData), method: 'POST' },
                    }
                    this.request(endpoint, { ...headers, ...this.getHeaders() }, options)
                }
                return { status: 200, message: message, data: transactionData }
            }
            return { status: 200, message: message }
        }
        return { status, error }
    }

    async cancelTransaction(
        multisigAddress: string,
        callHash: any,
        injector: any,
        statusGrabber: any
    ) {
        const { data: multisig } = await this.getMultisigDataByAddress(multisigAddress)
        const data = {
            injector,
            multisig,
            callHash,
            statusGrabber,
        }
        const { status, error, message } = await cancelTransaction({
            address: this.address,
            network: this.network,
            data
        })
        if (!error && status === 200) {
            return { status: 200, message: message }
        }
        return { status, error }
    }

    async voteOnProposal(
        multisigAddress:string,
        injector:any,
        proposalIndex:number,
        vote:number,
        statusGrabber: any,
        proposalType:any
        ){
        const { data: multisig } = await this.getMultisigDataByAddress(multisigAddress)
        const data = {
            injector,
            multisig,
            statusGrabber,
            proposalIndex,
            proposalType,
            vote,
        }
        const { status, error, message } = await voteOnProposal({
            address: this.address,
            network: this.network,
            data
        })
        if (!error && status === 200) {
            return { status: 200, message: message }
        }
        return { status, error }
    }

    async getAllMultisigByAddress(){
        try{
            this.getHeaders()
            const response = await getAllMultisigByAddress(this.address, this.network)
            return response;
        }catch(e){
            return {status: 400, error:e}
        }
    }
}
