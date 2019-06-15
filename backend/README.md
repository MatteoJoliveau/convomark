# ConvoMark Backend

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

This is ConvoMark's main application. It powers both the API platform used by the [frontend](../frontend/README.md) and the Telegram bot over at [@convomarkbot](https://t.me/convomarkbot).

It's a NodeJS application, using LoopBack 4 as the primary framework for everything, from database access to configuration.

The Telegram bot is implemented using the wonderful [Telegraf](https://telegraf.js.org) library, and packaged into a nice, self-contained [LoopBack component](./src/telegram/component.ts). The component handles configuring and registering all the various parts of the bot (the main bot instance, fetching the token, installing the various commands etc) and wiring them with the rest of the application.  
The bot is configured to run using the [long polling strategy](https://core.telegram.org/bots/api#getupdates) in development, and [webhooks](https://core.telegram.org/bots/api#setwebhook) in production. By default the endpoint for webhooks is `/bot/updates/{hex(sha256(token))}`.

## Project requirements
- [Node](https://nodejs.org) 10.15 or later
- [Yarn](https://yarnpkg.com) 1.13 or later
- [PostgreSQL](https://www.postgresql.org/) 11
- [Redis](https://redis.io) 5

### Setup with Docker
If you have Docker installed you can use [Docker Compose]() to run Postgres and Redis without the need to have them installed. Simply run `docker-compose up -d` to have them started and listening in the background on their native ports (5432 for Postgres, 6379 for Redis).

### Manual setup
You have to manually create a database and a user for Postgres. The application defaults to the following settings:
- User: `convomark`
- Password: `convomark`
- Databse: `convomark_development`
- Host: `localhost`
- Port: `5432`
See the next section for instructions on how to customize them.

### Env file
Copy `.env.example` to `.env` and customize the settings there. Every variable defined in this file will be available in the application environment (via `process.env`) when running with `yarn start` or `yarn start:watch`.
If you are using different credentials for Postgres than the defaults, you can override them via the following variables:
  - POSTGRES_HOST
  - POSTGRES_PORT
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - POSTGRES_DB
  
You also need to set TELEGRAM_BOT_TOKEN to a real token provided by [BotFather](https://t.me/BotFather) in order to test the bot.  

You may also provide a LOG_LEVEL variable if you wish to customize the amount of console logging. By default it is set to `info`. It accepts any [PinoJS](https://getpino.io) log level, as it is the logger used by the application. The accepted values are:
  - trace
  - debug
  - info
  - warn
  - error
  - fatal

## Project design and structure
See our [Contribution Guide](./CONTRIBUTING.md) for more information.

## Project setup
```
yarn install
```
### Compiles and hot-reloads for development
```
yarn start:watch
```

### Migrate database schema
```
yarn migrate
```

### Compiles for production
```
yarn build
```

### Run your tests
```
yarn test
```

### Lints and fixes files
```
yarn lint:fix
```

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/matteojoliveau/convomark. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License
The project is available as open source under the terms of the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

## Code of Conduct
Everyone interacting in the ConvoMark project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [Code of Conduct](../CODE_OF_CONDUCT.md).