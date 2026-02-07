import { defineStore } from 'pinia';

export type AccountType = 'LDAP' | 'LOCAL';

export type LabelItem = {
  text: string;
};

export type AccountRecord = {
  id: string;
  labels: LabelItem[];
  type: AccountType | '';
  login: string;
  password: string | null;
};

const STORAGE_KEY = 'account-management-records';

const createEmptyAccount = (): AccountRecord => ({
  id: crypto.randomUUID(),
  labels: [],
  type: '',
  login: '',
  password: '',
});

const loadFromStorage = (): AccountRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AccountRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      labels: Array.isArray(item.labels) ? item.labels : [],
      type: item.type ?? '',
      login: item.login ?? '',
      password: item.password ?? '',
    }));
  } catch {
    return [];
  }
};

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: loadFromStorage() as AccountRecord[],
  }),
  actions: {
    addAccount() {
      this.accounts.push(createEmptyAccount());
      this.persist();
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((account) => account.id !== id);
      this.persist();
    },
    updateAccount(id: string, payload: Partial<AccountRecord>) {
      const index = this.accounts.findIndex((account) => account.id === id);
      if (index === -1) return;
      this.accounts[index] = { ...this.accounts[index], ...payload };
      this.persist();
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts));
    },
  },
});
