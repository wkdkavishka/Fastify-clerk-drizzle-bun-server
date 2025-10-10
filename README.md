# Fastify Clerk Drizzle Server

A high-performance REST API server built with Fastify, Drizzle ORM, and optimized for Bun runtime. This project provides a production-ready foundation for building scalable backend applications with modern tooling and best practices.

## Features

- **Fast & Efficient**: Built on Fastify framework with Bun runtime for maximum performance
- **Type-Safe**: Full TypeScript support with strict type checking
- **Database**: Drizzle ORM with PostgreSQL for type-safe database operations
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Security**: Built-in helmet, CORS, and rate limiting
- **Validation**: JSON Schema validation with custom error messages using AJV
- **Production Ready**: Optimized build process with minification and bundling

## Tech Stack

- **Runtime**: Bun
- **Framework**: Fastify
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: JSON Schema with AJV
- **Documentation**: Swagger/OpenAPI
- **Build Tools**: TypeScript, tsup, tsc-alias

## Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher
- PostgreSQL database
- Node.js 22+ (for compatibility)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fastify-clerk-drizzle-server
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=dev
PORT=3000
HOST=localhost
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

## Development

Start the development server with hot reload:
```bash
bun run dev
```

The server will start at `http://localhost:3000` with the following endpoints:
- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`

## Database Management

Generate migrations:
```bash
bun run db:generate
```

Push schema changes to database:
```bash
bun run db:push
```

Open Drizzle Studio (database GUI):
```bash
bun run db:studio
```

## Building for Production

Build the optimized production bundle:
```bash
bun run build:prod
```

This command will:
1. Compile TypeScript to JavaScript
2. Resolve path aliases
3. Bundle and minify code with tsup
4. Create a production-ready `dist-prod` directory
5. Generate production `package.json`
6. Copy environment variables

## Running in Production

After building, navigate to the production directory and start:
```bash
cd dist-prod
bun install --production
bun run start
```

## Project Structure

```
fastify-clerk-drizzle-server/
├── src/
│   ├── configs/           # Configuration files
│   │   ├── db.config.ts   # Database connection
│   │   └── env.config.ts  # Environment validation
│   ├── routes/            # API route handlers
│   │   └── login.route.ts
│   ├── schemas/           # JSON schemas for validation
│   │   └── login.schema.ts
│   ├── services/          # Business logic
│   │   └── login.service.ts
│   └── server.ts          # Main application entry
├── scripts/
│   └── postbuild.mjs      # Production build script
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## API Documentation

Once the server is running, visit `http://localhost:3000/docs` to explore the interactive Swagger UI documentation.

### Example Endpoint

**POST** `/login/test`

Request body:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "birthdate": "1990-01-01"
}
```

Response:
```json
{
  "accessToken": "mocked-access-token",
  "refreshToken": "mocked-refresh-token",
  "user": {
    "id": "mocked-user-id",
    "email": "mocked-user-email"
  }
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `dev` | No |
| `PORT` | Server port | `3000` | Yes |
| `HOST` | Server host | `localhost` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |

## Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Compile TypeScript
- `bun run build:prod` - Build optimized production bundle
- `bun run db:generate` - Generate database migrations
- `bun run db:push` - Apply migrations to database
- `bun run db:studio` - Open Drizzle Studio
- `bun run format` - Format code with Prettier
- `bun run organize-imports` - Organize TypeScript imports

## Security Features

- **Helmet**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: Strict JSON schema validation
- **SQL Injection Protection**: Drizzle ORM prevents SQL injection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

W.K.D.Kavishka

## Acknowledgments

- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime