<!-- src/routes/+page.svelte -->
<script>
    import BudgetList from '../components/BudgetList.svelte';
    import IncomeForm from '../components/IncomeForm.svelte';
    import IncomeList from '../components/IncomeList.svelte';
  </script>
  
  <main>
    <h1>Finance Tracker</h1>
    <BudgetList />
    <IncomeForm />
    <IncomeList />
  </main>
  
  <style>
    /* Add any styles you want here */
  </style>
  
  