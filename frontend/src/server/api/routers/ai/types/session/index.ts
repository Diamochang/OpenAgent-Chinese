// list

import type { Register } from "wagmi";

export type AiSessionList = AiSessionListItem[];
export interface AiSessionListItem {
	session_id: string;
	title: null | string;
}

// tree

export type AiSessionTree = AiSessionTreeItem[];

export type AiSessionTreeItemType = "folder" | "session";

export type TaskStatus =
	| "canceled"
	| "done"
	| "failed"
	| "idle"
	| "pending"
	| "running";

export interface AiSessionTreeItem<
	T extends AiSessionTreeItemType = AiSessionTreeItemType,
> {
	children: AiSessionTreeItem[];
	created_at: string;
	/** the higher, the first */
	order: number;
	parent_id: string;
	session_id: string;
	title: string;
	type: T;
}

// session

export interface AiSession {
	messages: AiSessionMessage[];
	title: null | string;
}

// message

export type AiSessionMessage =
	| AiSessionMessageForRoleAi
	| AiSessionMessageForRoleHuman;

export type OmitMessageId<T> = Omit<T, "message_id">;
export type AiSessionMessageForRoleHumanContent =
	OmitMessageId<AiSessionMessageChunkForRoleHuman>[];
export type AiSessionMessageForRoleAiContent =
	OmitMessageId<AiSessionMessageChunkForRoleAi>[];

export interface AiSessionMessageForRoleHuman {
	content: AiSessionMessageForRoleHumanContent;
	message_id: string;
	role: "human";
	send_at: string;
}

export interface AiSessionMessageForRoleAi {
	content: AiSessionMessageForRoleAiContent;
	message_id: string;
	role: "ai";
	send_at: string;
}

/// chunk

export type AiSessionMessageChunkForRoleAiType =
	| "natural_language"
	| "session_id"
	| "session_title"
	| "suggested_questions"
	| "tool";
export type AiSessionMessageChunkForRoleAi<
	T extends
		AiSessionMessageChunkForRoleAiType = AiSessionMessageChunkForRoleAiType,
> = T extends "natural_language"
	? AiSessionMessageNaturalLanguage
	: T extends "session_id"
		? AiSessionMessageSessionId
		: T extends "session_title"
			? AiSessionMessageSessionTitle
			: T extends "suggested_questions"
				? AiSessionMessageSuggestedQuestions
				: T extends "tool"
					? AiSessionMessageTool
					: never;

export type AiSessionMessageChunkForRoleHuman = AiSessionMessageNaturalLanguage;

export interface AiSessionMessageNaturalLanguage {
	block_id: string;
	body: string;
	message_id: string;
	type: "natural_language";
}

export interface AiSessionMessageOrderPlacementInquiry {
	block_id: string;
	message_id: string;
	type: "order_placement_inquiry";
}

export interface AiSessionMessageSuggestedQuestions {
	block_id: string;
	body: string[];
	message_id: string;
	type: "suggested_questions";
}

export interface AiSessionMessageTool<
	T extends AiSessionMessageToolType = AiSessionMessageToolType,
> {
	block_id: string;
	body: {
		input: AiSessionMessageToolInputBody<T>;
		output?: AiSessionMessageToolOutputBody<T>;
		// Frontend-only field, indicating whether the tool is expired or not.
		// Used to show the 'expired' badge for 'swap' and 'transfer' tools after the user re-opens the session.
		still_valid?: boolean;
		tool_name: T;
	};
	message_id: string;
	type: "tool";
}

export interface AiSessionMessageSessionTitle {
	block_id: null;
	body: string;
	message_id: string;
	type: "session_title";
}

export interface AiSessionMessageSessionId {
	block_id: null;
	body: string;
	message_id: string;
	type: "session_id";
}

export interface AiSessionMessageError {
	block_id: string;
	message_id: string;
	type: "error";
}

export interface AiSessionErrorResponse {
	code: number;
	data: any;
	message: string;
}

// Tool interfaces

export type AiSessionMessageToolType =
	| "account"
	| "collection"
	| "dapp"
	| "defi"
	| "executor"
	| "feed"
	| "network"
	| "swap"
	| "token"
	| "transfer";

