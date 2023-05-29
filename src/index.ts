import { addToAddressBook } from './add-to-address-book';
import { approveTransaction } from './approve-transaction';
import { Base } from './base';
import { cancelTransaction } from './cancel-transaction';
import { connectAddress } from './connect-address';
import { createMultisig } from './create-multisig';
import { createProxyForWallet } from './create-proxy';
import { deleteMultisig } from './delete-multisig';
import { editMultisigProxy } from './edit-multisig';
import { getAllMultisigByAddress } from './get-all-multisig-by-address';
import { getAssetsForAddress } from './get-assets-for-address';
import { getConnectAddressToken } from './get-connect-address-token';
import { getMultisigDataByMultisigAddress } from './get-multisig-data-by-address';
import { getMultisigQueue } from './get-multisig-queue';
import { getTransactionsForMultisig } from './get-transactions-for-multisig';
import { removeFromAddressBook } from './remove-from-address-book';
import { renameMultisig } from './rename-multisig';
import { sendNotification } from './send-notifications';
import { transferFunds } from './transfer-funds';
import { handleHeaders } from './utils/handleHeaders';
import formatBnBalance from './utils/formatBnBalance';
import { voteOnProposal } from './vote-on-proposal';
import { stringToHex } from '@polkadot/util';
import { responseMessages } from './utils/constants/response_messages';
import { Injected } from '@polkadot/extension-inject/types';
import { IAddressBook, IAsset, IMultisigAddress, IQueueItem, ITransaction } from './utils/globalTypes';
import { networks } from './utils/constants/network_constants';

type Multisig = {
    address: string;
    proxy: string;
    signatories: Array<string>;
    threshold: number
}


export class Polkasafe extends Base {
    protected getHeaders() {
        if (!this.address || !this.network || !this.signature) {
            throw new Error(
                'Address, network, signature is required please use connect first'
            );
        }
        return handleHeaders({
            address: this.address,
            network: this.network,
            signature: this.signature,
        });
    }
    
    async connect(network: string, address: string, injector: Injected): Promise<{message:string, signature:string}> {
        if (!network || !address || !injector) {
            throw new Error(responseMessages.missing_params)
        }
        if(!networks[network]){
            throw new Error(responseMessages.invalid_params)
        }
        const { data: token } = await this.getConnectAddressToken(address)

        const signRaw = injector && injector.signer && injector.signer.signRaw;
        if (!signRaw) {
            throw new Error(
                'Signer not available'
            );
        }

        const { signature } = await signRaw({
            address: address,
            data: stringToHex(token),
            type: 'bytes'
        });

        this.signature = signature
        this.network = network
        this.address = address
        this.injector = injector;

        return { message: "success", signature: signature }
    }

    getConnectAddressToken(address: string): Promise<{ data: string, error:string|undefined}> {
        const { endpoint, headers, options } = getConnectAddressToken(address);
        return this.request(
            endpoint,
            { ...headers, ...handleHeaders({ address }) },
            options
        );
    }

    connectAddress(address: string): Promise<{data:IMultisigAddress, error:string |undefined}> {
        const { endpoint, headers, options } = connectAddress(
            address,
            this.network,
            this.signature
        );
        return this.request(endpoint, headers, options);
    }

