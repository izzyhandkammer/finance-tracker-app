import { writable } from "svelte/store";

export const budgetStore = writable({
    income: [],
    expenses: [],
    threshold: 0,
    thresholdWarning: "",
    totalExpenses: 0
});

export function setThreshold(newThreshold) {
    budgetStore.update((store) => {
        console.log("setting threshold in store as: " + newThreshold);
        return {
            ...store,
            threshold: newThreshold,
        };
    });
    checkExpenses();
}

export function checkExpenses() {
    budgetStore.update((store) => {
        const totalExpenses = store.totalExpenses;
        const threshold = store.threshold;
        const thresholdWarning =
            totalExpenses > threshold ? "Expenses are running too high!" : "";
        return {
            ...store,
            thresholdWarning,
        };
    });
}

export function addIncome(newIncome) {
    budgetStore.update((store) => {
        return {
            ...store,
            income: [...store.income, newIncome]
        };
    });
}

export function addExpense(newExpense) {
    console.log("newExpense: ", newExpense);
    budgetStore.update(store => {
        console.log("current store expenses: ", store.expenses);
        const updatedExpenses = [...store.expenses, newExpense];
        const totalExpenses = updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        console.log("updating expenses in store: ", updatedExpenses);
        console.log("totalExpenses: ", totalExpenses);
        return {
            ...store,
            expenses: updatedExpenses,
            totalExpenses
        };
    });
    checkExpenses();
}