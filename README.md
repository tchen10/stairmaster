# StairMaster

### Install Dependencies

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

### Run the Application

To start the app in dev mode:

```
gulp dev
```

and navigate to http://localhost:8888/

To start the app in prod mode:

```
gulp prod
```

and navigate to http://localhost:9999/

## Setting up seed data

Retrieve data from firebase and store in seed.json

```
firebase data:get / > seed.json -f stairmaster
firebase data:get /pairs > pairs.json -f stairmaster
```

Set data from seed.json

```
firebase data:set / seed.json -f stairmaster
firebase data:set /pairs pairs.json -f stairmaster
```

## Testing


### Running Unit Tests

To run the unit tests once, use

```
gulp unit
```

To run the unit tests with auto-watch, use

```
gulp tdd
```

### End to end testing

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

Bring up the server:

```
gulp dev
```

Run the protractor tests:

```
gulp protractor
```


## Updating Angular

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


## Loading Angular Asynchronously

The angular-seed project supports loading the framework and application scripts asynchronously.  The
special `index-async.html` is designed to support this style of loading.  For it to work you must
inject a piece of Angular JavaScript into the HTML page.  The project has a predefined script to help
do this.

```
npm run update-index-async
```

This will copy the contents of the `angular-loader.js` library file into the `index-async.html` page.
You can run this every time you update the version of Angular that you are using.


## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The angular-seed project comes preconfigured with a local development webserver.  It is a node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via xhr or other means, you need to figure
out what is the best way to host the static files to comply with the same origin policy if
applicable. Usually this is done by hosting the files by the backend server or through
reverse-proxying the backend server(s) and webserver(s).