export type AiSessionMessageToolInputBody<
	T extends AiSessionMessageToolType = AiSessionMessageToolType,
> = AiSessionMessageToolInputBody_Type_Content_Mapping[T];

export type AiSessionMessageToolOutputBody<
	T extends AiSessionMessageToolType = AiSessionMessageToolType,
> =
	| ({
			error: never;
	  } & AiSessionMessageToolOutputBody_Type_Content_Mapping[T])
	| AiSessionMessageToolOutputBody_Error;

/**
 * @private
 */
export type AiSessionMessageToolOutputBody_Type_Content_Mapping = {
	account: AiSessionMessageToolOutputBody_Account;
	collection: AiSessionMessageToolOutputBody_Collection;
	dapp: AiSessionMessageToolOutputBody_Dapp;
	defi: AiSessionMessageToolOutputBody_Defi;
	executor: AiSessionMessageToolOutputBody_Executor;
	feed: AiSessionMessageToolOutputBody_Feed;
	network: AiSessionMessageToolOutputBody_Network;
	swap: AiSessionMessageToolOutputBody_Swap;
	token: AiSessionMessageToolOutputBody_Token;
	transfer: AiSessionMessageToolOutputBody_Transfer;
};

/**
 * @private
 */
export type AiSessionMessageToolInputBody_Default =
	| {
			network: string;
			query_target: string;
	  }
	| object;

/**
 * @private
 */
export type AiSessionMessageToolInputBody_Type_Content_Mapping = {
	account: AiSessionMessageToolInputBody_Default;
	collection: AiSessionMessageToolInputBody_Default;
	dapp: AiSessionMessageToolInputBody_Default;
	defi: AiSessionMessageToolInputBody_Default;
	executor: AiSessionMessageToolInputBody_Default;
	feed: AiSessionMessageToolInputBody_Default;
	network: AiSessionMessageToolInputBody_Default;
	swap: AiSessionMessageToolInputBody_Swap;
	token: AiSessionMessageToolInputBody_Default;
	transfer: AiSessionMessageToolInputBody_Transfer;
};

/**
 * @example "list the most active users on ethereum"
 */
export interface AiSessionMessageToolOutputBody_Account {
	data: {
		items: {
			/** @example "0xae2fc483527b8ef99eb5d9b44875f005ba1fae13" */
			account_address: `0x${string}`;
			/** @example "ethereum" */
			network: string;
			/** @example "account" */
			type: string;
		}[];
	};
}

/**
 * @example "list some hot nfts"
 */
export interface AiSessionMessageToolOutputBody_Collection {
	data: {
		items: {
			/** @example "ethereum" */
			network: string;
			nft_collection_addr: `0x${string}`;
			nft_collection_average_price: number;
			nft_collection_average_price_1d: number;
			nft_collection_average_price_7d: number;
			nft_collection_average_price_24h: number;
			nft_collection_average_price_30d: number;
			nft_collection_average_price_change_1d: string;
			nft_collection_average_price_change_7d: string;
			nft_collection_average_price_change_30d: string;
			nft_collection_description: string;
			nft_collection_floor_price: number;
			nft_collection_highest_price: number;
			nft_collection_image: string;
			nft_collection_items_total: number;
			nft_collection_lowest_price_24h: number;
			nft_collection_market_cap: number;
			nft_collection_name: string;
			nft_collection_owners_total: number;
			nft_collection_sales: number;
			nft_collection_sales_1d: number;
			nft_collection_sales_7d: number;
			nft_collection_sales_24h: number;
			nft_collection_sales_30d: number;
			nft_collection_sales_change_1d: string;
			nft_collection_sales_change_7d: string;
			nft_collection_sales_change_30d: string;
			nft_collection_symbol: string;
			nft_collection_total_volume: number;
			nft_collection_volume_1d: number;
			nft_collection_volume_7d: number;
			nft_collection_volume_24h: number;
			nft_collection_volume_30d: number;
			nft_collection_volume_change_1d: string;
			nft_collection_volume_change_7d: string;
			nft_collection_volume_change_30d: string;
			/** @example "average_price" */
			query_target: string;
			/** @example "collection" */
			type: string;
		}[];
	};
}

/**
 * @example "what are the top dapps in ethereum?" - dapp
 * @example "list some defi projects having the highest tvl" - defi
 */
