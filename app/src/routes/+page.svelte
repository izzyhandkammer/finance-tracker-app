<script>
    import { budgetStore } from "../stores/budgetstore.js";

    import BudgetList from "../components/BudgetList.svelte";
    import IncomeForm from "../components/IncomeForm.svelte";
    import IncomeList from "../components/IncomeList.svelte";
    import ExpenseList from "../components/ExpenseList.svelte";
    import ExpenseForm from "../components/ExpenseForm.svelte";
    import PieChart from "../components/PieChart.svelte";
    import MonthlyReport from "../components/MonthlyReport.svelte";
    import ReportSummary from "../components/ReportSummary.svelte";

    import { derived } from "svelte/store";

    const pieData = derived(budgetStore, ($budgetStore) => {
        const totalExpenses = $budgetStore.expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
        );
        const disposableIncome =
            $budgetStore.income.reduce((sum, inc) => sum + inc.amount, 0) -
            totalExpenses;

        console.log("Pie Data:", {
            labels: ["Disposable Income", "Expenses"],
            datasets: [
                {
                    label: "Budget Breakdown",
                    data: [disposableIncome, totalExpenses],
                    backgroundColor: ["#36A2EB", "#FF6384"],
                },
            ],
        });

        return {
            labels: ["Disposable Income", "Expenses"],
            datasets: [
                {
                    label: "Budget Breakdown",
                    data: [disposableIncome, totalExpenses],
                    backgroundColor: ["#36A2EB", "#FF6384"],
                },
            ],
        };
    });
</script>

<main>
    <h1>Finance Tracker</h1>
    <BudgetList />
    <IncomeForm />
    <IncomeList />
    <ExpenseForm />
    <ExpenseList />
    <h1>Budget Breakdown:</h1>
    <PieChart data={$pieData} />
    <MonthlyReport />
    <ReportSummary />
</main>

<style>
    /* Add any styles you want here */
</style>
