# Mock Data Generation

This directory contains scripts to generate mock transaction data for testing the analytics functionality.

## Quick Start

Generate mock data with the npm script:

```bash
npm run generate:mock-data
```

Or run the script directly:

```bash
node scripts/generate-mock-data.js
```

## Generated Files

The script creates several JSON files in `scripts/mock-data/`:

- **`transactions-test.json`** (50 records) - Small dataset for quick testing
- **`transactions-small.json`** (100 records) - Small dataset for development
- **`transactions-medium.json`** (1,000 records) - Medium dataset for testing
- **`transactions-large.json`** (5,000 records) - Large dataset for performance testing
- **`sample-document.json`** (1 record) - Single document for reference

## Data Structure

Each transaction document follows this structure:

```json
{
  "_id": { "$oid": "..." },
  "walletAddress": "0x...",
  "normalizedAmount": 5,
  "txHash": "abc123...",
  "status": "success",
  "errorMessage": null,
  "country": "US",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "responseTime": 1250,
  "createdAt": { "$date": "2024-01-15T10:30:00.000Z" },
  "updatedAt": { "$date": "2024-01-15T10:30:01.000Z" }
}
```

## Import into MongoDB Compass

### Method 1: Insert JSON (Recommended)

1. Open MongoDB Compass
2. Navigate to your database and collection
3. Click "Add Data" → "Insert Document"
4. Choose "Insert JSON"
5. Copy and paste the content from any `.json` file
6. Click "Insert"

### Method 2: Import File

1. Open MongoDB Compass
2. Navigate to your database and collection
3. Click "Add Data" → "Import File"
4. Choose "JSON" format
5. Select the `.json` file
6. Click "Import"

## Data Characteristics

The generated data includes:

- **Success Rate**: 85% successful transactions, 15% failed
- **Geographic Distribution**: 15 different countries
- **User Agents**: 8 different browser/device types
- **Error Messages**: 8 different error types for failed transactions
- **Response Times**: 100-5100ms range
- **Amounts**: 1-10 SUI per transaction
- **Time Range**: Last 30 days

## Testing Analytics Endpoints

With the mock data imported, you can test these analytics endpoints:

```bash
# Transaction statistics
GET /analytics/stats?days=7

# Top request sources
GET /analytics/top-sources?days=7&limit=10

# Geographic distribution
GET /analytics/geographic?days=7

# System performance
GET /analytics/performance?days=7

# Transaction history
GET /analytics/history?limit=50

# Wallet activity
GET /analytics/wallet/0x1234...?days=30
```

## Customization

To modify the data generation, edit `scripts/generate-mock-data.js`:

- Change success rate: Modify the `Math.random() > 0.15` condition
- Add more countries: Extend the `countries` array
- Add more user agents: Extend the `userAgents` array
- Add more error messages: Extend the `errorMessages` array
- Change time range: Modify the `generateRandomDate()` function
- Change amount range: Modify the `normalizedAmount` generation

## Troubleshooting

### Import Issues

If you encounter import issues:

1. **Invalid JSON**: Ensure the file is valid JSON (no trailing commas)
2. **Date Format**: MongoDB Compass expects `$date` format for dates
3. **ObjectId Format**: MongoDB Compass expects `$oid` format for ObjectIds

### Performance

For large datasets:
- Start with `transactions-test.json` (50 records)
- Gradually increase to larger datasets
- Monitor MongoDB performance during import

## Security Note

⚠️ **Important**: This mock data is for testing only. Never use this data in production environments as it contains predictable patterns and fake wallet addresses. 