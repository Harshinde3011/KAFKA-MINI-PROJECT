# Kafka Mini Project

This repository contains a simple event-driven microservices demo using Kafka. It has two services:

- `user-service`: Express + MongoDB API for user registration/login. Publishes a `user-registered` Kafka event after a successful registration.
- `mail-service`: Kafka consumer that listens for `user-registered` and sends a welcome email via Nodemailer.

## Architecture

1. Client calls `POST /api/user/register` on `user-service`.
2. `user-service` saves the user in MongoDB and publishes a Kafka event to topic `user-registered`.
3. `mail-service` consumes the event and sends a welcome email.

## Tech Stack

- Node.js (ESM)
- Express
- MongoDB + Mongoose
- Kafka (kafkajs)
- Nodemailer

## Services

### user-service

Location: `user-service/`

Endpoints:

- `POST /api/user/register`
- `POST /api/user/login`

On successful registration, the service publishes a message to Kafka with this structure:

```json
{
  "event": "USER_RESISTERED",
  "data": {
    "userId": "...",
    "username": "...",
    "email": "...",
    "mobileNo": "..."
  },
  "timestamp": "Mon Feb 09 2026"
}
```

### mail-service

Location: `mail-service/`

Consumes from:

- Topic: `user-registered`
- Group: `mail-group`

On receiving the event, it sends a welcome email.

## Environment Variables

Create a `.env` file in each service directory with the following keys.

### user-service/.env

- `MONGODB_URI` — MongoDB connection string
- `ACCESS_TOKEN_KEY` — JWT secret
- `PORT` — Optional (default `3001`)

### mail-service/.env

- `MAIL_HOST` — SMTP host (default `smtp.gmail.com`)
- `MAIL_USER` — SMTP username
- `MAIL_PASS` — SMTP password
- `PORT` — Optional (SMTP port, default `587`)

## Setup

1. Start Kafka and Zookeeper locally (or via Docker).
2. Ensure MongoDB is running.
3. Install dependencies in each service.

```bash
cd user-service
npm install

cd ../mail-service
npm install
```

## Docker Compose

If you want Kafka + Zookeeper + MongoDB locally:

```bash
docker compose up -d
```

## Docker Commands to run containers

```bash
ZOOKEEPER = docker run -p 2181:2181 zookeeper;

KAFKA = docker run -d --name kafka \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=<YOUR_IP>:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://<YOUR_IP>:9092 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka
```

Set your Mongo connection in `user-service/.env` like:

```bash
MONGODB_URI=mongodb://localhost:27017/kafka-mini
```

## Run

Start each service in its own terminal:

```bash
cd user-service
npm run start
```

```bash
cd mail-service
node index.js
```

## Usage Examples

Register:

```bash
curl -X POST http://localhost:3001/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"harsh","email":"harsh@example.com","password":"Pass@123","mobileNo":"9999999999"}'
```

Login:

```bash
curl -X POST http://localhost:3001/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"mobileNo":"9999999999","password":"Pass@123"}'
```

## Notes

- Kafka broker is configured at `localhost:9092` in both services.
- The `mail-service` logs the raw Kafka message before processing.
- If Kafka auto-topic creation is disabled, create the `user-registered` topic manually.

## Project Status

Core flow implemented: register user -> publish Kafka event -> consume event -> send email.
