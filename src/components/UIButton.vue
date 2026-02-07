<template>
  <button
    :class="['ui-button', variant]"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'icon';
  }>(),
  {
    type: 'button',
    variant: 'primary',
  },
);

defineEmits<{ (event: 'click'): void }>();

const { type, variant } = props;
</script>

<style scoped>
.ui-button {
  border: 1px solid #cbd5f5;
  background: #fff;
  cursor: pointer;
  border-radius: 8px;
}

.ui-button.primary {
  width: 40px;
  height: 40px;
  font-size: 24px;
}

.ui-button.icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}
</style>