export interface AiSessionMessageToolOutputBody_Dapp {
	data: {
		items: {
			/** @example "ethereum" */
			network: string;
			/** @example "lens" */
			platform: string;
			query_target: string;
			/** @example "dapp" */
			type: string;
		}[];
	};
}

export interface AiSessionMessageToolOutputBody_Defi {
	data: {
		items: {
			dapp_defi_dex_volume_daily: number;
			dapp_defi_dex_volume_total: number;
			dapp_defi_tvl: number;
			/** @example "ethereum" */
			network: string;
			/** @example "OpenSea" */
			platform: string;
			query_target: string;
			token_name: string;
			token_symbol: string;
			/** @example "defi" */
			type: string;
		}[];
	};
}

/**
 * @example "what did vitalik.eth do recently?"
 */
export interface AiSessionMessageToolOutputBody_Feed {
	data: {
		items: {
			actions: {
				from: string;
				metadata: string;
				related_urls: string[];
				tag: string;
				to: string;
				type: string;
			}[];
			direction: string;
			feeValue: string;
			from: string;
			id: string;
			network: string;
			owner: string;
			status: string;
			tag: string;
			timestamp: number;
			to: string;
			type: string;
		}[];
	};
}

/**
 * @example "current block height?"
 * @example "the gas price?"
 */
export interface AiSessionMessageToolOutputBody_Network {
	data: {
		items: {
			/** @example "ethereum" */
			network: string;
			network_block_height: number;
			network_gas_price: number;
			network_tx_count: number;
			network_tx_total: number;
			query_target: string;
			token_market_cap: number;
			token_price: number;
			token_supply: number;
			token_volume: number;
			/** @example "network" */
			type: string;
		}[];
	};
}

/**
 * @example "what is the price of ETH?"
 * @example "list some popular tokens"
 */
export interface AiSessionMessageToolOutputBody_Token {
	data: {
		items: {
			/** @example "ethereum" */
			network: string;
			/** @example "token_price" */
			query_target: string;
			/** @example "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" */
			token_address: `0x${string}`;
			/** @example "Wrapped Bitcoin is an ERC20 Token on ethereum network." */
			token_description: string;
			/** @example "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857" */
			token_logo: string;
			/** @example 5561877106 */
			token_market_cap: number;
			/** @example -124619172.4139 */
			token_market_cap_change_24h: number;
			/** @example "Wrapped Bitcoin" */
			token_name: string;
			/** @example 33965 */
			token_price: number;
			/** @example -634.2932502833 */
			token_price_change_24h: number;
			/** @example 34911 */
			token_price_high_24h: number;
			/** @example 33761 */
			token_price_low_24h: number;
			/** @example 163854.39387565 */
			token_supply: number;
			/** @example "wbtc" */
			token_symbol: string;
			/** @example 5558319790 */
			token_tvl: number;
			/** @example 250152517 */
			token_volume_total: number;
			/** @example "token" */
			type: string;
		}[];
	};
}

export interface AiSessionMessageToolOutputBody_Error {
	data: never;
	error: {
		code: string;
		message: string;
	};
}

export interface AiSessionMessageToolOutputBody_Executor {
	data: {
		items: ExecutorDetail[];
	};
}

export interface AiSessionMessageToolOutputBody_Transfer {
	amount: string;
	chain_id: `${Register["config"]["chains"][number]["id"]}`;
	decimals: number;
	logoURI: string;
	task_id: string;
	/**
	 * could be ENS or address
	 */
	to_address: string;

	/**
	 * @example "ETH"
	 */
	token: string;
	/**
	 * @example "0x0000000000000000000000000000000000000000"
	 */
	token_address: string;
}

export interface AiSessionMessageToolOutputBody_Swap {
	amount: string;
	chain_id: `${Register["config"]["chains"][number]["id"]}`;
	from_token: string;
	from_token_address: `0x${string}`;
	to_token: string;
	to_token_address: `0x${string}`;
}

export interface AiSessionMessageToolInputBody_Swap {
	amount: string;
	from_token: string;
	to_token: string;
}

export interface AiSessionMessageToolInputBody_Transfer {
	amount: string;
	status: TaskStatus;
	to_address: `0x${string}`;
	token: string;
}
