document.addEventListener('DOMContentLoaded', () => {
    const walletBOption = document.getElementById('walletBOption');
    const importWalletGroup = document.getElementById('importWalletGroup');
    const generateWalletGroup = document.getElementById('generateWalletGroup');
    const cycleOption = document.getElementById('cycleOption');
    const timesGroup = document.getElementById('timesGroup');
    const timeGroup = document.getElementById('timeGroup');
    const startBot = document.getElementById('startBot');
    const output = document.getElementById('output');
    const connectWalletA = document.getElementById('connectWalletA');
    const walletAInfo = document.getElementById('walletAInfo');
    const generateWalletB = document.getElementById('generateWalletB');
    const walletBInfo = document.getElementById('walletBInfo');

    let walletAAddress;
    let walletBAddress, walletBPrivateKey;

    walletBOption.addEventListener('change', () => {
        if (walletBOption.value === 'import') {
            importWalletGroup.style.display = 'block';
            generateWalletGroup.style.display = 'none';
        } else {
            importWalletGroup.style.display = 'none';
            generateWalletGroup.style.display = 'block';
        }
    });

    cycleOption.addEventListener('change', () => {
        if (cycleOption.value === 'times') {
            timesGroup.style.display = 'block';
            timeGroup.style.display = 'none';
        } else {
            timesGroup.style.display = 'none';
            timeGroup.style.display = 'block';
        }
    });

    connectWalletA.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                walletAAddress = accounts[0];
                walletAInfo.innerHTML = `Connected Wallet A: ${walletAAddress}`;
                // Optionally, add Tea Sepolia testnet to MetaMask
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x27FA', // Tea Sepolia chain ID (10218 in decimal)
                        chainName: 'Tea Sepolia',
                        rpcUrls: ['https://tea-sepolia.g.alchemy.com/public'],
                        blockExplorerUrls: ['https://sepolia.tea.xyz']
                    }]
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask and try again.');
        }
    });

    generateWalletB.addEventListener('click', () => {
        // Generate new wallet logic (mocked for front-end)
        walletBAddress = 'Generated_Wallet_Address';
        walletBPrivateKey = 'Generated_Private_Key';
        walletBInfo.innerHTML = `New Wallet B Address: ${walletBAddress}<br>Save this seed phrase securely: Generated_Seed_Phrase`;
    });

    startBot.addEventListener('click', async () => {
        const walletBOptionValue = walletBOption.value;
        const privateKey = document.getElementById('privateKey').value;
        const cycleOptionValue = cycleOption.value;
        const numCycles = document.getElementById('numCycles').value;
        const duration = document.getElementById('duration').value;
        const swapToken = document.getElementById('swapToken').value;

        if (walletBOptionValue === 'import') {
            walletBPrivateKey = privateKey;
            walletBAddress = 'Imported_Wallet_Address'; // Mocked for front-end
            walletBInfo.innerHTML = `Imported Wallet B Address: ${walletBAddress}`;
        }

        // Send data to backend
        try {
            const response = await fetch('/start-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    walletAAddress,
                    walletBAddress,
                    walletBPrivateKey,
                    cycleOptionValue,
                    numCycles,
                    duration,
                    swapToken
                })
            });

            const result = await response.json();
            output.innerHTML = `Bot started: ${result.message}`;
        } catch (error) {
            console.error('Error starting bot:', error);
            output.innerHTML = `Error starting bot: ${error.message}`;
        }
    });
});
