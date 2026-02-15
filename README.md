# Esteta CRM

A modern Customer Relationship Management (CRM) system built with Laravel, Vue.js, and Tailwind CSS. This application is designed for beauty salons and clinics to manage clients, appointments, services, and staff.

## Features

- **Client Management**: Track client information, history, and preferences.
- **Appointment Scheduling**: Manage bookings with calendar integration.
- **Service Management**: Define and manage services offered by the business.
- **Staff Management**: Track employee schedules and performance.
- **Financial Tracking**: Manage payments, expenses, and revenue.
- **Notifications**: Email and SMS notifications for appointments and reminders.
- **Reporting**: Generate insights on sales, clients, and operations.

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: Vue.js 3, Inertia.js
- **Styling**: Tailwind CSS 4
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Notifications**: Laravel Notification Channels (Mail, SMS)

## Prerequisites

- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js 18+
- npm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm-esteta
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit the `.env` file with your database credentials and other settings.

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Install Node.js dependencies**
   ```bash
   npm install
   ```

8. **Compile assets**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm run build
   ```

9. **Start the development server**
   ```bash
   php artisan serve
   ```

## Usage

### Development

Start the development server:
```bash
php artisan serve
```

Start the Vite development server for hot-reloading:
```bash
npm run dev
```

### Production

Compile assets for production:
```bash
npm run build
```

Run database migrations:
```bash
php artisan migrate --force
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).