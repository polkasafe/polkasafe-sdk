export interface ChainProperties {
	[network: string]: {
		ss58Format: number;
		tokenDecimals: number;
		tokenSymbol: string;
		blockTime: number;
		keyringType?: KeypairType;
		rpcEndpoint: string;
	};
}

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';
export interface VerifyResult {
    crypto: 'none' | KeypairType;
    isValid: boolean;
    isWrapped: boolean;
    publicKey: Uint8Array;
}


export const networks = {
	ASTAR: 'astar',
	POLKADOT: 'polkadot',
	KUSAMA: 'kusama',
	WESTEND: 'westend',
	ROCOCO: 'rococo'
};

export const chainProperties: ChainProperties = {
	[networks.POLKADOT]: {
		blockTime: 6000,
		keyringType: 'sr25519',
		rpcEndpoint: 'wss://rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: 'DOT'
	},
	[networks.KUSAMA]: {
		blockTime: 6000,
		keyringType: 'ed25519',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: 'KSM'
	},
	[networks.WESTEND]: {
		blockTime: 6000,
		keyringType: 'sr25519',
		rpcEndpoint: 'wss://westend-rpc.dwellir.com',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: 'WND'
	},
	[networks.ROCOCO]: {
		blockTime: 6000,
		keyringType: 'sr25519',
		rpcEndpoint: 'wss://rococo-rpc.polkadot.io',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: 'ROC'
	},
	[networks.ASTAR]: {
		blockTime: 12000,
		rpcEndpoint: 'wss://astar-rpc.n.dwellir.com',
		ss58Format: 5,
		tokenDecimals: 18,
		tokenSymbol: 'ASTR'
	}
};
