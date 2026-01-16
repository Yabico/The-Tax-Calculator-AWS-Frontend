import type {Account} from "../types.ts";

const AccountManager = ({ accounts }: { accounts: Account[] }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Connected Accounts</h3>
        <div className="space-y-3">
            {accounts.map(acc => (
                <div key={acc.accountId} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <div>
                        <p className="text-sm font-bold text-gray-800">{acc.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{acc.subtype} •••• {acc.mask}</p>
                    </div>
                    {/* You could add a 'Disconnect' button here later */}
                </div>
            ))}
        </div>
    </div>
);

export default AccountManager;