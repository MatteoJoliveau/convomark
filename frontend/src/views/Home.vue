<template>
  <div class="home">
    <figure class="image">
      <img alt="ConvoMark logo" src="@/assets/banner-large.png">
    </figure>
    <collection-list :collections="collections"/>
  </div>
</template>

<script>
import userCollections from '@/apollo/queries/userCollections.gql';
import CollectionList from '@/components/CollectionList';

export default {
  name: 'home',
  components: {
    CollectionList,
  },
  data() {
    return {
      collections: [],
    };
  },
  apollo: {
    collections: {
      query: userCollections,
      update({ currentUser }) {
        return currentUser.collections;
      }
    }
  },
};
</script>
