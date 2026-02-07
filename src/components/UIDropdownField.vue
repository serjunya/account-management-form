<template>
  <select
    v-model="modelValue"
    class="input select"
    :class="{ invalid }"
    @change="$emit('change')"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    invalid?: boolean;
  }>(),
  {
    invalid: false,
  },
);

defineEmits<{ (event: 'change'): void }>();
</script>

<style scoped>
.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  font-size: 14px;
  background: #fff;
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%2365778A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.input.invalid {
  border-color: #ef4444;
}
</style>
