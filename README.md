# Short Links Generator Node.js REST API

## Used libraries:
- Fastify
- Typescript
- Redis
- Zod

## How to run:

### Prerequisites:

- Node.js and npm installed: [Node.js Download](https://nodejs.org/en/download)
- Docker installed: [Docker Download](https://www.docker.com/products/docker-desktop/)
- Git installed: [Git Download](https://git-scm.com/downloads)

## Configuration Steps:

### 1. Clone the repository:
```bash
git clone https://github.com/alvarogonoring/url-shortening.git
cd url-shortening
```
### 2. Install Dependencies with npm:
```bash
npm install
```
### 3. Start the Docker Container for the Database:
```bash
docker-compose up
```
### 5. Start the Server:
```bash
npm run dev
```

## Available Endpoints:

To fetch any api call, just apoint the url for http://localhost:8080

### GET /api/links

### POST /api/links

Request Body:
```bash
{
  code: string;
  url: string;
}
```

### GET /:code

### GET /api/metrics
