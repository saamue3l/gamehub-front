<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="round" class="p-2 border-none">
        <Bell class="w-5 h-5 hover:bg-secondary hover:rounded-3xl" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-36">
      <DropdownMenuItem>
        <span>Notification 1</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <span>Notification 2</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <span>Notification 3</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
</script>

<style scoped></style>