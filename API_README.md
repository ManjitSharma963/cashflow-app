# CashFlow App API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication API Endpoints

### 1. User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "shopName": "John's General Store",
  "mobile": "9876543210",
  "address": "123 Main Street, City"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "shopName": "John's General Store",
    "mobile": "9876543210",
    "address": "123 Main Street, City",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "shopName": "Johns General Store",
    "mobile": "9876543210",
    "address": "123 Main Street, City"
  }'
```

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "shopName": "John's General Store",
    "mobile": "9876543210",
    "address": "123 Main Street, City"
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 3. Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "shopName": "John's General Store",
  "mobile": "9876543210",
  "address": "123 Main Street, City",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8080/api/auth/profile" \
  -H "Authorization: Bearer <your-token>"
```

### 4. Update User Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "shopName": "John's Updated Store",
  "mobile": "9876543211",
  "address": "456 New Street, City"
}
```

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/auth/profile" \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "shopName": "Johns Updated Store",
    "mobile": "9876543211",
    "address": "456 New Street, City"
  }'
```

### 5. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**
```bash
curl -X POST "http://localhost:8080/api/auth/logout" \
  -H "Authorization: Bearer <your-token>"
```

## Authentication Flow

### 1. Registration Flow
1. User fills registration form with shop details
2. Frontend calls `/auth/register` endpoint
3. Backend validates data and creates user account
4. Backend returns JWT token and user data
5. Frontend stores token in localStorage
6. User is automatically logged in

### 2. Login Flow
1. User enters email and password
2. Frontend calls `/auth/login` endpoint
3. Backend validates credentials
4. Backend returns JWT token and user data
5. Frontend stores token in localStorage
6. User gains access to protected routes

### 3. Protected Routes
All customer and transaction endpoints require authentication:
- Include `Authorization: Bearer <token>` header in all requests
- Token is automatically added by the frontend API service
- Invalid/expired tokens return 401 Unauthorized

### 4. Token Management
- Tokens are stored in localStorage
- Tokens should be included in all API requests
- Frontend automatically handles token refresh
- Logout clears token from localStorage

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Access denied. Token required",
  "error": "NO_TOKEN"
}
```

## Frontend Integration

### Using AuthContext
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />;

  return <div>Welcome, {user.name}!</div>;
}
```

### API Calls with Authentication
```javascript
import { authAPI, customerAPI } from '../services/api';

// Login
const loginResult = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get customers (automatically includes auth header)
const customers = await customerAPI.getAllCustomers();

// Update profile
const updatedUser = await authAPI.updateProfile({
  name: 'New Name',
  shopName: 'New Shop Name'
});

// Logout
await authAPI.logout();
```

## Security Features

### Password Requirements
- Minimum 6 characters
- Frontend validation with user feedback
- Backend validation and hashing

### Token Security
- JWT tokens with expiration
- Secure token storage in localStorage
- Automatic token cleanup on logout

### Data Protection
- All customer and transaction data is user-specific
- API endpoints filter data by authenticated user
- No cross-user data access

### Input Validation
- Email format validation
- Mobile number format validation
- Required field validation
- XSS protection on all inputs

## Multi-User Support

### User Isolation
- Each shopkeeper has their own customer database
- Transactions are isolated per user
- No data sharing between different shop accounts

### Shop Management
- Each user account represents one shop
- Shop name displayed in navigation
- User profile includes shop information

### Scalability
- Supports unlimited number of shopkeepers
- Each shop can have unlimited customers
- Efficient data querying with user-based filtering

## Transaction API Endpoints

### 1. Get All Transactions
**GET** `/transactions`

**Query Parameters:**
- `customerId` - Filter by customer ID
- `type` - Filter by transaction type (CREDIT, PAYMENT, ADJUSTMENT)
- `status` - Filter by status (PENDING, COMPLETED, CANCELLED)
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)

