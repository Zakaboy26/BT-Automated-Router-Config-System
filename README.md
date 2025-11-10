## Personal Contribution (Excerpt from Dissertation)

> The section below is a direct excerpt from my dissertation (Section 5) to **document my individual code/testing contribution** to this group project. **The original README can be found below the excerpt**  
> It is included here to provide clear, accurate attribution of the parts I personally designed, implemented, and tested.

<!-- Start of excerpt -->
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-22" src="https://github.com/user-attachments/assets/3202d884-4cf8-4bc3-98a3-126c9dea8447" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-21" src="https://github.com/user-attachments/assets/2eff0140-02c0-4196-ab4d-d0e298d39a37" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-20" src="https://github.com/user-attachments/assets/0e6618bd-a7dc-4f92-ab91-613f4f2fc3d8" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-19" src="https://github.com/user-attachments/assets/44019765-ca45-448c-94b3-f28f21917ef8" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-18" src="https://github.com/user-attachments/assets/32811ed7-a263-408a-8e09-f72671865614" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-17" src="https://github.com/user-attachments/assets/9bd2443e-b71d-403d-b77b-392600de7082" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-16" src="https://github.com/user-attachments/assets/b33a01ce-0c53-434c-b4f3-298b13dac0a8" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-15" src="https://github.com/user-attachments/assets/76a3d352-28ae-4a36-a5e5-bc931a50a04d" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-14" src="https://github.com/user-attachments/assets/7b79b0ee-024f-42bc-95b0-1f68c17b26fe" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-13" src="https://github.com/user-attachments/assets/a6463ac3-e9c2-4744-8200-6280cc9f56d5" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-12" src="https://github.com/user-attachments/assets/b9f25ebb-9698-48e5-8d8d-46e3671c201d" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-11" src="https://github.com/user-attachments/assets/9926370f-ea91-4472-ade8-d5e0390c3291" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-10" src="https://github.com/user-attachments/assets/e753298d-e0b5-4f32-9634-28e83e11fc0d" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-09" src="https://github.com/user-attachments/assets/a53ef7d0-2160-4725-928f-53592f7b685d" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-08" src="https://github.com/user-attachments/assets/a2e7dbbf-b74a-4e1e-aae4-b03f7093497a" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-07" src="https://github.com/user-attachments/assets/3be992b7-39da-4448-a7e8-f5c1215d7b7b" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-06" src="https://github.com/user-attachments/assets/59bb9e65-f966-424a-9601-533563933db5" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-05" src="https://github.com/user-attachments/assets/74745c81-5f2a-4460-9ccf-d6b3fd5e3412" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-04" src="https://github.com/user-attachments/assets/8bdad929-5180-49a8-8a3b-57de911285aa" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-03" src="https://github.com/user-attachments/assets/4071e7de-7e62-4e0e-9d94-4d903d3c2fdb" />
<img width="1654" height="2339" alt="21077294_Report_SNIPPET-02" src="https://github.com/user-attachments/assets/2f511b84-3d63-401c-98d0-fefa3ed30caa" />


<!-- End of excerpt --><img width="1654" height="2339" alt="21077294_Report_SNIPPET-01" src="https://github.com/user-attachments/assets/21bc479b-aa4b-4d6b-b822-cc759544ba33" />


---

## Original Project README

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



