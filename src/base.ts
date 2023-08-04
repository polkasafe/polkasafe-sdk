export abstract class Base {
    private baseUrl: string;
    signature: string;
    network: string;
    address: string;
    injector: any;
    
    constructor() {
        this.baseUrl = "https://us-central1-polkasafe-a8042.cloudfunctions.net";
    }

    protected request<T>(endpoint: string, reqHeaders?: any, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...reqHeaders
        };
        const config = {
            ...options,
            headers,
        };
        return fetch(url, config).then((response) => {
            return response.json();
        }).catch((error) => {
            throw new Error(error.message);
        });
    }
}