**Examples:**
```bash
# Get all transactions
curl -X GET "http://localhost:8080/api/transactions"

# Filter by customer ID
curl -X GET "http://localhost:8080/api/transactions?customerId=CUST001"

# Filter by transaction type
curl -X GET "http://localhost:8080/api/transactions?type=CREDIT"
curl -X GET "http://localhost:8080/api/transactions?type=PAYMENT"
curl -X GET "http://localhost:8080/api/transactions?type=ADJUSTMENT"

# Filter by status
curl -X GET "http://localhost:8080/api/transactions?status=PENDING"
curl -X GET "http://localhost:8080/api/transactions?status=COMPLETED"
curl -X GET "http://localhost:8080/api/transactions?status=CANCELLED"

# Filter by date range
curl -X GET "http://localhost:8080/api/transactions?startDate=2024-01-01&endDate=2024-01-31"

# Combined filters
curl -X GET "http://localhost:8080/api/transactions?customerId=CUST001&type=CREDIT&status=PENDING"
```

### 2. Get Transaction by ID
**GET** `/transactions/{id}`

**Example:**
```bash
curl -X GET "http://localhost:8080/api/transactions/1"
curl -X GET "http://localhost:8080/api/transactions/123"
```

### 3. Create Transaction
**POST** `/transactions`

**Request Body:**
```json
{
  "customerId": "CUST001",
  "customerName": "John Doe",
  "transactionType": "CREDIT",
  "amount": 150.00,
  "description": "Grocery items",
  "date": "2024-01-15",
  "status": "PENDING",
  "paymentMethod": "CASH",
  "notes": "Customer will pay later"
}
```

**Examples:**
```bash
# Create CREDIT transaction
curl -X POST "http://localhost:8080/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "John Doe",
    "transactionType": "CREDIT",
    "amount": 150.00,
    "description": "Grocery items",
    "date": "2024-01-15",
    "status": "PENDING",
    "paymentMethod": "CASH",
    "notes": "Customer will pay later"
  }'

# Create PAYMENT transaction
curl -X POST "http://localhost:8080/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "John Doe",
    "transactionType": "PAYMENT",
    "amount": 100.00,
    "description": "Payment received",
    "date": "2024-01-15",
    "status": "COMPLETED",
    "paymentMethod": "CASH",
    "notes": "Payment received"
  }'

# Create ADJUSTMENT transaction
curl -X POST "http://localhost:8080/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "John Doe",
    "transactionType": "ADJUSTMENT",
    "amount": 25.00,
    "description": "Discount applied",
    "date": "2024-01-15",
    "status": "COMPLETED",
    "paymentMethod": "ADJUSTMENT",
    "notes": "Loyalty discount"
  }'
```

### 4. Update Transaction
**PUT** `/transactions/{id}`

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/transactions/1" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "customerName": "John Doe",
    "transactionType": "CREDIT",
    "amount": 175.00,
    "description": "Updated grocery items",
    "date": "2024-01-15",
    "status": "PENDING",
    "paymentMethod": "CASH",
    "notes": "Updated notes"
  }'
```

### 5. Delete Transaction
**DELETE** `/transactions/{id}`

**Examples:**
```bash
curl -X DELETE "http://localhost:8080/api/transactions/1"
curl -X DELETE "http://localhost:8080/api/transactions/123"
```

### 6. Mark Transaction Status
**POST** `/transactions/{id}/mark-paid?status={status}`

**Status Values:**
- `COMPLETED` - Mark as completed
- `CANCELLED` - Mark as cancelled
- `PENDING` - Mark as pending

**Examples:**
```bash
# Mark as completed
curl -X POST "http://localhost:8080/api/transactions/1/mark-paid?status=COMPLETED"

# Mark as cancelled
curl -X POST "http://localhost:8080/api/transactions/1/mark-paid?status=CANCELLED"

