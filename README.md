## Personal Contribution (Excerpt from Dissertation)



> The section below is a direct excerpt from my dissertation (Section 5) to **document my individual code/testing contribution** to this group project. **The excert README can be found below the excerpt**  

> It is included here to provide clear, accurate attribution of the parts I personally designed, implemented, and tested.



<!-- Start of excerpt -->

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-01" src="https://github.com/user-attachments/assets/67f05cbf-ffb5-44b3-8611-3bf09519932c" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-02" src="https://github.com/user-attachments/assets/c96e3d5c-2354-4302-8e05-1a39caecf520" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-03" src="https://github.com/user-attachments/assets/2856bac4-8620-4362-ac05-006572b98a88" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-04" src="https://github.com/user-attachments/assets/2a55af23-0ece-4336-bb99-07d04f659bee" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-05" src="https://github.com/user-attachments/assets/cf6f638f-e097-4853-b7f8-2322c52eb334" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-06" src="https://github.com/user-attachments/assets/cda6270b-d0e1-48d5-9cab-1eac10152e3c" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-07" src="https://github.com/user-attachments/assets/989da154-82bf-46bf-9d24-fb73e9b2735a" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-08" src="https://github.com/user-attachments/assets/05079978-7ff4-4263-844c-0924737f1b9c" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-09" src="https://github.com/user-attachments/assets/7105f2fb-fb94-407e-83ba-bbc93dc6d8a0" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-10" src="https://github.com/user-attachments/assets/61b6497e-3bd0-4b46-b328-5344ea66ae8f" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-11" src="https://github.com/user-attachments/assets/6e6845b9-d689-46c1-bc3a-541767827676" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-12" src="https://github.com/user-attachments/assets/687da9e1-d76e-4335-a80a-31af2df552a4" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-13" src="https://github.com/user-attachments/assets/824e3db2-b428-4f8c-a867-0b293884aa57" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-14" src="https://github.com/user-attachments/assets/29a5fbfd-0602-4e63-9095-6b68e7b661b8" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-15" src="https://github.com/user-attachments/assets/c55a2eaa-9f24-4404-8395-0c9b4183a8a0" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-16" src="https://github.com/user-attachments/assets/b88f8edc-07dc-4a3c-a5d5-89c26d1675d3" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-17" src="https://github.com/user-attachments/assets/ecc220bd-2063-4c87-a3f5-9b5afbf51223" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-18" src="https://github.com/user-attachments/assets/ece7c4c9-acad-43f2-bb85-03acdd3d7e1e" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-19" src="https://github.com/user-attachments/assets/8ee9bde8-fa6a-4b6a-827a-ca8a2ce350fd" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-20" src="https://github.com/user-attachments/assets/da1c48ae-f730-4bc2-a7e2-cb6ea566740b" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-21" src="https://github.com/user-attachments/assets/632a49a2-09f6-44ef-b09e-8df70629d95d" />

<img width="1654" height="2339" alt="21077294_Report_SNIPPET-22" src="https://github.com/user-attachments/assets/742a3751-6d59-4190-a095-d3002f473572" />

<!-- End of excerpt -->





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
