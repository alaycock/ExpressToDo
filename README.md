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
    npm start

Replace `server_url`, `username` and `password` with your server details.

## Testing ##
The test suite runs with Mocha and Chai, Mocha must be installed globally to run the tests. You can do so by running the following.

    npm install mocha -g

Tests can be run with the following command.

    npm test