# Mark as pending
curl -X POST "http://localhost:8080/api/transactions/1/mark-paid?status=PENDING"
```

### 7. Get Customer Transactions
**GET** `/transactions/customer/{customerId}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/customer/CUST001"
curl -X GET "http://localhost:8080/api/transactions/customer/CUST002"
```

### 8. Get Pending Transactions
**GET** `/transactions/pending`

**Example:**
```bash
curl -X GET "http://localhost:8080/api/transactions/pending"
```

### 9. Get Overdue Transactions
**GET** `/transactions/overdue`

**Example:**
```bash
curl -X GET "http://localhost:8080/api/transactions/overdue"
```

### 10. Daily Transaction Reports

#### Daily Sales
**GET** `/transactions/daily/sales?date={date}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/daily/sales?date=2024-01-15"
curl -X GET "http://localhost:8080/api/transactions/daily/sales?date=2024-01-20"
```

#### Daily Cash
**GET** `/transactions/daily/cash?date={date}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/daily/cash?date=2024-01-15"
curl -X GET "http://localhost:8080/api/transactions/daily/cash?date=2024-01-20"
```

#### Daily Credit
**GET** `/transactions/daily/credit?date={date}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/daily/credit?date=2024-01-15"
curl -X GET "http://localhost:8080/api/transactions/daily/credit?date=2024-01-20"
```

### 11. Period Transaction Reports

#### Period Sales
**GET** `/transactions/period/sales?startDate={startDate}&endDate={endDate}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/period/sales?startDate=2024-01-01&endDate=2024-01-31"
curl -X GET "http://localhost:8080/api/transactions/period/sales?startDate=2024-01-01&endDate=2024-03-31"
```

#### Period Cash
**GET** `/transactions/period/cash?startDate={startDate}&endDate={endDate}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/period/cash?startDate=2024-01-01&endDate=2024-01-31"
curl -X GET "http://localhost:8080/api/transactions/period/cash?startDate=2024-01-01&endDate=2024-03-31"
```

#### Period Credit
**GET** `/transactions/period/credit?startDate={startDate}&endDate={endDate}`

**Examples:**
```bash
curl -X GET "http://localhost:8080/api/transactions/period/credit?startDate=2024-01-01&endDate=2024-01-31"
curl -X GET "http://localhost:8080/api/transactions/period/credit?startDate=2024-01-01&endDate=2024-03-31"
```

## Transaction Types

- **CREDIT** - Customer owes money (purchase, service, etc.)
- **PAYMENT** - Customer pays money (cash, bank transfer, UPI, etc.)
- **ADJUSTMENT** - Adjustments like discounts, corrections, etc.

## Transaction Statuses

- **PENDING** - Transaction is pending completion
- **COMPLETED** - Transaction is successfully completed
- **CANCELLED** - Transaction is cancelled

## Payment Methods

- **CASH** - Cash payment
- **BANK_TRANSFER** - Bank transfer
- **UPI** - UPI payment
- **CHEQUE** - Cheque payment
- **CARD** - Card payment
- **ADJUSTMENT** - System adjustment
- **OTHER** - Other payment methods

## Date Format
All dates should be in ISO format: `YYYY-MM-DD`

## Error Responses
The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Frontend Usage
The React components can use these endpoints through the `transactionAPI` service:

```javascript
import { transactionAPI } from '../services/api';

// Get all transactions
const transactions = await transactionAPI.getAllTransactions();

// Get filtered transactions
const filteredTransactions = await transactionAPI.getAllTransactions({
  customerId: 'CUST001',
  type: 'CREDIT',
  status: 'PENDING'
});

// Create transaction
const newTransaction = await transactionAPI.createTransaction({
  customerId: 'CUST001',
  customerName: 'John Doe',
  transactionType: 'CREDIT',
  amount: 150.00,
  description: 'Grocery items',
  date: '2024-01-15',
  status: 'PENDING',
  paymentMethod: 'CASH',
  notes: 'Customer will pay later'
});
```

## Enhanced Transaction Methods with Customer Balance Updates

### Process Payment (Automatic Balance Update)
```javascript
import { transactionAPI } from '../services/api';

// Process payment and automatically update customer balance
const paymentResult = await transactionAPI.processPayment({
  customerId: '08152864826',
  customerName: 'John Doe',
  amount: 100.00,
  description: 'Payment received',
  paymentMethod: 'CASH',
  notes: 'Cash payment'
});

console.log('Previous balance:', paymentResult.previousBalance);
console.log('Amount paid:', paymentResult.amountPaid);
console.log('New balance:', paymentResult.newBalance);
```

### Add Credit (Automatic Balance Update)
```javascript
import { transactionAPI } from '../services/api';

// Add credit and automatically update customer balance
const creditResult = await transactionAPI.addCredit({
  customerId: '08152864826',
  customerName: 'John Doe',
  amount: 150.00,
  description: 'Grocery items',
  paymentMethod: 'CASH',
  status: 'PENDING',
  notes: 'Customer will pay later'
});

