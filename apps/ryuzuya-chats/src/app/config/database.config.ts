
export default () => ({
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost/nest',
})
