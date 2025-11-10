# BT Router Project

A full-stack web application built with Spring Boot and React, designed to provide easy router requests and management functionality for British Telecom.

## Project Structure

The project is divided into two main parts:

### Backend (Spring Boot)
- Built with Spring Boot 3.4.2
- Java 17
- MariaDB
- Spring Security with JWT authentication
- RESTful API architecture

### Frontend (React)
- React 19.0.0
- npm 10.2.4
- Material-UI (MUI) for UI components
- TailwindCSS for styling
- React Router for navigation
- Axios for API communication
- Gemini AI integration for chatbot functionality

## Important Files

### Git Ignore Files
The project includes `.gitignore` files for both frontend and backend:

Frontend ignores:
- `node_modules/`
- Build outputs (`/build`, `/dist`)
- Environment files (`.env.local`, `.env.development.local`, etc.)
- IDE files (`.idea/`, `.vscode/`)
- Debug logs (`npm-debug.log*`, `yarn-debug.log*`)
- System files (`.DS_Store`)

Backend ignores:
- Build outputs (`target/`, `build/`)
- IDE files (`.idea/`, `.vscode/`, `.apt_generated/`, etc.)
- Maven wrapper files (except the jar)
- STS and NetBeans specific files

### Environment Files
- Frontend: Create `.env` file in the frontend directory for environment variables
  - Required: `REACT_APP_GEMINI_API_KEY` for Gemini AI chatbot integration
- Backend: Configuration is in `src/main/resources/application.properties`

## Prerequisites

- Java 17 or higher
- Node.js (Latest LTS version recommended)
- MariaDB (MySQL-compatible database)
- Maven
- npm or yarn
- Docker and Docker Compose
- JMeter (for running performance tests)
- Gemini AI API key

## Getting Started

1. Clone the repository:
```bash
git clone https://git.cardiff.ac.uk/c21079342/bt-47b.git
cd bt-47b
```

2. Configure your environment:
   - Create a `.env` file in the frontend directory and add your Gemini AI API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - Configure your database connection in `src/main/resources/application.properties`

3. Using Docker (Recommended):
```bash
# Build and start all services
docker-compose up --build

# To stop the services
docker-compose down
```

4. Manual Setup:
```bash
# Build the project
./mvnw clean install

# Start the application
cd frontend
npm install
npm start
```

This will start both the backend and frontend servers:
- Frontend will run on `http://localhost:3000`
- Backend will run on `http://localhost:8080`

## Performance Testing

The project includes a JMeter test plan (`BT_Router_Order_Flow.jmx`) for performance testing. The test plan simulates:
- User registration
- Order creation
- Order tracking
- Admin status updates

To run the performance tests:

1. Configure the test plan:
   - Open `BT_Router_Order_Flow.jmx` in JMeter
   - Update the admin credentials in the User Defined Variables section
   - Save the changes

2. Run the test:
```bash
# Run the test plan
.\jmeter.bat -n -t BT_Router_Order_Flow.jmx -l results.jtl

# Generate HTML report
.\jmeter.bat -g results.jtl -o report_folder
```

Note: The test plan includes sensitive credentials which have been removed for security reasons. You'll need to add your admin credentials before running the tests.

## Development

### Testing

Backend tests:
```bash
cd backend
./mvnw test
```

Frontend tests:
```bash
cd frontend
npm test
```

## Building for Production

### Using Docker
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Build
```bash
# Backend
cd backend
./mvnw clean package

# Frontend
cd frontend
npm run build
```

## Versioning

The project is versioned using Git tags. The current version is:
v0.15.0: Latest stable version with all current features implemented.

To view a specific version, clone the repository and checkout the corresponding tag:
```bash
git checkout tags/v0.15.0
```

## Contribution Guidelines

Contributions to BT Router are welcome. Please follow these guidelines:

### Forking The Project
Fork the repository from [https://git.cardiff.ac.uk/c21079342/bt-47b.git](https://git.cardiff.ac.uk/c21079342/bt-47b.git)

### Branch Naming
Use descriptive names such as:
- `feature/user-registration`
- `fix/auth-bug`
- `enhancement/performance`

### Commit Messages
Write detailed commit messages that describe:
- What changes have been made
- Why the changes were necessary
- Any related issues or tickets

### Pull Requests
When submitting a pull request:
- Provide a detailed description of your changes
- Reference any issues addressed
- Include any relevant documentation updates
- Ensure all tests pass
- Follow the existing code style

## License

This project is licensed under the MIT License - see the [LICENSE](https://git.cardiff.ac.uk/c21079342/bt-47b/-/blob/development/LICENSE) file for details.