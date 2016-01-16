## Nest Camera demo app

A simple demo application that uses the Nest Camera API from a web application.

## Requirements

The development environment is a simple Node.js server.
If you don't have them already install these tools first:

* [Node][node]

## Prerequisite

In order to run this example you must first create a client in the [Nest Developer portal][nest-dev-portal]. The client should be created with the following required attributes:

OAuth Redirect URI: `http://localhost:8080/auth/nest/callback`
Permissions: Camera read

All other attributes values are not specific and can be determined by the developer.

## Running

To install required Bower components and Node modules, simply type:

    $ bower install
    $ npm install

Next you will need your client ID and client secret from developer.nest.com/clients set as environment variables:

    $ export NEST_ID=<CLIENT ID>
    $ export NEST_SECRET=<CLIENT SECRET>

And finally, use Grunt to start the server:

    $ grunt

Then open http://localhost:8080 in your browser and you will be walked through the authentication process.


[node]: https://nodejs.org/en/download/
[nest-dev-portal]: https://developer.nest.com/clients
