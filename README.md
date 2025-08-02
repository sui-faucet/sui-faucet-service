# Sui Faucet Service

A robust and scalable faucet service for the Sui blockchain, built with NestJS. This service provides secure and efficient distribution of testnet SUI tokens with advanced features including rate limiting, analytics, and comprehensive monitoring.

## 🚀 Features

- **Secure Token Distribution**: Automated SUI token distribution with transaction validation
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Geolocation Tracking**: IP-based location tracking for analytics
- **Comprehensive Analytics**: Detailed transaction analytics and reporting
- **Authentication & Authorization**: JWT-based authentication with role-based access
- **Health Monitoring**: Built-in health checks for all dependencies
- **API Documentation**: Auto-generated Swagger documentation
- **Redis Caching**: High-performance caching layer
- **MongoDB Storage**: Persistent transaction and user data storage
- **RabbitMQ Integration**: Message queue for async processing
- **Docker Support**: Containerized deployment ready

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Blockchain**: Sui SDK (@mysten/sui)
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Package Manager**: pnpm
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js 20+
- pnpm
- MongoDB
- Redis
- RabbitMQ (optional)
- Docker (for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone 
cd sui-faucet-service
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
```

### 4. Start Development Server

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

### 5. Access the Application

- **API**: http://localhost:3000/api
- **Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/api/health

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## 📚 API Documentation

The API documentation is automatically generated using Swagger and available at `/docs` when the application is running.

## 🏗 Project Structure

```
src/
├── analytics/          # Analytics and reporting
├── auth/              # Authentication and authorization
├── common/            # Shared utilities and middleware
├── health/            # Health checks
├── redis/             # Redis service
├── rabbit_mq/         # RabbitMQ integration
├── sui/               # Core faucet functionality
├── system_setting/    # System configuration
├── users/             # User management
└── main.ts           # Application entry point
```

## 🐳 Docker Deployment

### Build the Image

```bash
docker build -t sui-faucet-service .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Maintain code documentation
- Follow the existing code style

## 🧹 Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Type checking
pnpm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the health check endpoint at `/api/health`

## 🔄 Version History

- **v0.0.1** - Initial release with core faucet functionality
- Basic SUI token distribution
- Rate limiting and analytics
- Authentication and authorization
- Health monitoring