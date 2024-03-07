# Dating App for Animal Adoption
## Team Members
Steven Bertolucci, 
Teresita Nader,
Nicholas Francisco,
Tan Ton,
Carter Roeser

## Project Configuration
- Create a new Firebase project
- From the “Project Settings” page of the Firebase console, add a new “web” application.
- Following the “npm” instructions, copy the `firebaseConfig` object including your project’s client API key into the `src/firebaseConfig.js` from the project repository.
- From the “Authentication” page of the Firebase console, enable authentication, then enable the “Email/Password” authentication provider.
- From the “Cloud Firestore” page of the Firebase console, create a new database in your desired region and enable production mode.
- Inside your new database, go to the “rules” tab, and copy the code block from the firestoreRules.md file in the root of the project repository. 

## Developing Locally
After the project has been configured, you can setup your local development environment, follow the steps below:
- Install NodeJS 16+ on your development machine.
- Clone this repository to your machine.
- Install the project dependencies by running `npm install`
- Start the development server by running `npm run start`

## Building for Production
After you have configured a development environment, you can build the project for production deployment by following the steps below:
- Run `npm run build`

The project will be compiled as a static site in the /build directory of the project directory. This can be hosted on any HTML/JS web server and does not require a backend configuration. All backend services are connected via Firebase using the logged in user’s credentials as a JSON Web Token. 