# ConvoMark
## Bookmark your Telegram conversations!

[![Netlify Status](https://api.netlify.com/api/v1/badges/307b81de-0925-45c8-ab57-7401052d63f2/deploy-status)](https://app.netlify.com/sites/suspicious-pike-0e144f/deploys)
[![CircleCI](https://circleci.com/gh/MatteoJoliveau/convomark.svg?style=svg)](https://circleci.com/gh/MatteoJoliveau/convomark)
![Node Version](https://img.shields.io/badge/node-%5E10.15.0-brightgreen.svg)
![Yarn Version](https://img.shields.io/badge/yarn-%5E1.13.0-brightgreen.svg)
![Website Status](https://img.shields.io/website/https/convomark.matteojoliveau.com.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-informational.svg)

ConvoMark is a web application and Telegram bot that makes it easy to bookmark a specific message and retrieve it later.  
Messages can be grouped together in named collections to keep them nice and organized.
It features a web interface to manage your bookmarks and collections, secure login via Telegram OAuth, a GraphQL API and a Telegram bot, [@convomarkbot](https://t.me/convomarkbot)!

**Check out the full documentation [here](https://convomark.matteojoliveau.com/docs)!**

# Build
If you want to hack on both the frontend and the backend at the same time, run the following commands:
- `yarn install:all` to install all the project dependencies
- `yarn start:all` to start both processes in foreground. Processes are managed via [foreman]() and the Procfile definition.

Check out [frontend/README.md](./frontend/README.md) and [backend/README.md](./backend/README.md) for more specific instructions.

## Contributing
Bug reports and pull requests are welcome on GitHub at https://github.com/matteojoliveau/convomark. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License
The project is available as open source under the terms of the [Apache 2.0 License](https://opensource.org/licenses/Apache-2.0).

## Code of Conduct
Everyone interacting in the ConvoMark project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [Code of Conduct](../CODE_OF_CONDUCT.md).