# AnyForm - Form Builder & Analytics Dashboard

A full-stack form builder application with analytics capabilities.

## Features

- Create and manage forms with a drag-and-drop interface
- Multiple field types (text, textarea, select, radio, checkbox)
- Form submission handling
- Response analytics and visualization
- User authentication and authorization

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: JWT
- **State Management**: Zustand
- **Database ORM**: Sequelize

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd InterviewPrep
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your API URL
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Backend (.env)

```
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=anyform_dev
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Available Scripts

In the project directory, you can run:

### Backend

- `npm run dev` - Start the development server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database with test data

### Frontend

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
