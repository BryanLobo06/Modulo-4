# Customer and Invoice Management System

A complete customer, transaction, invoice, and statement management system with a REST API and automatic data upload from CSV files.

## Features

- **Full CRUD** for all entities (Customers, Transactions, Invoices, Statements)
- **Automatic data loading** from CSV files
- **REST API** with well-structured endpoints
- **MySQL database** with optimized relationships and indexes
- **Special queries** for data analysis

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

**Install dependencies**
```bash
npm install
```

**Configure the database**
- Create a MySQL database named `expertsoft`
- Run the configuration SQL script

**Configure environment variables**
- Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_NAME=expertsoft
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000

**Load initial data**
npm run seed

**Start the server**
npm start

## Data Structure

### Client (Clients)
- `id`: Auto-incremental ID
- `name_client`: Client name
- `identificacion`: Unique ID
- `address`: Address
- `phone`: Phone number
- `email`: Email address

### Transaction (Transactions)
- `id`: Auto-incremental ID
- `id_transaction`: Unique transaction ID
- `date_and_time`: Date and time
- `amount`: Amount
- `transaction_type`: Transaction type

### Invoiced (Invoices)
- `id`: Auto-incremental ID
- `invoice_numbe`: Invoice number
- `platform`: Platform (Nequi, Daviplata, etc.)
- `billing_period`: Billing period
- `invoiced_amount`: Invoiced amount
- `amount_paid`: Amount paid
- `identification`: Client ID (FK)

### State (States)
- `id`: Auto-incrementing ID
- `transaction_status`: Transaction status

## API Endpoints

### Clients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | Get all clients |
| GET | `/clients/:id` | Get client by ID |
| POST | `/clients` | Create new client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get transaction by ID |
| POST | `/transactions` | Create new transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | Get all invoices |
| GET | `/invoices/:invoice_number` | Get invoice by number |
| POST | `/invoices` | Create new invoice |
| PUT | `/invoices/:invoice_number` | Update invoice |
| DELETE | `/invoices/:invoice_number` | Delete invoice |

### Statuses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/states` | Get all states |
| GET | `/states/:id` | Get state by ID |
| POST | `/states` | Create new state |
| PUT | `/states/:id` | Update state |
| DELETE | `/states/:id` | Delete state |

### Special Queries

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients/:id/invoices` | Invoices for a specific client |
| GET | `/invoices/unpaid` | Unpaid invoices |
| GET | `/transactions/type/:type` | Transactions by type |

## Usage Examples

### Create a new client
```bash
POST http://localhost:3000/clients \
  "Content-Type: application/json" \
  '{
    "name_client": "John Smith",
    "id": "12345678",
    "address": "123rd Street #45-67",
    "phone": "3001234567",
    "email": "juan@email.com"
  }'
```
### Get all unpaid invoices
```bash
http://localhost:3000/invoices/unpaid
```

### Update a transaction
```bash
PUT http://localhost:3000/transactions/TXN001 \
"Content-Type: application/json" \
'{
"date_and_time": "2024-08-13 10:00:00",
"amount": 50000,
"transaction_type": "Invoice Payment"
}'
```

## Project Structure

```
prueba/
├── docs/ # script sql and entity relationship model
├── server/
│ ├── data/ # CSV Files
│ │ ├── client.csv
│ │ ├── transaction.csv
│ │ ├── invoiced.csv
│ │ └── state.csv
│ ├── seeders/ # Data Load Scripts
│ │ ├── load_client.js
│ │ ├── load_transaction.js
│ │ ├── load_invoiced.js
│ │ ├── load_state.js
│ │ └── run_seeders.js
│ ├── conexiondb.js # Database configuration
├── index.js # Main server
├── package.json
├── .env # Environment variables
└── README.md
```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start in development mode
- `npm run seed` - Load data from CSV

## Important Notes

1. **Database**: Make sure MySQL is running before starting the server
2. **Environment Variables**: Correctly configure the `.env` file with your credentials
3. **Initial Data**: Run seeders only once to avoid duplicate data
4. **Relationships**: Invoices are related to clients by ID

## Troubleshooting

### Database Connection Error
- Verify that MySQL is running
- Confirm the credentials in the `.env` file
- Make sure the `expertsoft` database exists

### Error Loading CSV Data
- Verify that the CSV files are in `server/data/`
- Confirm that the tables are Created successfully
- Check for duplicate data

### Port in use
- Change the port in the `.env` file
- Or kill the process using port 3000
