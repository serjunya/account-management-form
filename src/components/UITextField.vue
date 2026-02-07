<template>
  <input
    v-model="modelValue"
    class="input"
    :class="{ invalid }"
    :type="type"
    :placeholder="placeholder"
    :maxlength="maxlength"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    type?: 'text' | 'password';
    placeholder?: string;
    maxlength?: number;
    invalid?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    maxlength: undefined,
    invalid: false,
  },
);

defineEmits<{ (event: 'blur'): void }>();
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

.input.invalid {
  border-color: #ef4444;
}
</style>
