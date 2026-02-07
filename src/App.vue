<template>
  <div class="page">
    <header class="header">
      <h1>Учетные записи</h1>
      <button class="add-button" type="button" @click="addAccount">+</button>
    </header>

    <section class="hint">
      <span class="hint-icon">?</span>
      <p>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</p>
    </section>

    <section class="accounts">
      <div class="accounts-header">
        <span>Метки</span>
        <span>Тип записи</span>
        <span>Логин</span>
        <span>Пароль</span>
        <span></span>
      </div>

      <div v-if="accounts.length === 0" class="empty">Добавьте учетную запись.</div>

      <div v-for="account in localAccounts" :key="account.id" class="account-row">
        <input
          v-model="account.labelInput"
          type="text"
          placeholder="Введите метки"
          :class="['input', { invalid: account.errors.label }]"
          maxlength="50"
          @blur="validateAndSave(account.id)"
        />

        <select
          v-model="account.type"
          class="input select"
          :class="{ invalid: account.errors.type }"
          @change="handleTypeChange(account.id)"
        >
          <option value="" disabled>Выберите тип</option>
          <option value="LOCAL">Локальная</option>
          <option value="LDAP">LDAP</option>
        </select>

        <input
          v-model="account.login"
          type="text"
          placeholder="Введите логин"
          :class="['input', { invalid: account.errors.login }]"
          maxlength="100"
          @blur="validateAndSave(account.id)"
        />

        <input
          v-if="account.type === 'LOCAL'"
          v-model="account.password"
          type="password"
          placeholder="Введите пароль"
          :class="['input', { invalid: account.errors.password }]"
          maxlength="100"
          @blur="validateAndSave(account.id)"
        />
        <div v-else class="password-placeholder"></div>

        <button class="icon-button" type="button" @click="removeAccount(account.id)">
          🗑
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useAccountsStore, type AccountType } from './stores/accounts';

const store = useAccountsStore();

const accounts = computed(() => store.accounts);

type AccountErrors = {
  label: boolean;
  type: boolean;
  login: boolean;
  password: boolean;
};

type LocalAccount = {
  id: string;
  labelInput: string;
  type: AccountType | '';
  login: string;
  password: string;
  errors: AccountErrors;
};

const localAccounts = reactive<LocalAccount[]>([]);

const syncLocalAccounts = () => {
  localAccounts.splice(0, localAccounts.length);
  accounts.value.forEach((account) => {
    localAccounts.push({
      id: account.id,
      labelInput: account.labels.map((item) => item.text).join('; '),
      type: account.type,
      login: account.login,
      password: account.password ?? '',
      errors: {
        label: false,
        type: false,
        login: false,
        password: false,
      },
    });
  });
};

syncLocalAccounts();

watch(accounts, () => {
  syncLocalAccounts();
});

const addAccount = () => {
  store.addAccount();
};

const removeAccount = (id: string) => {
  store.removeAccount(id);
};

const parseLabels = (input: string) =>
  input
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => ({ text: item }));

const validateAccount = (account: LocalAccount) => {
  const labelTooLong = account.labelInput.length > 50;
  const loginInvalid = account.login.trim().length === 0 || account.login.length > 100;
  const typeInvalid = account.type === '';
  const passwordInvalid =
    account.type === 'LOCAL'
      ? account.password.trim().length === 0 || account.password.length > 100
      : false;

  account.errors.label = labelTooLong;
  account.errors.login = loginInvalid;
  account.errors.type = typeInvalid;
  account.errors.password = passwordInvalid;

  return !(labelTooLong || loginInvalid || typeInvalid || passwordInvalid);
};

const validateAndSave = (id: string) => {
  const account = localAccounts.find((item) => item.id === id);
  if (!account) return;

  if (!validateAccount(account)) return;

  const labels = parseLabels(account.labelInput);
  const password = account.type === 'LDAP' ? null : account.password;

  store.updateAccount(id, {
    labels,
    type: account.type,
    login: account.login.trim(),
    password,
  });
};

const handleTypeChange = (id: string) => {
  const account = localAccounts.find((item) => item.id === id);
  if (!account) return;

  if (account.type === 'LDAP') {
    account.password = '';
  }

  validateAndSave(id);
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 16px 40px;
  font-family: "Inter", system-ui, sans-serif;
  color: #1f2a37;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.add-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  background: #fff;
  font-size: 24px;
  cursor: pointer;
}

.hint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #eff4fb;
  border-radius: 12px;
  margin-bottom: 24px;
  color: #425466;
}

.hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #9aa7b8;
  font-weight: 600;
}

.accounts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.accounts-header {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr 1fr 40px;
  gap: 12px;
  color: #7a889b;
  font-size: 14px;
}

.account-row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1fr 1fr 40px;
  gap: 12px;
  align-items: center;
}

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

.password-placeholder {
  height: 40px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #cbd5f5;
  background: #fff;
  cursor: pointer;
}

.input.invalid,
.select.invalid {
  border-color: #ef4444;
}

.empty {
  padding: 16px;
  color: #7a889b;
  border: 1px dashed #cbd5f5;
  border-radius: 12px;
}

@media (max-width: 900px) {
  .accounts-header {
    display: none;
  }

  .account-row {
    grid-template-columns: 1fr;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }
}
</style>
