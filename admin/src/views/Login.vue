<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-5">
                        <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
                        <div class="btn-wrapper text-center">
                            <button class="btn btn-neutral btn-icon" @click="authenticate">
                                <span class="btn-inner--icon"><img src="img/icons/common/github.svg"></span>
                                <span class="btn-inner--text">Telegram</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  name: 'login',
  data() {
    return {
      model: {
        email: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapGetters()
  },
};
</script>
<style>
</style>
