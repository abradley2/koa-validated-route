const test = require('tape')
const supertest = require('supertest')
const withValidation = require('./index')

let request
test('Start server', t => {
  const app = new (require('koa'))()

  app.use(require('koa-bodyparser')())

  function testRoute (ctx) {
    ctx.response.status = 200
    ctx.response.body = {success: true}
  }

  testRoute.schema = {
    body: {
      str: {
        type: 'string',
        required: true
      },
      boo: {
        type: 'boolean',
        required: false
      }
    }
  }

  app.use(withValidation.post('/test', testRoute))
  const server = app.listen()
  request = supertest(server)
  t.end()
})

test('timing test', function (t) {
  t.plan(2)

  request
    .post('/test')
    .send({ str: 'true', boo: true })
    .expect(200)
    .then(res => {
      t.equal(res.body.success, true)
    })

  request
    .post('/test')
    .send({ str: 'true', boo: 'true' })
    .then(res => {
      t.equal(res.status, 400)
    })
})

test.onFinish(() => process.exit(0))
