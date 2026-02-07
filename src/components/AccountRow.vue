<template>
  <div class="account-row">
    <UITextField
      v-model="account.labelInput"
      placeholder="Введите метки"
      :maxlength="50"
      :invalid="account.errors.label"
      @blur="$emit('validate', account.id)"
    />

    <UIDropdownField
      v-model="account.type"
      :invalid="account.errors.type"
      @change="$emit('type-change', account.id)"
    >
      <option value="" disabled>Выберите тип</option>
      <option value="LOCAL">Локальная</option>
      <option value="LDAP">LDAP</option>
    </UIDropdownField>

    <UITextField
      v-model="account.login"
      placeholder="Введите логин"
      :maxlength="100"
      :invalid="account.errors.login"
      @blur="$emit('validate', account.id)"
    />

    <UITextField
      v-if="account.type === 'LOCAL'"
      v-model="account.password"
      type="password"
      placeholder="Введите пароль"
      :maxlength="100"
      :invalid="account.errors.password"
      @blur="$emit('validate', account.id)"
    />
    <div v-else class="password-placeholder"></div>

    <UIButton variant="icon" @click="$emit('remove', account.id)">🗑</UIButton>
  </div>
</template>

<script setup lang="ts">
import UIButton from './UIButton.vue';
import UIDropdownField from './UIDropdownField.vue';
import UITextField from './UITextField.vue';

export type AccountErrors = {
  label: boolean;
  type: boolean;
  login: boolean;
  password: boolean;
};

export type LocalAccount = {
  id: string;
  labelInput: string;
  type: 'LDAP' | 'LOCAL' | '';
  login: string;
  password: string;
  errors: AccountErrors;
};

defineProps<{
  account: LocalAccount;
}>();

defineEmits<{
  (event: 'remove', id: string): void;
  (event: 'validate', id: string): void;
  (event: 'type-change', id: string): void;
}>();
</script>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr 1fr 40px;
  gap: 12px;
  align-items: center;
}

.password-placeholder {
  height: 40px;
}

@media (max-width: 900px) {
  .account-row {
    grid-template-columns: 1fr;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }
}
</style>
