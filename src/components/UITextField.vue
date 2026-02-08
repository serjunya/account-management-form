<template>
  <div class="text-field">
    <input
      v-model="modelValue"
      class="text-field__input"
      :class="{ 'text-field__input_invalid': invalid }"
      :type="fieldType"
      :placeholder
      :id="inputId"
      :name
      :maxlength
      @blur="$emit('blur')"
    />
    <div
      v-if="type === 'password'"
      class="text-field__visibility"
      role="button"
      @click="togglePasswordVisibility"
    >
      <img v-if="isPasswordVisible" src="../assets/eye.svg" alt="Скрыть пароль" />
      <img v-else src="../assets/eye-slash.svg" alt="Показать пароль" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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

const fieldType = ref(props.type);

const inputId = computed(() => props.id ?? props.name);

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
  fieldType.value = isPasswordVisible.value ? 'text' : 'password';
}
</script>

<style scoped lang="scss">
.text-field {
  display: flex;
  justify-content: end;
  align-items: center;

  &__input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5f5;
    font-size: 14px;
    background: #fff;

    &_invalid {
      border-color: #ef4444;
    }
  }

  &__visibility {
    position: fixed;
    padding: 6px;
    margin-right: 6px;
    background-color: #fff;
    cursor: pointer;
  }
}
</style>
