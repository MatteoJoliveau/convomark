const application = require('./dist');
const orm = require('./ormconfig');

module.exports = application;

if (require.main === module) {
  const domain = process.env.WEB_DOMAIN || 'http://localhost:3000';

  // Run the application
  const config = {
    domain,
    rest: {
      port: +(process.env.PORT || 3000),
      host: process.env.HOST,
      openApiSpec: {
        // useful when used with OASGraph to locate your application
        setServersFromRequest: true,
      },
    },
    orm,
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
