# ExpressToDo #
Simple todo app using Node.js and Express that connects to a RESTful CRUD
interface. A test CRUD interface can be found at
[TeamTrumpet/simplestore](https://github.com/TeamTrumpet/simplestore).

## Installation ##

To clone, install, and run, execute the following commands.

    git clone https://github.com/alaycock/ExpressToDo
    set -x SERVER_URL server_url
    set -x SERVER_USERNAME username
    set -x SERVER_PASSWORD password
    npm install

Replace `server_url`, `username` and `password` with your CRUD server details.

## Running ##
To start the web app, run the command:

    npm start

Which will launch the service on `localhost:3000`.

## Testing ##
The test suite runs with Mocha and Chai. Mocha must be installed globally to run the tests and you can do so by running the following command.

    npm install mocha -g

Tests can be run with the following command.

    npm test

## Functionality

 - Type in a task's name and click plus or enter to submit.
 - Mark a task as complete by clicking the checkbox.
 - Edit a task by clicking on the task's text, it will make it editable.
   Resubmit the edited task by hitting enter or clicking away from the input
   area.
 - Click the `x` next to the text to delete the task.
