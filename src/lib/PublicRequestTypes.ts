import { WalletType, WalletInfoEntry } from './WalletInfo';

export interface BasicRequest {
    appName: string;
}

export interface SimpleRequest extends BasicRequest {
    accountId: string;
}

export interface SimpleResult {
    success: true;
}

export type ListResult = WalletInfoEntry[];

export interface SignTransactionRequest extends SimpleRequest {
    sender: string;
    recipient: string;
    recipientType?: Nimiq.Account.Type;
    value: number;
    fee?: number;
    extraData?: Uint8Array;
    flags?: number;
    validityStartHeight: number; // FIXME To be made optional when accounts manager has its own network
}

export interface CheckoutRequest extends BasicRequest {
    shopLogoUrl?: string;
    recipient: string;
    recipientType?: Nimiq.Account.Type;
    value: number;
    fee?: number;
    extraData?: Uint8Array;
    flags?: number;
    validityDuration?: number;
}

export interface SignedTransaction {
    serializedTx: string; // HEX
    hash: string; // HEX

    raw: {
        signerPublicKey: Uint8Array;
        signature: Uint8Array;

        sender: string; // Userfriendly address
        senderType: Nimiq.Account.Type;
        recipient: string; // Userfriendly address
        recipientType: Nimiq.Account.Type;
        value: number; // Luna
        fee: number; // Luna
        validityStartHeight: number;
        extraData: Uint8Array;
        flags: number;
        networkId: number;
    };
}

export interface SignMessageRequest extends BasicRequest {
    accountId?: string;
    signer?: string;
    message: string | Uint8Array;
}

export interface SignedMessage {
    signer: string; // Userfriendly address
    signerPublicKey: Uint8Array;
    signature: Uint8Array;
    message: string | Uint8Array;
}

export interface Address {
    address: string; // Userfriendly address
    label: string;
}

export interface Account {
    accountId: string;
    label: string;
    type: WalletType;
    fileExported: boolean;
    wordsExported: boolean;
    addresses: Address[];
}

export interface ExportRequest extends SimpleRequest {
    fileOnly?: boolean;
    wordsOnly?: boolean;
}

export interface ExportResult {
    fileExported: boolean;
    wordsExported: boolean;
}

export interface RenameRequest extends SimpleRequest {
    address?: string; // Userfriendly address
}

export type RpcRequest = SignTransactionRequest
                       | CheckoutRequest
                       | BasicRequest
                       | SimpleRequest
                       | RenameRequest
                       | SignMessageRequest
                       | ExportRequest;

export type RpcResult = SignedTransaction
                      | Account
                      | SimpleResult
                      | Address
                      | SignedMessage
                      | ListResult
                      | ExportResult;
