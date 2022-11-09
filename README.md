# Rugo View

_Middleware Service_

## Overview

It takes request from Server Service and run a Fx code. It was known `Server Rendering`.

## Settings

```js
const settings = {
};
```

## Common

### Route

Config route:

```js
const route = {
  method: /* method, `all` for any method */,
  path: /* route path */,
  view: /* file path to render */,
  params: /* additions params */,
}
```

Result route:

```js
const route = {
  method: /* attually method */,
  path: /* acctually path */,
  /* view: remove view */,
  params: /* merged with config, server and parsed */,
  form: /* server form */,
  query: /* server query */,
  headers: /* server headers */,
  cookies: /* server cookies */,
  
  /* ... addition server args ... */
}
```

### File System routing

All files below should have `.js` or `.ejs` extenstion. For example, it's using `.ejs` file:

- `index.ejs` -> `GET /`
- `foo/bar.ejs` -> `GET /foo/bar`
- `[name].ejs` -> `GET /:name`
- `[name].html.ejs` -> `GET /:name.html`
- `[name]/index.ejs` -> `GET /:name`

All file start with underscore `_` will be ignore.

## Actions

### `render`

Input Arguments:

_It takes all arguments from Rugo Server and some news:_

- `views` schema to get file render. Ex: `[{ use: 'path', model: 'name' }]`.
- `routes` Pre-defined `routes`, if not specify, it will auto detect from `views`.

Output Arguments:

_It will call `fx.run` to render code. Fx could return string or server response object_

- `model` schema for file get (from `views`)
- `path` path to render file (`route.view`)
- `locals` additions locals
  + `locals.params` params from config route and parsed route path
  + `locals.route` result route

Return: 

_Server Service Response Standard_

## License

MIT