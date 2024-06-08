<template>
  <div>
    <div id="header">
      <div id="top">
        <div id="header-title">
          <h2>
            <a :href="`${rootUri}/#/`">{{ title }}</a>
          </h2>
        </div>
      </div>
    </div>
    <div ids="nav">
      <p v-if="filter">Showing posts matching: {{ filter }}</p>
    </div>
    <div id="posts">
      <Post v-for="post in loadedPosts" v-bind:key="post.summary.title" v-bind:summary="post.summary"
        v-bind:content="post.content"></Post>
    </div>
    <div class="load-more" v-if="loadedPosts.length > 0 && loadedPosts.length < postSummaries.length">
      <button class="load-more-button" v-on:click="fetchMore()">
        Load Older Posts
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { RouteParams } from 'vue-router';
import Post from './components/Post.vue';
import config from './config';
import Store from './store';

document.title = config.title;

// make store reactive
const store = ref(new Store(config.postsPath, config.postsPerPage));

type PostFetchParams = RouteParams;

function fetchPosts(params: PostFetchParams) {
  if (params.title) {
    store.value.fetchPostsByTitle(params.title as string);
  } else {
    store.value.fetchPostsByTag(params.tag as string);
  }
}

export default defineComponent({
  name: 'App',
  components: {
    Post,
  },
  data: () => store.value.data,
  computed: {
    tag(): string | string[] {
      return this.$route.params.tag;
    },
    title(): string {
      return config.title;
    },
    rootUri(): string {
      return config.rootUri;
    },
    filter(): string | string[] {
      return this.$route.params.tag || this.$route.params.title;
    },
  },
  watch: {
    $route(): void {
      fetchPosts(this.$route.params);
    },
  },
  methods: {
    fetchMore(): void {
      store.value.fetchMore();
    },
  },
});
</script>

<style src="./stylesheets/posts.css"></style>
