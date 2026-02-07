<template>
  <div class="page">
    <header class="header">
      <h1>Учетные записи</h1>
      <UIButton class="add-button" @click="addAccount">+</UIButton>
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

      <AccountRow
        v-for="account in localAccounts"
        :key="account.id"
        :account="account"
        @remove="removeAccount"
        @validate="validateAndSave"
        @type-change="handleTypeChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import AccountRow, { type LocalAccount } from './components/AccountRow.vue';
import UIButton from './components/UIButton.vue';
import { useAccountsStore } from './stores/accounts';

const store = useAccountsStore();

const accounts = computed(() => store.accounts);

const localAccounts = reactive<LocalAccount[]>([]);

const createLocalAccount = (account: (typeof accounts.value)[number]): LocalAccount => ({
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

const syncLocalAccounts = () => {
  const nextAccounts = accounts.value;
  const existingIds = new Set(localAccounts.map((item) => item.id));

  nextAccounts.forEach((account) => {
    if (!existingIds.has(account.id)) {
      localAccounts.push(createLocalAccount(account));
    }
  });

  const nextIds = new Set(nextAccounts.map((account) => account.id));
  for (let index = localAccounts.length - 1; index >= 0; index -= 1) {
    if (!nextIds.has(localAccounts[index].id)) {
      localAccounts.splice(index, 1);
    }
  }
};

watch(
  accounts,
  () => {
    syncLocalAccounts();
  },
  { immediate: true },
);

const addAccount = () => {
  store.addAccount();
  syncLocalAccounts();
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
}
</style>