    addToAddressBook(address: string, name: string): Promise<{data:Array<IAddressBook>, error:string|undefined}> {
        const { endpoint, headers, options } = addToAddressBook({
            name,
            addressToAdd: address,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    removeFromAddressBook(address: string, name: string): Promise<{data:Array<IAddressBook>, error:string | undefined}> {
        const { endpoint, headers, options } = removeFromAddressBook({
            name,
            addressToRemove: address,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    createMultisig(
        signatories: Array<string>,
        threshold: number,
        multisigName: string,
        type: 'wallet' | 'proxy',
        proxy?: string
    ): Promise<any> {
        const { endpoint, headers, options } = createMultisig({
            signatories,
            threshold,
            multisigName,
            type,
            address: this.address,
            proxy,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    getMultisigDataByAddress(multisigAddress: string): Promise<{data:IMultisigAddress, error:string|undefined}> {
        const { endpoint, headers, options } = getMultisigDataByMultisigAddress({
            multisigAddress,
            network: this.network,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    getTransactionsForMultisig(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<{data:Array<ITransaction>, error:string | undefined}> {
        const { endpoint, headers, options } = getTransactionsForMultisig({
            multisigAddress,
            page,
            limit,
            network: this.network,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    getAssetsForAddress(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<{data:Array<IAsset>, error:string |undefined}> {
        const { endpoint, headers, options } = getAssetsForAddress({
            multisigAddress,
            page,
            limit,
            network: this.network,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    getMultisigQueue(
        multisigAddress: string,
        page: number,
        limit: number
    ): Promise<{data:Array<IQueueItem>, error:string |undefined}> {
        const { endpoint, headers, options } = getMultisigQueue({
            multisigAddress,
            page,
            limit,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    renameMultisig(multisigAddress: string, name: string): Promise<{data:string,error:string|undefined}> {
        const { endpoint, headers, options } = renameMultisig({
            multisigAddress,
            name,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
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
            type,
        });
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    // Aleem TODO: currently not using, need to discuss
    getNotifications(): Promise<any> {
        const { endpoint, headers, options } = {
            endpoint: '/getNotifications',
            headers: this.getHeaders(),
            options: {},
        };
        return this.request(endpoint, headers, options);
    }

    deleteMultisig(multisigAddress: string): Promise<{data:string, error:string|undefined}> {
        const { endpoint, headers, options } = deleteMultisig(multisigAddress);
        return this.request(
            endpoint,
            { ...headers, ...this.getHeaders() },
            options
        );
    }

    async createProxy(
        multisigAddress: string,
        statusGrabber?: any
    ): Promise<any> {
        try {
            if(this.network === networks.ASTAR){
                throw new Error("Astar doesn't support proxy")
            }
            const { data } = await this.getMultisigDataByAddress(multisigAddress);
            if (!data) {
                return { error: 'Invalid multisig, make sure multisig is on chain' }
            }
            const emptyFunction = () => { };
            const payload = {
                signatories: data.signatories,
                address: this.address,
                threshold: data.threshold,
                recipientAddress: multisigAddress,
                injector: this.injector,
                statusGrabber: statusGrabber || emptyFunction,
            };
            const { error, status, message, transactionData } =
                await createProxyForWallet({
                    network: this.network,
                    data: payload,
                });
                
            if (!error && status === 200 && transactionData) {
                try {
                    const newTransactionData = {
                        amount_token: Number(
                            formatBnBalance(
                                transactionData.amount_token,
                                {
                                    numberAfterComma: 3,
                                    withThousandDelimitor: false,
                                    withUnit: false,
                                },
                                this.network
                            )
                        ),
                        block_number: transactionData.block_number,
                        callData: transactionData.callData,
                        callHash: transactionData.callHash,
                        from: transactionData.from,
                        network: transactionData.network,
                        note: transactionData.note,
                        to: transactionData.to,
                    };
                    const { endpoint, headers, options } = {
                        endpoint: '/addTransaction',
                        headers: this.getHeaders(),
                        options: {
                            body: JSON.stringify(newTransactionData),
                            method: 'POST',
                        },
                    };
                    this.request(
                        endpoint,
                        { ...headers, ...this.getHeaders() },
                        options
                    );
                } catch (e) {
                    console.log(e);
                }
                return { status: 200, message: message, data: transactionData };
            }
            return { status, error };
        }
        catch (err) {
            return { error: responseMessages.internal, message: err };
        }

    }

    async editMultisig(
        multisigAddress: string,
        newSignatories: Array<string>,
        newThreshold: number,
        statusGrabber: any
    ): Promise<any> {
        if(this.network === networks.ASTAR){
            throw new Error("Astar doesn't support proxy")
        }
        const response: any = {};
        const { data } = await this.getMultisigDataByAddress(multisigAddress);
        if (!data) {
            return { error: 'Invalid multisig, make sure multisig is on chain' }
        }
        const emptyFucn = () => { };
        const payload = {
            multisigAddress,
            oldSignatories: data.signatories,
            oldThreshold: data.threshold,
            newSignatories,
            newThreshold,
            proxyAddress: data.proxy,
            injector: this.injector,
            multisigName:data.name,
            statusGrabber: statusGrabber || emptyFucn,
        };
        const { addNewMultiResponse, removeOldMultiResponse, newMulti } =
            await editMultisigProxy({
                address: this.address,
                network: this.network,
                signature:this.signature,
                data: payload,
            });
        if (!addNewMultiResponse.error && addNewMultiResponse.status === 200) {
            const { status, transactionData } = addNewMultiResponse;

            const newTransactionData = {
                amount_token: Number(
                    formatBnBalance(
                        transactionData.amount_token,
                        {
                            numberAfterComma: 3,
                            withThousandDelimitor: false,
                            withUnit: false,
                        },
                        this.network
                    )
                ),
                block_number: transactionData.block_number,
                callData: transactionData.callData,
                callHash: transactionData.callHash,
                from: transactionData.from,
                network: transactionData.network,
                note: transactionData.note,
                to: transactionData.to,
            };
            const { endpoint, headers, options } = {
                endpoint: '/addTransaction',
                headers: this.getHeaders(),
                options: {
                    body: JSON.stringify(newTransactionData),
                    method: 'POST',
                },
            };
            this.request(endpoint, { ...headers, ...this.getHeaders() }, options);
            response.addNewMultiResponse = {
                status: status,
                data: transactionData,
            };
        }
        if (
            !removeOldMultiResponse.error &&
            removeOldMultiResponse.status === 200
        ) {
            const { status, transactionData } = removeOldMultiResponse;

            const newTransactionData = {
                amount_token: Number(
                    formatBnBalance(
                        transactionData.amount_token,
                        {
                            numberAfterComma: 3,
                            withThousandDelimitor: false,
                            withUnit: false,
                        },
                        this.network
                    )
                ),
                block_number: transactionData.block_number,
                callData: transactionData.callData,
                callHash: transactionData.callHash,
                from: transactionData.from,
                network: transactionData.network,
                note: transactionData.note,
                to: transactionData.to,
            };
            const { endpoint, headers, options } = {
                endpoint: '/addTransaction',
                headers: this.getHeaders(),
                options: {
                    body: JSON.stringify(newTransactionData),
                    method: 'POST',
                },
            };
            this.request(endpoint, { ...headers, ...this.getHeaders() }, options);
            response.removeOldMultiResponse = {
                status: status,
                data: transactionData,
            };
        }

        if (response.addNewMultiResponse && response.removeOldMultiResponse) {
            response.status = 200;
            response.newMulti = newMulti;
            return response;
        }
        return {
            status: 400,
            removeError: removeOldMultiResponse.error || responseMessages.internal,
            addError: addNewMultiResponse.error || responseMessages.internal,
        };
    }

    async transferFunds(
        recipientAddress: string,
        amount: number,
        senderAddress: string,
        multisig: Multisig,
        isProxy: boolean,
        statusGrabber: any
    ): Promise<any> {
        const emptyFucn = () => { };
        const payload = {
            recipientAddress,
            amount,
            senderAddress,
            injector: this.injector,
            multisig,
            isProxy,
            statusGrabber: statusGrabber || emptyFucn
        };
        const {
            status,
            error,
            message,
            data: transactionData,
        } = await transferFunds({
            network: this.network,
            data: payload,
        });
        if (!error && status === 200) {
            try {
                const newTransactionData = {
                    amount_token: Number(
                        formatBnBalance(
                            transactionData.amount,
                            {
                                numberAfterComma: 3,
                                withThousandDelimitor: false,
                                withUnit: false,
                            },
                            this.network
                        )
                    ),
                    block_number: transactionData.block_number,
                    callData: transactionData.callData,
                    callHash: transactionData.callHash,
                    from: transactionData.from,
                    network: transactionData.network,
                    note: transactionData.note,
                    to: transactionData.to,
                };
                const { endpoint, headers, options } = {
                    endpoint: '/addTransaction',
                    headers: this.getHeaders(),
                    options: {
                        body: JSON.stringify(newTransactionData),
                        method: 'POST',
                    },
                };
                this.request(
                    endpoint,
                    { ...headers, ...this.getHeaders() },
                    options
                );
            } catch (e) {
                console.log(e);
            }
            return { status: 200, message: message, data: transactionData };
        }
        return { status, error };
    }

    async approveTransaction(
        multisigAddress: string,
        callHash: string,
        callData: string,
        requestType: 'proxy' | 'wallet' | 'edit_proxy',
        statusGrabber: any
    ) {
        if(this.network === networks.ASTAR && (requestType === 'proxy' || requestType === 'edit_proxy')){
            throw new Error("Astar doesn't support proxy")
        }
        const senderAddress = this.address;
        const { data: multisig } = await this.getMultisigDataByAddress(
            multisigAddress
        );
        if (!multisig) {
            return { error: 'Invalid multisig, make sure multisig is on chain' }
        }
        const emptyFucn = () => { };
        const data = {
            senderAddress,
            injector: this.injector,
            multisig,
            callHash,
            callDataString: callData,
            requestType,
            statusGrabber: statusGrabber || emptyFucn
        };
        const {
            status,
            error,
            message,
            data: transactionData,
        } = await approveTransaction({
            signature: this.signature,
            address: this.address,
            network: this.network,
            data,
        });
        if (!error && status === 200) {
            if (transactionData) {
                if (requestType === 'wallet') {
                    const newTransactionData = {
                        amount_token: Number(
                            formatBnBalance(
                                transactionData.amount,
                                {
                                    numberAfterComma: 3,
                                    withThousandDelimitor: false,
                                    withUnit: false,
                                },
                                this.network
                            )
                        ),
                        block_number: transactionData.block_number,
                        callData: transactionData.callData,
                        callHash: transactionData.callHash,
                        from: transactionData.from,
                        network: transactionData.network,
                        note: transactionData.note,
                        to: transactionData.to,
                    };
                    const { endpoint, headers, options } = {
                        endpoint: '/addTransaction',
                        headers: this.getHeaders(),
                        options: {
                            body: JSON.stringify(newTransactionData),
                            method: 'POST',
                        },
                    };
                    this.request(
                        endpoint,
                        { ...headers, ...this.getHeaders() },
                        options
                    );
                }
                return { status: 200, message: message, data: transactionData };
            }
            return { status: 200, message: message };
        }
        return { status, error };
    }

    async cancelTransaction(
        multisigAddress: string,
        callHash: any,
        statusGrabber: any
    ) {
        const { data: multisig } = await this.getMultisigDataByAddress(
            multisigAddress
        );
        if (!multisig) {
            return { error: 'Invalid multisig, make sure multisig is on chain' }
        }
        const emptyFucn = () => { };
        const data = {
            injector: this.injector,
            multisig,
            callHash,
            statusGrabber: statusGrabber || emptyFucn
        };
        const { status, error, message } = await cancelTransaction({
            address: this.address,
            network: this.network,
            data,
        });
        if (!error && status === 200) {
            return { status: 200, message: message };
        }
        return { status, error };
    }

    async voteOnProposal(
        multisigAddress: string,
        proposalIndex: number,
        vote: number,
        statusGrabber: any,
        proposalType: any
    ) {
        
        if (proposalType !== 'referendum' && proposalType !== 'referendums_v2') {
            throw new Error(`Unsupported proposal type: ${proposalType}`)
        }

        const { data: multisig } = await this.getMultisigDataByAddress(
            multisigAddress
        );
        if (!multisig) {
            return { error: 'Invalid multisig, make sure multisig is on chain' }
        }
        const emptyFucn = () => { };
        const data = {
            injector: this.injector,
            multisig,
            statusGrabber: statusGrabber || emptyFucn,
            proposalIndex,
            proposalType,
            vote,
        };
        const { status, error, message } = await voteOnProposal({
            address: this.address,
            network: this.network,
            data,
        });
        if (!error && status === 200) {
            return { status: 200, message: message };
        }
        return { status, error };
    }

    async getAllMultisigByAddress(address: string, network: string) {
        try {
            const response = await getAllMultisigByAddress(
                address, network
            );
            return response;
        } catch (e) {
            return { status: 400, error: e };
        }
    }
}
