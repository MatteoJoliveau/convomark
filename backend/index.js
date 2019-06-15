const application = require('./dist');

module.exports = application;

if (require.main === module) {
  const domain = process.env.WEB_DOMAIN || 'http://localhost:3000'
  const { protocol, hostname: host, port } = new URL(domain);
  
  // Run the application
  const config = {
    domain,
    rest: {
      port,
      host,
      protocol,
      openApiSpec: {
        // useful when used with OASGraph to locate your application
        setServersFromRequest: true,
      },
    },
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
