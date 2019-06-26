<template>
  <section class="section">
    <div class="container has-text-justified">
      <h1 class="title is-1">{{ $t('pages.privacy.title') }}</h1>
      <p class="content is-medium" v-html="$t('pages.privacy.body')"></p>
      <h2 class="subtitle is-2">{{ $t('pages.privacy.matomo.title') }}</h2>
      <p class="content is-medium" v-html="$t('pages.privacy.matomo.body')"></p>
      <h2 class="subtitle is-2">{{ $t('pages.privacy.sentry.title') }}</h2>
      <p class="content is-medium" v-html="$t('pages.privacy.sentry.body')"></p>
    </div>
  </section>
</template>
