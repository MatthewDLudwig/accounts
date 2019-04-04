import { RpcServer } from '@nimiq/rpc';
import { BrowserDetection } from '@nimiq/utils';
import { WalletStore } from '@/lib/WalletStore';
import { WalletInfoEntry } from '@/lib/WalletInfo';
import CookieJar from '@/lib/CookieJar';
import Config from 'config';

class IFrameApi {
    public static run() {
        const rpcServer = new RpcServer(Config.privilegedOrigins[0]);

        // Register handlers
        rpcServer.onRequest('list', IFrameApi.list);

        rpcServer.init();
    }

    public static async list(): Promise<WalletInfoEntry[]> {
        let wallets: WalletInfoEntry[];
        if (BrowserDetection.isIOS() || BrowserDetection.isSafari()) {
            wallets = await CookieJar.eat();
        } else {
            wallets = await WalletStore.Instance.list();
        }
        if (wallets.length > 0) {
            return wallets.filter((wallet) => !wallet.keyMissing);
        }

        // If no wallets exist, see if the Keyguard has keys
        const client = new (await import('@nimiq/keyguard-client')).KeyguardClient();
        const hasKeys = await client.hasKeys();
        if (hasKeys.success) {
            throw new Error('WALLETS_LOST');
        }

        // If no keys exist, check for legacy accounts
        const hasLegacyAccounts = await client.hasLegacyAccounts();
        if (hasLegacyAccounts.success) {
            throw new Error('MIGRATION_REQUIRED');
        }

        return [];
    }
}

IFrameApi.run();