console.log('Previous balance:', creditResult.previousBalance);
console.log('Credit amount:', creditResult.creditAmount);
console.log('New balance:', creditResult.newBalance);
```

### Calculate Customer Balance
```javascript
import { transactionAPI } from '../services/api';

// Calculate new balance after a transaction
const currentBalance = 500.00;
const transactionType = 'PAYMENT';
const amount = 100.00;

const newBalance = transactionAPI.calculateCustomerBalance(
  currentBalance, 
  transactionType, 
  amount
);
// Result: 400.00 (500 - 100)
```

### Update Customer Total Due Methods
```javascript
import { customerAPI } from '../services/api';

// Method 1: Using PATCH (recommended)
await customerAPI.updateCustomerTotalDue('08152864826', 150.00);

// Method 2: Using query parameter endpoint
await customerAPI.updateCustomerTotalDueByQuery('08152864826', 150.00);

// Method 3: Partial update with PUT
await customerAPI.updateCustomerPartial('08152864826', { 
  totalDue: 150.00 
});

// Method 4: PATCH method
await customerAPI.patchCustomer('08152864826', { 
  totalDue: 150.00,
  notes: 'Updated after payment'
});
```

## Transaction Processing Workflow

### When Adding a Credit Transaction:
1. Get current customer balance
2. Create CREDIT transaction
3. Update customer total due (balance + credit amount)
4. Return transaction details with balance information

### When Processing a Payment:
1. Get current customer balance
2. Create PAYMENT transaction
3. Update customer total due (balance - payment amount, minimum 0)
4. Return transaction details with balance information

### When Adding an Adjustment:
1. Get current customer balance
2. Create ADJUSTMENT transaction
3. Update customer total due (usually balance - adjustment amount)
4. Return transaction details with balance information

## Error Handling

All enhanced methods include proper error handling:
- If transaction creation fails, no customer balance update occurs
- If customer balance update fails after transaction creation, a warning is logged but transaction remains valid
- All methods return detailed error information for debugging

## Validation

- Partial updates now work without requiring all fields
- Flexible validation allows updating only the fields provided
- Customer total due updates handle both positive and negative adjustments
- Payment amounts cannot result in negative customer balances (minimum 0)

## Customer API Endpoints

### 1. Get All Customers
**GET** `/customers`

**Example:**
```bash
curl -X GET "http://localhost:8080/api/customers"
```

### 2. Get Customer by ID
**GET** `/customers/{id}`

**Example:**
```bash
curl -X GET "http://localhost:8080/api/customers/08152864826"
```

### 3. Create Customer
**POST** `/customers`

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "address": "123 Main Street, City",
  "category": "Regular",
  "notes": "New customer from local area",
  "totalDue": 0.00,
  "isActive": true
}
```

### 4. Update Customer (Full Update)
**PUT** `/customers/{id}`

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/customers/08152864826" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "mobile": "9876543210",
    "address": "456 New Street, City",
    "category": "VIP",
    "notes": "Customer upgraded to VIP",
    "totalDue": 150.00,
    "isActive": true
  }'
```

### 5. Update Customer (Partial Update)
**PUT** `/customers/{id}` - Partial fields only

**Examples:**
```bash
# Update only total due
curl -X PUT "http://localhost:8080/api/customers/08152864826" \
  -H "Content-Type: application/json" \
  -d '{
    "totalDue": 150.00
  }'

# Update multiple fields
curl -X PUT "http://localhost:8080/api/customers/08152864826" \
  -H "Content-Type: application/json" \
  -d '{
    "totalDue": 150.00,
    "notes": "Updated after transaction"
  }'
```

### 6. Update Customer (PATCH Method)
**PATCH** `/customers/{id}` - For partial updates

**Example:**
```bash
curl -X PATCH "http://localhost:8080/api/customers/08152864826" \
  -H "Content-Type: application/json" \
  -d '{
    "totalDue": 150.00
  }'
```

### 7. Update Customer Total Due (Query Parameter)
**PUT** `/customers/{id}/total-due?totalDue={amount}`

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/customers/08152864826/total-due?totalDue=150.00" \
  -H "Content-Type: application/json"
```

### 8. Delete Customer
**DELETE** `/customers/{id}`

**Example:**
```bash
curl -X DELETE "http://localhost:8080/api/customers/08152864826"
``` 