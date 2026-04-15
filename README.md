# E-Commerce API

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Tests](https://img.shields.io/badge/Tests-12%20passing-brightgreen)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-purple)

A RESTful API that powers a virtual shopping platform. Users can browse products, manage their cart, and place orders. Includes JWT-based authentication, role-based access control, and database transactions to ensure data integrity.

## Features

- JWT authentication with access & refresh tokens
- Role-based access control: `customer` and `admin`
- Product management with pagination and filtering
- Shopping cart with real-time stock management
- Order placement with atomic transactions (all-or-nothing)
- Pessimistic locking to prevent race conditions on stock
- Request validation with Joi
- Integration tests with Jest + Supertest (12 tests)
- CI/CD pipeline with GitHub Actions

## Tech Stack

| Layer         | Technology                     |
|---------------|-------------------------------|
| Runtime       | Node.js 18                    |
| Framework     | Express 4                     |
| Database      | PostgreSQL 16 + Sequelize ORM |
| Auth          | JSON Web Tokens (jsonwebtoken)|
| Validation    | Joi                           |
| Testing       | Jest + Supertest              |
| CI/CD         | GitHub Actions                |
| Container     | Docker                        |

## Project Structure

```
src/
├── config/
│   └── database.js         # Sequelize connection
├── controllers/
│   ├── authController.js   # register, login
│   ├── cartController.js   # add, remove, get cart
│   ├── categoryController.js
│   ├── orderController.js  # create, list orders
│   └── productController.js
├── middleware/
│   ├── authenticate.js     # JWT verification
│   ├── authorize.js        # role-based access
│   ├── errorHandler.js
│   └── validate.js         # Joi validation
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── index.js            # associations
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── tests/
│   ├── auth.test.js
│   └── product.test.js
├── validators/
│   ├── authValidator.js
│   ├── cartValidator.js
│   └── productValidator.js
├── app.js
└── server.js
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive tokens |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/products` | — | List products (paginated) |
| `GET` | `/api/v1/products/:id` | — | Get a single product |
| `POST` | `/api/v1/products` | admin | Create a product |
| `PUT` | `/api/v1/products/:id` | admin | Update a product |
| `DELETE` | `/api/v1/products/:id` | admin | Delete a product |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/categories` | — | List categories |
| `POST` | `/api/v1/categories` | admin | Create a category |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/cart` | customer | Get current cart |
| `POST` | `/api/v1/cart/items` | customer | Add item to cart |
| `DELETE` | `/api/v1/cart/items/:id` | customer | Remove item from cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/orders` | customer | Place an order |
| `GET` | `/api/v1/orders` | customer | List my orders |

### Health Check
```
GET /health → { "status": "ok" }
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=7d
```

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/YusufOztoprak/e-commerce-api.git
cd e-commerce-api

# 2. Install dependencies
npm install

# 3. Create .env file (see above)

# 4. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE ecommerce_db;"

# 5. Start development server
npm run dev
```

API will be available at `http://localhost:3000`.

## Running Tests

Tests use a separate database configured via `.env.test`.

```bash
npm test
```

| Test file | Coverage |
|-----------|----------|
| `auth.test.js` | Register, login (success, validation, duplicates) |
| `product.test.js` | CRUD, role enforcement, pagination |

## Key Design Decisions

- **Transactions**: Cart and order operations use Sequelize transactions — if any step fails, everything rolls back.
- **Pessimistic locking**: `SELECT FOR UPDATE` prevents race conditions when multiple users add the same product simultaneously.
- **Price snapshot**: `OrderItem.price` stores the price at purchase time, independent of future product price changes.
- **Stock management**: Stock is decremented on cart add and restored on cart remove — not at order time.