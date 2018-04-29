const route = require('koa-route')

const withValidation = method => (path, routeHandler) => {
  const schema = routeHandler.schema
  const validators = Object.keys(schema).reduce((acc, cur) => {
    const subSchema = schema[cur]
    const required = Object.keys(subSchema).some((key) => {
      return subSchema[key].required === true
    })
    const wrappedSubSchema = {
      type: 'object',
      required,
      properties: schema[cur]
    }
    return acc.concat([
      {
        requestKey: cur,
        validator: require('is-my-json-valid')(wrappedSubSchema)
      }
    ])
  }, [])

  return route[method](path, async (ctx, ...args) => {
    const errors = validators.reduce((errs, {requestKey, validator}) => {
      global.console.log(requestKey, ctx.request[requestKey])
      validator(ctx.request[requestKey])

      return validator.errors ? errs.concat(validator.errors) : errs
    }, [])
    if (errors.length !== 0) {
      ctx.response.status = 400
      ctx.response.body = errors
      return
    }
    await routeHandler(ctx, ...args)
  })
}

module.exports = ['get', 'patch', 'put', 'post', 'del'].reduce((obj, method) => {
  return Object.assign(obj, {[method]: withValidation(method)})
}, {})
