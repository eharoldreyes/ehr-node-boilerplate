# ehr-node-boilerplate

Requirements
-----
1. MySQL 5.6 (or 5.7)
2. Redis
3. Node.js version 5.0 to 6.4.0

## Running the application
1. Download zip or clone from repository

2. Make sure redis server is running in correct PORT and HOST
 ```sh
  $ redis-server
  ```
3. Run this commands to get started:
  ```sh
  $ sudo npm start
  ```
4. After starting the server, run this commands to check:
  ```sh
  $ curl http://localhost:8000
  ```
5. To get apidocs
  ```sh
  $ npm run docs
  ```
  Then check localhost:8000/apidoc/

 ## Directory-tree
```
.
├── config
    └── env
├── controllers
├── helpers
├── libs
├── logs
├── models
├── res
    └── templates
    └── values
├── router
```

# Folders
- config -- where configuration per environment are placed
- controllers -- where controllers are placed
- helpers -- js files for reusable methods
- libs -- natively written third-party libraries
- logs -- where crash or error logs are placed
- models -- where models are placed
- res -- where you place strings, arrays, img, css, bower_components, fonts
- tmp -- where users can upload files, and images
- routers -- where http routes are placed

# Create Controller
 Controllers are the heart of your application, as they determine how HTTP requests should be handled. They are located at the `controllers` folder. They are not automatically routed. You must explicitly route them in `routers/main.js`. Using sub-folders for file organization is allowed.

Here's a typical controller:

```javascript
// authorization.js


const models = require(__dirname + '/../models');
const _strings = require(__dirname + '/../res/values/strings');

module.exports = {
    authorize,
    authenticate
};

function authorize(param) {
    var optns = { allowAll: false, allowed: []};
    if (Array.isArray(param))
        optns.allowed = param;
    else
        optns.allowAll = param.allowAll || false;
    if (optns.allowAll)
        optns.allowed = [_strings.ADMIN, _strings.PROGRAMMER];
    if (optns.allowAll && (optns.allowed === undefined || optns.allowed.length === 0))
        throw new Error("Missing allowed roles");

    return function (req, res, next) {
        authenticate(req.get("Access-Token") || req.headers["Access-Token"]).then(function (user) {
            req.session = {
                authorized: user !== undefined,
                user: user
            };
            if(optns.allowed.contains(user.role))
                next();
            else
                throw new Error("FORBIDDEN");
        }).catch(next);
    };
}

function authenticate(accessToken) {
    return models.Users.findOne({where: {$or: [{token: accessToken}, {web_token: accessToken}]}}).then(function (user) {
        if (!user)
            throw new Error("NO_RECORD_FOUND");
        return user;
    });
}

...
```

License
-----
MIT