This web application is a modern take on information sharing for command and 
control in the continental United States.

The project is divided into several sections.

## bmc2portal

This is the frontend website that a user will see. It is constructed using 
React (Javascript) Components and CSS styling. External communication is
handled via a REST API to the server in 'components/utils/backend.js'.

NOTE: If the NODE_ENV environment variable is set to "development", 
the backend will mock all of the data returns for rapid testing and 
frontend only development.

## bmc2server

This is the backend server (written in GoLang) that provides the endpoints
for bmc2portal to retrieve information from the Database. It is an 
abstraction layer from actual DB queries.

Bottom line, it exposes the REST API to send/receive from the database via
http/https.

## bmc2db (TODO)

TODO - Setup and configuration files for the database (under construction).

## flask-server

Deprecated.

@TODO - Remove this folder and provide instructions on serving the frontend.


## Developers & Contributors Notes

## Frontend-Only Development

- See [bmc2portal README](https://github.com/jemccarthy13/BMC2Portal/tree/master/bmc2portal).

## Integrated Development

1) You will need to clone this repository.
2) Choose a hosting platform for bmc2db and bmc2server.
3) Create the database on your server following the [bmc2db README](https://github.com/jemccarthy13/BMC2Portal/tree/master/bmc2db).
4) Start the bmc2server (modify the .env according to  your database setup), by following 
the [bmc2server README](https://github.com/jemccarthy13/BMC2Portal/tree/master/bmc2server)
5) Serve the frontend of the application by following the [bmc2portal README](https://github.com/jemccarthy13/BMC2Portal/tree/master/bmc2portal).
6) Navigate to the frontend IP address / served URL.

## Requirements

- Install [NPM/NodeJS](https://www.npmjs.com/get-npm)
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
- Install [GoLang](https://golang.org/dl/)