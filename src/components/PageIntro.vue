<script setup lang="ts">
import LucianSplitWorkspace from './LucianSplitWorkspace.vue'

defineProps<{
  category?: string
  eyebrow?: string
  title: string
  description?: string
  simple?: boolean
}>()
</script>

<template>
  <div v-if="simple" class="page-intro-simple">
    <span v-if="category || eyebrow" class="page-category-label">
      {{ category || eyebrow }}
    </span>
    <h1>{{ title }}</h1>
    <p v-if="description">{{ description }}</p>
  </div>
  <LucianSplitWorkspace
    v-else
    :eyebrow="category || eyebrow"
    :title="title"
    :description="description"
    poster-badge="DXTechs Platform"
  />
</template>

<style scoped>
.page-intro-simple {
  padding: 32px 0 20px;
}

.page-category-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: var(--dx-blue, #0066cc);
  margin-bottom: 8px;
}

h1 {
  margin: 0 0 10px;
  font-family: var(--font-heading);
  color: var(--dx-ink, #1d1d1f);
  font-weight: 800;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

p {
  margin: 0;
  max-width: 68ch;
  color: var(--dx-ink-muted, #7a7a7a);
  font-size: 15px;
  line-height: 1.6;
}
</style>
