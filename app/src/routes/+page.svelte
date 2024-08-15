<!-- src/routes/+page.svelte -->
<script>
    import BudgetList from '../components/BudgetList.svelte';
    import IncomeForm from '../components/IncomeForm.svelte';
    import IncomeList from '../components/IncomeList.svelte';
    import ExpenseList from '../components/ExpenseList.svelte';
    import ExpenseForm from '../components/ExpenseForm.svelte';
  </script>
  
  <main>
    <h1>Finance Tracker</h1>
    <BudgetList />
    <IncomeForm />
    <IncomeList />
    <ExpenseForm />
    <ExpenseList />
  </main>
  
  <style>
    /* Add any styles you want here */
  </style>
  
  