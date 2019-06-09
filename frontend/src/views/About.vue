<template>
  <section class="section">
    <div class="container has-text-justified">
      <h1 class="title">{{ $t('pages.about.title') }}</h1>
      <p class="content is-medium" v-html="$t('pages.about.body')"></p>
      <p class="content is-medium" v-html="$t('pages.about.technical')"></p>
      <h3 class="subtitle is-3">{{ $t('pages.about.donations.title') }}</h3>
      <p class="content is-medium" v-html="$t('pages.about.donations.body')"></p>
      <div class="list is-hoverable">
        <a class="list-item"
          href="https://paypal.me/matteojoliveau"
          target="_blank">
          PayPal
        </a>
        <a class="list-item"
          href="bitcoin:1JF7itDUs44Cm7gfa8ut3uTKm1zCGFoqGC"
          target="_blank">
          Bitcoin
        </a>
        <a class="list-item"
          href="ethereum:0xe533570009c87AaC21B52B251D1F930B0a95a4E0"
          target="_blank">
          Ethereum
        </a>
      </div>
    </div>
  </section>
</template>
