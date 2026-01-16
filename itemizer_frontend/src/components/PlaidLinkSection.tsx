import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface Props {
    onLinkSuccess: (publicToken: string) => void;
}

const PlaidLinkSection: React.FC<Props> = ({ onLinkSuccess }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Initialize the Plaid Hook
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token) => {
            console.log("Success! Public Token received:", public_token);
            onLinkSuccess(public_token);
        },
        onExit: (err) => {
            if (err) console.error("Plaid Exit Error:", err);
            setLinkToken(null); // Reset for next attempt
        }
    });

    // 2. Automatically trigger the popup once the token is fetched and hook is ready
    useEffect(() => {
        if (linkToken && ready) {
            open();
            setIsLoading(false);
        }
    }, [linkToken, ready, open]);

    // 3. Click handler to call your Java Lambda
    const handleConnectClick = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://baee2wl750.execute-api.us-east-1.amazonaws.com/prod/link-token", {
                method: "POST"
            });

            const data = await response.json();
            console.log("Fetched Link Token:", data.link_token);

            setLinkToken(data.link_token);
        } catch (error) {
            console.error("Failed to fetch link token:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Verify Connection</h2>
                <p className="text-sm text-gray-500">Click to test your /link-token integration.</p>
            </div>
            <button
                onClick={handleConnectClick}
                disabled={isLoading}
                className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400"
            >
                {isLoading ? "Loading Plaid..." : "Connect Bank"}
            </button>
        </div>
    );
};

export default PlaidLinkSection;