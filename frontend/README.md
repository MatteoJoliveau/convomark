# ConvoMark Frontend
[![Netlify Status](https://api.netlify.com/api/v1/badges/307b81de-0925-45c8-ab57-7401052d63f2/deploy-status)](https://app.netlify.com/sites/suspicious-pike-0e144f/deploys)

This is the ConvoMark's web GUI. Here users can manage all their collections and bookmarks. All bot functionalities are replicated here. If you can do it in the both, you should be able to do it here (and viceversa).

**Check out the full documentation [here](https://convomark.matteojoliveau.com/docs)!**

The application is built with VueJS 2 and leverages some packages from the Vue ecosystem, such as:
- Vuex for application-wide state management
- Vue Router for local page navigation (using HTML5 History API)
- Vue Apollo for sending GraphQL requests to the backend 
- Vue i18n for text localization
- Buefy for Bulma-styled Vue components

Styles are provided by [Bulma](https://bulma.io), a powerful and easy to use CSS component framework.

## Project requirements
- [Node](https://nodejs.org) 10.15 or later
- [Yarn](https://yarnpkg.com) 1.13 or later

You will also need to have the [backend](../backend/README.md) up and running in order for the frontend to work. Check out its documentation for more information.


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your tests
```
yarn test
```

### Lints and fixes files
```
yarn lint
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
