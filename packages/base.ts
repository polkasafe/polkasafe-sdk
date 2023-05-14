type Config = {
    baseURL?: string;
    apiKey: string;
};

import { ApiPromise, WsProvider } from '@polkadot/api';

// Do something

export abstract class Base {
    private baseUrl: string;
    protected signature:any;
    protected network:any;
    protected address:any;
    protected api:any;
    
    constructor(config?: Config) {
        this.baseUrl =config?.baseURL ? config?.baseURL : "https://us-central1-polkasafe-a8042.cloudfunctions.net";
    }

    setSignature (signature:string,network:string, address:string):Promise<any>{
        this.signature = signature
        this.network = network
        this.address = address
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        return ApiPromise.create({ provider: wsProvider }).then((api)=>{
            this.api = api;
            return {message:'success'}
        }).catch((error)=>{
            throw new Error(error.message);
        })
    }

    protected request<T>(endpoint: string, reqHeaders?: any, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Accept":"application/json",
            "Content-Type": "application/json",
            ...reqHeaders
        };
        const config = {
            ...options,
            headers,
        };
        return fetch(url, config).then((response) => {
            return response.json();
        }).catch((error)=>{
            throw new Error(error.message);
        });
    }
}