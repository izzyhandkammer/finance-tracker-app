<script>
    let amount = '';
    let category = '';
    let date = '';
  
    async function submitExpense() {
      const response = await fetch('http://localhost:4002/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, category, date }),
      });
      if (response.ok) {
        // Clear form and handle success
        amount = '';
        category = '';
        date = '';
      } else {
        // Handle error

      }
    }
  </script>
  
  <form on:submit|preventDefault={submitExpense}>
    <input type="number" bind:value={amount} placeholder="Amount" required />
    <input type="text" bind:value={category} placeholder="Category" required />
    <input type="date" bind:value={date} required />
    <button type="submit">Add Expense</button>
  </form>
  