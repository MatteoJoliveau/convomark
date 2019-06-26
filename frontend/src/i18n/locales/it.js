import { MATOMO_URL } from '../../constants';

export default {
  names: {
    bookmarks: 'Bookmarks',
    collections: 'Collezioni',
  },
  collection: {
    noBookmarks: {
      title: 'Nessun Bookmarks!',
      message: `Comincia a salvare messaggi in questa collezione parlando con il nostro Telegram bot.<br/>
      Lo trovi <a href="{link}" target="_blank">qui</a>!`,
    },
  },
  pages: {
    home: {
      title: 'Addio conversazioni smarrite!',
      body: `ConvoMark è la feature che mancava! Continui a perdere di vista le conversazioni nei gruppi? Mettile da parte!<br/>
      Con ConvoMark puoi salvare quanti messaggi desider, organizzandoli in collezioni così che stiano belli ordinati.<br/>
      Entra ora con il tuo account Telegram e comincia a salvare messaggi con il nostro amichevole bot!
      `,
    },
    about: {
      title: "Che cos'è ConvoMark?",
      body: `ConvoMark è un Telegram Bot e applicazione web che permette di salvare
      i messaggi important, così da poterli recuperare successivamente.
      Nato da un'idea di <a href="https://t.me/FraYoshi" target="_blank">FraYoshi</a> nel gruppo Telegram di
      <a href="https://t.me/morrolinux" target="_blank">Morrolinux</a>, è stato sviluppato da
      <a href="https://t.me/GamesCodex" target="_blank">GamesCodex</a> che ne gestisce anche il mantenimento.`,
      technical: `Per gli sviluppatori tra di void, ConvoMark si compone di due parti principali:<br/>
      <ul>
        <li>un'applicazione web (dove siete ora!), scritta in VueJS and hostata su Netlify</li>
        <li>un'applicazione backend, scritta in NodeJS and hostata su un'infrastruttura Kubernetes privata</li>
      </ul>
      L'applicazione backend gestisce sia il bot Telegram (scritto con la fantastica libreria <a href="https://telegraf.js.org" target="_blank">Telegraf</a>)
      che l'API GraphQL che fornisce dati all'interfaccia web.
      <a href="https://t.me/GamesCodex" target="_blank">GamesCodex</a> sostiene attualmente sia il costo infrastrutturale che di sviluppo.`,
      donations: {
        title: 'Vuoi aiutarci a mantenere il bot? Considera di donare qualcosa!',
        body: `La manutenzione del bot, per quanto divertente, comporta alcuni cost. L'infrastruttura è il principale, ma anche il tempo
        degli sviluppatori è importante. Se ti va di aiutare il progetto, per favore considera di donare qualcosa usando i link qui sotto.<br/>
        Ogni donazione, per quanto assolutamente non obbligatoria, è estremamente ben accetta!`,
      },
    },
    privacy: {
      title: 'Privacy e Trasparenza',
      body: `ConvoMark mira ad essere il più aperto e trasparente possibile. La privacy dei nostri utenti è un tema prioritario e puntiamo
      a proteggere il più possibile le informazioni personali che raccogliamo. Allo stesso tempo vogliamo essere il più trasparenti possibili
      sull'andamento della piattaforma, le metriche di utilizzo e la gestione dei dati personali. Al fine di offrire la migliora esperienza possibile
      ai nostri utenti e per semplificare i lavori di sviluppo, ConvoMark si avvale di alcune tecnologie di tracciamento.`,
      matomo: {
        title: 'Tracking',
        body: `L'analisi dei comportamenti degli utenti permette di comprendere come viene usata la piattaforma, quali punti possono essere migliorati
        e dove focalizzare lo sviluppo. ConvoMark si avvale di un'installazione privata di <a href="https://matomo.org/" target="_blank">Matomo</a> per tracciare
        l'attività utente sulle pagine del sito, realizzare un profilo demografico dell'utenza e identificare i colli di bottiglia. Nel rispetto della privacy
        utente tutte le impostazioni di anonimizzazione sono state attivate (IP registration a soli due byte, sostituzione dello user ID con uno pseudonimo, geolocalizzazione IP
        a bassa risoluzione) ed il tracking è disabilitato di default. L'utente deve dare esplicito consenso per essere profilato. Il server di analytics è inoltre configurato per rispettare
        le impostazioni <a href="https://allaboutdnt.com/" target="_blank">DoNotTrack</a> del browser.
        I dati aggregati raccolti sono pubblicamente visibili a <a href="${MATOMO_URL}" target="_blank">questo indirizzo.</a>`,
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
    deleted: '{object} cancellato!',
    error: "Ops! C'è stato un errore!",
  },
  cookies: {
    accept: 'Accetto',
    refuse: 'No grazie',
    link: 'Maggiori informazioni',
    message: `Questo sito web utilizza un'istanza privata di <a href="${MATOMO_URL}">Matomo</a> per raccogliere dati di analitica su traffico e utilizzo. Questo processo è opzionale e disabilitato di default.<br/>
  Se desideri attivare questa funzionalità, per favore clicca il pulsante. Aiuterai a migliorare l'esperienza utente di tutti!`,
  },
};
