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
    about: {
      title: "Che cos'è ConvoMark?",
      body: `ConvoMark è un Telegram Bot e applicazione web che permette di salvare
      i messaggi important, così da poterli recuperare successivamente.
      Nato da un'idea di <a href="https://t.me/FraYoshi" target="_blank">FraYoshi</a> nel gruppo Telegram di
      <a href="https://t.me/morrolinux" target="_blank">Morrlinux</a>, è stato sviluppato da
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
  },
};
