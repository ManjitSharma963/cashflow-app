# Credit Ledger - Customer Credit Manager

A modern ReactJS application for managing customer credits and transactions with a beautiful neuomorphic design.

## Features

### 🏠 **Customer Management**
- Add, edit, and delete customers
- Store customer information (name, mobile, address)
- **Mobile number as unique customer ID** for easy searching
- Track total due amounts and last transaction dates

### 💰 **Transaction Tracking**
- Add transactions with dates, descriptions, and amounts
- Mark transactions as paid or pending
- Automatic calculation of outstanding amounts
- **Quick search by mobile number** in navigation bar

### 📊 **Dashboard Overview**
- Total customers count
- Total outstanding amount
- Total collected amount
- Recent transactions
- Quick action buttons

### 🎨 **Beautiful UI**
- Light neuomorphic design with soft shadows
- Rounded corners and clean typography
- Responsive design for all devices
- Smooth hover animations and transitions

## Technology Stack

- **Frontend**: React 19 with Hooks
- **Routing**: React Router DOM
- **Styling**: Custom CSS with neuomorphic design
- **Storage**: Local Storage for data persistence
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cashflow-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## App Structure

```
src/
├── components/
│   ├── NavigationBar.js      # Top navigation with routing
│   ├── CustomerList.js       # Main customer list page
│   ├── CustomerDetail.js     # Individual customer view
│   ├── CustomerModal.js      # Add/edit customer form
│   ├── TransactionModal.js   # Add transaction form
│   ├── Dashboard.js          # Overview dashboard
│   └── *.css                 # Component-specific styles
├── App.js                    # Main app component with routing
├── App.css                   # Global styles and common components
└── index.js                  # App entry point
```

## Usage Guide

### Adding a Customer
1. Navigate to the Customers page
2. Click the "+ Add Customer" button
3. Fill in the customer details (name and mobile are required)
4. **Mobile number must be unique** - serves as customer ID
5. Click "Save"

### Adding a Transaction
1. Go to a customer's detail page
2. Click "+ Add Transaction"
3. Enter the transaction details (date, description, amount)
4. Click "Save Transaction"

### Marking Transactions as Paid
1. In the customer detail page, find a pending transaction
2. Click "Mark as Paid" button
3. The transaction status will update and total due will decrease

### Searching for Customers
1. **Quick Search**: Use the search bar in the navigation to find customers by mobile number
2. **Detailed Search**: On the Customers page, search by name or mobile number
3. **Direct Access**: Navigate directly to a customer using their mobile number as the URL

### Viewing Dashboard
1. Click "Dashboard" in the navigation
2. View summary statistics and recent transactions
3. Use quick action buttons for common tasks

## Design Features

### Neuomorphic Elements
- **Soft Shadows**: Creates depth without harsh edges
- **Rounded Corners**: Modern, friendly appearance
- **Light Background**: Easy on the eyes (#ecf0f3)
- **Subtle Gradients**: Adds dimension to buttons and cards

### Color Scheme
- **Primary**: #2d3748 (Dark text)
- **Secondary**: #4a5568 (Medium text)
- **Accent**: #3182ce (Links and highlights)
- **Success**: #38a169 (Paid amounts)
- **Warning**: #e53e3e (Outstanding amounts)

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly buttons and inputs

## Data Storage

The app uses browser localStorage to persist data:
- Customer information
- Transaction records
- Automatic data saving on changes

## Future Enhancements

- [ ] Customer search and filtering
- [ ] Export data to CSV/PDF
- [ ] Multiple currency support
- [ ] Payment reminders
- [ ] Advanced reporting
- [ ] User authentication
- [ ] Cloud data synchronization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository.
