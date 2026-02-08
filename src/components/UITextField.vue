<template>
  <input
    v-model="modelValue"
    class="input"
    :class="{ invalid }"
    :type="type"
    :placeholder="placeholder"
    :id="inputId"
    :name="name"
    :maxlength="maxlength"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const modelValue = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    type?: 'text' | 'password';
    placeholder?: string;
    maxlength?: number;
    invalid?: boolean;
    name?: string;
    id?: string;
  }>(),
  {
    type: 'text',
    placeholder: '',
    maxlength: undefined,
    invalid: false,
    name: undefined,
    id: undefined,
  },
);

defineEmits<{ (event: 'blur'): void }>();

const inputId = computed(() => props.id ?? props.name);
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
