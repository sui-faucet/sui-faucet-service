const fs = require('fs');
const path = require('path');

// Mock data generation script for MongoDB Compass import
const generateMockTransactions = (count = 1000) => {
    const transactions = [];
    const countries = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'BR', 'IN', 'CN', 'KR', 'SG', 'NL', 'SE', 'NO'];
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPad; CPU OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0',
        'PostmanRuntime/7.32.3',
        'curl/7.88.1'
    ];

    const errorMessages = [
        'Insufficient balance',
        'Transaction failed',
        'Network timeout',
        'Invalid wallet address',
        'Rate limit exceeded',
        'Gas estimation failed',
        'Object not found',
        'Invalid transaction format'
    ];

    // Generate wallet addresses
    const generateWalletAddress = () => {
        const chars = '0123456789abcdef';
        return '0x' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    // Generate IP addresses
    const generateIPAddress = () => {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    };

    // Generate transaction hash
    const generateTxHash = () => {
        const chars = '0123456789abcdef';
        return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    // Generate dates within the last 30 days
    const generateRandomDate = () => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
    };

    try {
        for (let i = 0; i < count; i++) {
            const isSuccess = Math.random() > 0.15; // 85% success rate
            const createdAt = generateRandomDate();
            const updatedAt = new Date(createdAt.getTime() + Math.random() * 60000); // 1 minute later

            const transaction = {
                _id: {
                    $oid: generateObjectId()
                },
                walletAddress: generateWalletAddress(),
                normalizedAmount: Math.floor(Math.random() * 10) + 1, // 1-10 SUI
                status: isSuccess ? 'success' : 'failed',
                country: countries[Math.floor(Math.random() * countries.length)],
                ipAddress: generateIPAddress(),
                userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
                responseTime: Math.floor(Math.random() * 5000) + 100, // 100-5100ms
                createdAt: {
                    $date: createdAt.toISOString()
                },
                updatedAt: {
                    $date: updatedAt.toISOString()
                }
            };

            if (isSuccess) {
                transaction.txHash = generateTxHash();
            } else {
                transaction.txHash = null;
                transaction.errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            }

            transactions.push(transaction);
        }
    } catch (error) {
        console.error('Error generating mock transactions:', error.message);
        throw error;
    }

    return transactions;
};

// Generate MongoDB ObjectId
const generateObjectId = () => {
    // MongoDB ObjectId is 24 characters (12 bytes) in hex format
    // Format: timestamp (4 bytes) + random (5 bytes) + counter (3 bytes)

    // Generate timestamp (4 bytes = 8 hex chars)
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');

    // Generate random bytes (5 bytes = 10 hex chars)
    const random = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // Generate counter (3 bytes = 6 hex chars)
    const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const objectId = timestamp + random + counter;

    // Validate the ObjectId
    if (objectId.length !== 24 || !/^[0-9a-f]{24}$/i.test(objectId)) {
        throw new Error(`Invalid ObjectId generated: ${objectId}`);
    }

    return objectId;
};

// Validate ObjectId format
const isValidObjectId = (objectId) => {
    return typeof objectId === 'string' &&
        objectId.length === 24 &&
        /^[0-9a-f]{24}$/i.test(objectId);
};

// Generate different datasets
const generateDatasets = () => {
    const datasets = {
        small: generateMockTransactions(100),
        medium: generateMockTransactions(1000),
        large: generateMockTransactions(5000),
        test: generateMockTransactions(50) // Small test dataset
    };

    return datasets;
};

// Create output directory
const outputDir = path.join(__dirname, 'mock-data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and save datasets
const datasets = generateDatasets();

Object.entries(datasets).forEach(([name, data]) => {
    const filename = path.join(outputDir, `transactions-${name}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Generated ${data.length} transactions in ${filename}`);
});

// Generate a sample document for reference
const sampleDocument = {
    _id: { $oid: generateObjectId() },
    walletAddress: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    normalizedAmount: 5,
    txHash: "abc123def456abc123def456abc123def456abc123def456abc123def456abc123",
    status: "success",
    errorMessage: null,
    country: "US",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    responseTime: 1250,
    createdAt: { $date: "2024-01-15T10:30:00.000Z" },
    updatedAt: { $date: "2024-01-15T10:30:01.000Z" }
};

fs.writeFileSync(
    path.join(outputDir, 'sample-document.json'),
    JSON.stringify(sampleDocument, null, 2)
);

console.log('\n📁 Mock data generated in scripts/mock-data/');
console.log('📄 Files created:');
console.log('  - transactions-test.json (50 records)');
console.log('  - transactions-small.json (100 records)');
console.log('  - transactions-medium.json (1,000 records)');
console.log('  - transactions-large.json (5,000 records)');
console.log('  - sample-document.json (1 record for reference)');
console.log('\n📋 Import Instructions for MongoDB Compass:');
console.log('1. Open MongoDB Compass');
console.log('2. Navigate to your database and collection');
console.log('3. Click "Add Data" → "Insert Document"');
console.log('4. Choose "Insert JSON"');
console.log('5. Copy and paste the content from any .json file');
console.log('6. Click "Insert"');
console.log('\n💡 Tip: Start with transactions-test.json for testing!'); 