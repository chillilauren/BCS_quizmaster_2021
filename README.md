# BCS_quizmaster_2021
Quiz Master Synoptic project for BCS
By Chilli Mahendra

This project assumes that you have Node.js and NPM installed, as well as mySQL workbench.

### Set up the database

1. Open up mySQL workbench and create a new schema and call it 'bcs_quizmaster'

2. Then import each of the three provided sql files, there should be one for users, quizzes and questions.

### Running locally

1. Open the folder containing the code files in your chosen IDE.

2. Create a file called .env in the root of the directory and enter the environment variables provided in the documentation.

3. Open a new terminal window in your IDE and run `npm install` to install all dependencies.

## To run the server: 
`DEBUG=myapp:* npm start` or just `npm start`

Then navigate to http://localhost:3000/ in your chosen browser.