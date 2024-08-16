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
    import ThresholdForm from "../components/ThresholdForm.svelte";

    import { derived } from "svelte/store";

    const pieData = derived(budgetStore, ($budgetStore) => {
        const totalExpenses = $budgetStore.expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
        );
        const disposableIncome =
            $budgetStore.income.reduce((sum, inc) => sum + inc.amount, 0) -
            totalExpenses;

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
    <div class="cols">
        <div class="left">
            <div class="box">
                <h1>Income Tracker</h1>
                
                <BudgetList />
                <IncomeForm />
                <IncomeList />
            </div>
            <div class="box">
                <h1>Expense Tracker</h1>
                <ThresholdForm />
                <ExpenseForm />
                <ExpenseList />
            </div>
        </div>
        <div class="right">
            <div class="box">
                <h1>Budget Breakdown</h1>
                <PieChart data={$pieData} />
            </div>
        </div>
        <div class="box monthly-report">
            <MonthlyReport />
            <ReportSummary />
        </div>
    </div>
</main>

<style>
    * {
        font-family: Helvetica, sans-serif;
        background-color: aliceblue;
    }
    .box {
        background: rgba(162, 242, 243, 0.32);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(6.2px);
        -webkit-backdrop-filter: blur(6.2px);
        border: 1px solid rgba(162, 242, 243, 0.63);
        padding: 10px;
        margin: 10px;
    }
    .left {
        display: flex;
        flex-direction: column;
    }
    .right {
        display: flex;
        flex-direction: column;
    }
    .cols {
        display: flex;
        flex-direction: row;
    }
    .monthly-report {
        width: 20%;
    }
</style>
