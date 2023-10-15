# MERN Stack Login System with Advanced Features

This project is a full-fledged MERN (MongoDB, Express, React, Node.js) application that implements a robust login system with several advanced features. The inspiration for this project comes from the tutorial "Complete MERN App (OTP Verification, JWT Token, Authentication, Reset Password)" available on YouTube ([Watch Tutorial](https://www.youtube.com/watch?v=BfrJxGQEPSc)).

## Description

The MERN stack login system is designed to provide a secure and feature-rich user authentication process. It covers everything from user registration to password reset, incorporating OTP (One-Time Password) verification and JWT (JSON Web Token) for enhanced security.

## Features

- **User Registration:** Allows users to register with the application by providing necessary details, including the option to select a profile image.
- **Login System:** Implements a well-designed login page with a secure authentication process.
- **OTP Verification:** Enhances security by incorporating OTP verification during the registration and password reset processes.
- **JWT Token:** Utilizes JSON Web Tokens for secure and stateless authentication, ensuring a smooth user experience.
- **Password Reset:** Provides a mechanism for users to reset their passwords, including email notifications and OTP validation.

## Technology Used

- **Frontend:**
  - React: A JavaScript library for building user interfaces.
  - CSS: Styling is implemented using CSS, with a focus on Flexbox for responsive design.

- **Backend:**
  - Express: A web application framework for Node.js.
  - MongoDB: A NoSQL database for storing user information securely.
  - Bcrypt: Used for hashing passwords to enhance security.
  - JSON Web Token (JWT): Ensures secure and stateless user authentication.

- **Other Technologies:**
  - Ethereal Email: Utilized for testing email functionality during development.


# Client Configuration Guidelines

This project utilizes a configuration file, `.env`, located in the `client` directory. The `.env` file contains environment variables used by the client-side code. Follow these guidelines to configure this file correctly.

## Environment Variables (`.env`)

The `.env` file should be configured to match your specific setup. Below are the details of the environment variable used:

1. **REACT_APP_SERVER_DOMAIN:**
   - This variable specifies the domain where the server is running.
   - Set the value to the base URL of your server, including the protocol and port.
   - Example:
     
     ```
       REACT_APP_SERVER_DOMAIN='http://localhost:3000'
     ```

## Configuration Example

Here is an example of a properly configured `.env` file:

  ```dotenv
    REACT_APP_SERVER_DOMAIN='http://localhost:3000'
  ```

# Server Configuration Guidelines

This project relies on a configuration file, `config.js`, located in the `server` directory. This file contains sensitive information such as JWT secret, email credentials, and MongoDB connection URI. It is crucial to follow the guidelines below to configure this file securely.


## Configuration File (`config.js`)

The `config.js` file should be configured with your specific values to ensure the proper functioning of the application. Follow these guidelines to set up the configuration file securely:

1. **JWT Secret:**
   - Replace the placeholder `"your_jwt_secret_here"` with a long and secure random string.
   - Example: `JWT_SECRET: "my_super_secret_jwt_key_2023"`

2. **Email Credentials:**
   - Replace the placeholder `"your_email@example.com"` with the email address used for sending notifications.
   - Replace the placeholder `"your_email_password"` with your email password or an app-specific password.
   - Example:
     ```javascript
     EMAIL: "example@gmail.com",
     PASSWORD: "my_email_password_or_app_specific_password"
     ```

3. **MongoDB Connection URI:**
   - Replace the placeholder `"your_mongodb_uri_here"` with your actual MongoDB connection URI.
   - Example: `ATLAS_URI: "mongodb+srv://username:password@cluster0.mongodb.net/mydatabase"`

## Example Configuration

Here is an example of a properly configured `config.js` file:

```javascript
export default {
    JWT_SECRET: "my_super_secret_jwt_key_2023",
    EMAIL: "example@gmail.com",
    PASSWORD: "my_email_password_or_app_specific_password",
    ATLAS_URI: "mongodb+srv://username:password@cluster0.mongodb.net/mydatabase",
};
```


## Usage

To run the project locally, follow these steps:

1. **Clone Repository:**
   
   ```bash
      git clone https://github.com/onkaryemul/MERN-Stack-Login-System.git
   ```

2. **Install Dependencies:**
   
   ```bash
      cd mern-login-system
      npm install
   ```
   
3. ***Set Up MongoDB:**
  - Create a MongoDB database and update the connection string in the project.

4. **Configure Email:**
  - Set up an account with Ethereal Email for testing purposes.
  - Update email configuration in the project.
    
5. **Run the Application:**

  ```bash
    npm start
  ```

6.Access the Application:
  - Open your browser and go to [http://localhost:3000](http://localhost:3001) to access the application.


## Contributing
  - Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.
