<template>
  <div class="account-row">
    <UITextField
      v-model="account.labelInput"
      :name="`labels-${account.id}`"
      placeholder="Введите метки"
      :maxlength="50"
      :invalid="account.errors.label"
      @blur="$emit('validate', account.id)"
    />

    <UIDropdownField
      v-model="account.type"
      :name="`type-${account.id}`"
      :invalid="account.errors.type"
      @change="$emit('type-change', account.id)"
    >
      <option value="" disabled>Выберите тип</option>
      <option value="LOCAL">Локальная</option>
      <option value="LDAP">LDAP</option>
    </UIDropdownField>

    <UITextField
      v-model="account.login"
      :name="`login-${account.id}`"
      placeholder="Введите логин"
      :maxlength="100"
      :invalid="account.errors.login"
      @blur="$emit('validate', account.id)"
    />

    <div v-if="account.type === 'LOCAL'" class="password-wrapper">
      <UITextField
        v-model="account.password"
        :name="`password-${account.id}`"
        :type="account.showPassword ? 'text' : 'password'"
        placeholder="Введите пароль"
        :maxlength="100"
        :invalid="account.errors.password"
        @blur="$emit('validate', account.id)"
      />
      <button
        class="eye-button"
        type="button"
        :aria-label="account.showPassword ? 'Скрыть пароль' : 'Показать пароль'"
        @click="$emit('toggle-password', account.id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 5c5.5 0 9.5 4.7 10.6 6.2a1.2 1.2 0 010 1.6C21.5 14.3 17.5 19 12 19S2.5 14.3 1.4 12.8a1.2 1.2 0 010-1.6C2.5 9.7 6.5 5 12 5zm0 2.2c-4 0-7.3 3.4-8.5 4.8 1.2 1.4 4.5 4.8 8.5 4.8s7.3-3.4 8.5-4.8c-1.2-1.4-4.5-4.8-8.5-4.8zm0 2.3a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
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
  showPassword: boolean;
  errors: AccountErrors;
};

defineProps<{
  account: LocalAccount;
}>();

defineEmits<{
  (event: 'remove', id: string): void;
  (event: 'validate', id: string): void;
  (event: 'type-change', id: string): void;
  (event: 'toggle-password', id: string): void;
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

.password-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.eye-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5b6b7f;
}

.eye-button svg {
  width: 18px;
  height: 18px;
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
