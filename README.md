# Online Orders System — Microservices

A Node.js microservices system for managing online orders, built with Express, MongoDB, RabbitMQ, and Docker.

---

## Project Structure

```
MVC/
├── docker-compose.yml
├── user-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── controllers/
│       │   └── user.controller.js
│       ├── routes/
│       │   └── user.routes.js
│       ├── services/
│       │   └── user.service.js
│       └── models/
│           └── User.js
├── order-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── controllers/
│       │   └── order.controller.js
│       ├── routes/
│       │   └── order.routes.js
│       ├── services/
│       │   ├── order.service.js
│       │   └── rabbitmq.service.js
│       └── models/
│           └── Order.js
└── notification-service/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app.js
        ├── index.js
        ├── controllers/
        │   └── notification.controller.js
        ├── routes/
        │   └── notification.routes.js
        ├── services/
        │   ├── mailer.service.js
        │   ├── notification.consumer.js
        │   └── notification.service.js
        └── models/
            └── Notification.js
```

---

## Architecture

This project follows a hybrid architecture:

- System level: Microservices architecture with event-driven communication.
- Service level: MVC pattern inside each microservice.

### MVC Mapping Per Service

- Model: Mongoose schemas in each `models/` folder.
- Controller: HTTP handlers in each `controllers/` folder.
- View: JSON API responses returned by controllers (API-style MVC).
- Routing and orchestration: Express routes in each `routes/` folder, business/integration logic in each `services/` folder.

<img width="1233" height="658" alt="444444444" src="https://github.com/user-attachments/assets/9d7fba04-0fae-467b-a2ab-eb7250c32785" />


### Services

| Service               | Port | Database        | Role                                          |
|-----------------------|------|-----------------|-----------------------------------------------|
| `user-service`        | 3001 | `usersdb`       | Manages user registration and lookup          |
| `order-service`       | 3002 | `ordersdb`      | Creates orders, publishes events to RabbitMQ  |
| `notification-service`| 3003 | `notificationsdb`| Consumes RabbitMQ events, stores notifications|
| `rabbitmq`            | 5672 | —               | Message broker (queue: `order-events`)        |

---

## Requirements Covered

- Each microservice has its own independent MongoDB database.
- `order-service` and `notification-service` communicate via RabbitMQ:
  - `order-service` **publishes** an `order.created` event on every new order.
  - `notification-service` **consumes** events and stores a notification record.
- All services and databases are containerized with Docker.
- The entire system runs with a single `docker compose up` command.
- Architectural pattern followed:
  - **Microservices + Event-Driven** at system level.
  - **MVC** within each individual microservice.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

---

## Run the System

From the `MVC` folder:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

To stop and remove all data volumes:

```bash
docker compose down -v
```

---

## API Reference

### User Service — `http://localhost:3001`

#### Health check
```
GET /health
```
Response:
```json
{ "service": "user-service", "status": "UP" }
```

#### Create a user
```
POST /users
Content-Type: application/json

{
  "name": "Mona",
  "email": "mona@example.com"
}
```
Response `201`:
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Mona",
  "email": "mona@example.com"
}
```

#### Get a user by ID
```
GET /users/:id
```

---

### Order Service — `http://localhost:3002`

#### Health check
```
GET /health
```

#### Create an order
```
POST /orders
Content-Type: application/json

{
  "userId": "<USER_ID>",
  "items": [
    { "productId": "P-100", "quantity": 2 }
  ],
  "totalAmount": 120
}
```
Response `201`:
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "items": [{ "productId": "P-100", "quantity": 2 }],
  "totalAmount": 120,
  "status": "CREATED"
}
```
> After creating an order, an `order.created` event is automatically published to RabbitMQ.

#### Get an order by ID
```
GET /orders/:id
```

---

### Notification Service — `http://localhost:3003`

#### Health check
```
GET /health
```

#### Get all notifications
```
GET /notifications
```
Response `200`:
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "type": "ORDER_CREATED",
    "recipient": "64f1a2b3c4d5e6f7a8b9c0d1",
    "message": "Order 64f1a2b3c4d5e6f7a8b9c0d2 created successfully. Total amount: 120",
    "status": "SENT"
  }
]
```

---

## RabbitMQ Management UI

Open `http://localhost:15672` in your browser.

- **Username:** `guest`
- **Password:** `guest`

Check the `order-events` queue to monitor published messages.

---

## End-to-End Test (PowerShell)

```powershell
# 1. Create a user
$user = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/users" `
  -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com"}'

# 2. Create an order using the returned user ID
$orderBody = @{
  userId = $user._id
  items = @(@{ productId = "P-100"; quantity = 2 })
  totalAmount = 120
} | ConvertTo-Json -Depth 4

$order = Invoke-RestMethod -Method Post -Uri "http://localhost:3002/orders" `
  -ContentType "application/json" -Body $orderBody

# 3. Wait for RabbitMQ event to be processed
Start-Sleep -Seconds 2

# 4. Verify notification was created
$notifications = Invoke-RestMethod http://localhost:3003/notifications
"USER_ID   = $($user._id)"
"ORDER_ID  = $($order._id)"
"NOTIFICATIONS = $($notifications.Count)"
"TYPE      = $($notifications[0].type)"
```

Expected output:
```
USER_ID   = <mongo id>
ORDER_ID  = <mongo id>
NOTIFICATIONS = 1
TYPE      = ORDER_CREATED
```
