# Koa validated route

`npm install --save @abradley2/koa-validated-route`

This is a very simple wrapper around [koa-route](https://github.com/koajs/route) and [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid).
Refer to their documentation for how route argument passing, matching, and schema
validation work. This simply adds them together in a simple wrapper so you
don't need to manually initialize validators, and send back 400s with the error list yourself

### API

Use the main exported method the same you would with **koa-route** as this
module simply wraps your handler and proxies to that. For any route handler
that has a `validate` object property, this property will be used to generate
validation schemas for the body or query of the request (note you don't need to
bother with `type: object, required: true` on the root of any body or query schema,
this is taken care of).

The specification underlying this validation 
is [this big scary spec document with lots of words](http://json-schema.org/latest/json-schema-validation.html)
but it's actually fairly straight-forward in practice

### Example

```
const app = require('koa')()
const withValidation = require('koa-validated-route')

function submitRoute(ctx, sessionId) {
  // we won't reach here if the validation fails.
  // so now we can proceed with confidence!
}

submitRoute.schema = {
  body: {
    title: {
      type: 'string',
      required: true
    },
    isMarried: {
      type: 'boolean',
      required: true
    }
  },
  query: {
    userId: {
      type: 'string', // all query params are going to be string so duh
      required: false
    }
  }
}

app.use(
  withValidation.post('/submit/:sessionId', submitRoute)
)
```