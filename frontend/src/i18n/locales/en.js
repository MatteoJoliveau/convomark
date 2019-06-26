import { MATOMO_URL } from '../../constants';

export default {
  names: {
    bookmarks: 'Bookmarks',
    collections: 'Collections',
  },
  collection: {
    noBookmarks: {
      title: 'No Bookmarks!',
      message: `You can start saving messages by talking with our Telegram bot.<br/>
      You can find it <a href="{link}" target="_blank">here</a>!`,
    },
  },
  pages: {
    home: {
      title: 'Never miss a message!',
      body: `Convomark is the feature you have always missed! Afraid of losing an interest conversation in a group? Bookmark it!<br/>
      You can store as many messages as you want, and you can store them in named collections so that they stay nice and organized.<br/>
      Log in now with your Telegram account and start bookmarking messages with our friendly bot!
      `,
    },
    about: {
      title: 'What is ConvoMark?',
      body: `ConvoMark is a Telegram Bot and website that allows you to
      bookmark important messages, so that you can recover them later.
      It was born from an idea of <a href="https://t.me/FraYoshi" target="_blank">FraYoshi</a> over at
      <a href="https://t.me/morrolinux" target="_blank">Morrolinux's Group</a> and developed by
      <a href="https://t.me/GamesCodex" target="_blank">GamesCodex</a>.`,
      technical: `For the developers amongst you, ConvoMark is composed of two main parts:<br/>
      <ul>
        <li>a frontend application (where you are now!), built with VueJS and hosted on Netlify</li>
        <li>a backend application, built on NodeJS and hosted on a private Kubernetes infrastructure</li>
      </ul>
      The backend application runs both the Telegram bot (built using the wonderful <a href="https://telegraf.js.org" target="_blank">Telegraf library</a>) and
      the GraphQL API that powers the web interface.
      <a href="https://t.me/GamesCodex" target="_blank">GamesCodex</a> is currently covering the infrastructure costs and maintaining
      the application.`,
      donations: {
        title: 'Wanna help supporting the bot? Consider donating!',
        body: `Maintaining the bot, while funny, has some cost. Infrastructure is the main one, but developer time
        is also important. If you feel like helping the project, please consider donating something throught the links below.<br/>
        Any donation, althought absolutely not required, are much appreciated!`,
      },
    },
    privacy: {
      title: 'Privacy and Transparency',
      body: `ConvoMark aims at being as open and transparent as possible`,
      matomo: {
        title: 'Tracking',
        body: `User behavior analysis allows to better understand how the platform is being used, which parts can be improved and where to focus the development
        effort. ConvoMark uses a private installation of <a href="https://matomo.org/" target="_blank">Matomo</a> to track user activity on the website, compile a demographic profile of the user base
        and identity bottlenecks. To protect our users' privacy all anonymization features have been enabled (2 bytes IP masking, replacing user ID with a pseudonym, low resolution IP geocoding)
        and users must willingly opt-in in the tracking. We never send any kind of data without the user's consent. The server is also configured to respect the browser's <a href="https://allaboutdnt.com/" target="_blank">DoNotTrack</a>
        settings.
        Aggregated data are publicy visible at this <a href="${MATOMO_URL}" target="_blank">link</a>.`
      },
      sentry: {
        title: 'Raccolta Errori',
        body: `Al fine di semplificare la risoluzione dei problemi tecnici legati alla piattaforma, ConvoMark utilizza <a href="https://sentry.io" target="_blank">Sentry</a> come
        servizio di raccolta errori. Eventuali errori applicativi generati dal sito, dal server API o dal bot verranno raccolti ed inviati ai server di Sentry per l'elaborazione.
        Qualora l'utente sia autenticato quando l'errore occorre, una copia dei dati di autenticazione forniti da Telegram (elencati <a href="https://telegram.org/blog/login" target="_blank">qui</a>) verranno allegati all'errore per aiutare nel processo di troubleshooting.
        L'IP utente NON viene salvato. Potranno venir allegate ulteriori informazioni relative, ad esempio, al sistema operativo, la versione del browser o del dispositivo utilizzato al fine di aiutare
        gli sviluppatori nella risoluzione del problema. Nessuno di questi dati verrà utilizzato per profilazioni o statistiche al di fuori dei lavori di sviluppo.`
      },
    },
  },
  alerts: {
    deleted: '{object} deleted!',
    error: 'Ops! There was an error!',
  },
  cookies: {
    accept: 'I Accept',
    refuse: 'No thanks',
    link: 'More info',
    message: `This website uses a private instance of <a href="${process.env.VUE_APP_MATOMO_HOST}/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday#?idSite=1&period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=1">Matomo</a> to collect traffic and usage analytics. This process is optional and disable by default.<br/>
  If you want to opt-in, please click on the button. You will help improving the user experience for you and everyone else!`,
  },
};
