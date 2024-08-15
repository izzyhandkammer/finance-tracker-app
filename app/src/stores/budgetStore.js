import { writable } from 'svelte/store';

export const budgetStore = writable({
    income: [],
    expenses: []
});

export function addIncome(newIncome) {
    budgetStore.update(store => {
        return {
            ...store,
            income: [...store.income, newIncome]
        };
    });
}

export function addExpense(newExpense) {
    budgetStore.update(store => {
        return {
            ...store,
            expenses: [...store.expenses, newExpense]
        };
    });
}
