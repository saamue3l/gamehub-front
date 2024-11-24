<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import type { Forum, Topic } from '@/types/Forum'

defineProps<{
  forum?: Forum
  topic?: Topic
}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <router-link to="/forums">Forums</router-link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="forum" />
      <BreadcrumbItem v-if="forum">
        <BreadcrumbLink as-child>
          <router-link :to="{ name: 'ViewForum', params: { forumId: forum.id } }">{{
            forum.name
          }}</router-link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator v-if="forum && topic" />
      <BreadcrumbItem v-if="forum && topic">
        <BreadcrumbLink as-child>
          <router-link :to="{ name: 'Forums', params: { forumId: forum.id, topicId: topic.id } }">{{
            topic.title
          }}</router-link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<style scoped></style>
