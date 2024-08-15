# finance-app-tracker

This is a finance app tracker project for cs426 at UMass that consists of two main directories: `finance-tracker-app` and `services`.

## Running the Svelte App

To run the Svelte app located in the `finance-tracker-app` directory, follow these steps:

1. Open a terminal and navigate to the `finance-tracker-app` directory.
2. Run the following command to install the dependencies:
    ```
    npm install
    ```
3. Once the installation is complete, start the development server by running:
    ```
    npm run dev
    ```
4. The Svelte app should now be running on your local machine. Open your web browser and visit `http://localhost:5000` to access the app.

## Running the Services

To run the services located in the `services` directory, follow these steps:

1. Open a terminal and navigate to the `services` directory.
2. Run the following command to install the dependencies:
    ```
    npm install
    ```
3. Once the installation is complete, start the services by running:
    ```
    npm start
    ```
4. The services should now be running on your local machine.

## ToDo

- integrate databases with the service files

## Front-End Structure

### 

## Known Issues

### Major
- Git outage is a problem

### Minor
- Currently, there is a minor issue runnning the script in services/package.json. 
When running start:allroutes there is no error but start:all displays an error that the ports defined in routes are in use. This does not interfere with functionality and logs are created showing that the apps launched fine.
