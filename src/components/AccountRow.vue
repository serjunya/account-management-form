<template>
  <div class="account-row"
  :style="`grid-template-columns: 1.2fr 0.9fr ${isAccountLocal ? '1fr 1fr' : '2.05fr'} 40px;`"
  >
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

    <UITextField
      v-if="isAccountLocal"
      v-model="account.password"
      :name="`password-${account.id}`"
      type="password"
      placeholder="Введите пароль"
      :maxlength="100"
      :invalid="account.errors.password"
      @blur="$emit('validate', account.id)"
    />

    <UIButton style="width: 40px" variant="icon" @click="$emit('remove', account.id)">
      <img src="../assets/trash.svg" />
    </UIButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const props = defineProps<{
  account: LocalAccount;
}>();

defineEmits<{
  (event: 'remove', id: string): void;
  (event: 'validate', id: string): void;
  (event: 'type-change', id: string): void;
}>();

const isAccountLocal = computed(() => props.account.type === 'LOCAL');
</script>

<style scoped lang="scss">
.account-row {
  display: grid;
  gap: 12px;
  align-items: center;
}

.password-placeholder {
  height: 40px;
}

@media (max-width: 650px) {
  .account-row {
    display: flex;
    flex-direction: column;
    align-items: end;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    & > * {
      width: 100%;
      flex: 1 0 32px;
    }
  }
}
</style>
