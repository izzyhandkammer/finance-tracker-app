<script>
    import { onMount } from "svelte";

    let monthlyData = {};

    onMount(async () => {
        try {
            const response = await fetch("http://localhost:4004/report/monthly");
            if (response.ok) {
                monthlyData = await response.json();
            } else {
                console.error("Failed to fetch monthly data");
            }
        } catch (error) {
            console.error("Error fetching monthly data:", error);
        }
    });
</script>

<h2>Monthly Breakdown</h2>
<table>
    <thead>
        <tr>
            <th>Month</th>
            <th>Income</th>
            <th>Expenses</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(monthlyData) as [month, data]}
            <tr>
                <td>{month}</td>
                <td>${data.income ? data.income.toFixed(2) : "0.00"}</td>
                <td>${data.expense ? data.expense.toFixed(2) : "0.00"}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 50%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
    }
</style>
