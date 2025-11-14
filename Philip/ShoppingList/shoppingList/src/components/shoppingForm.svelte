<script lang="ts">
    let newItem = $state("");


    let { 
        addItem 
    } : {
        addItem: (newItem: string) => void
    } = $props();

        function formSubmit(e: SubmitEvent) {
        e.preventDefault();
        addItem(newItem);
        newItem = "";
    }
</script>




<form onsubmit={formSubmit}>
  <label>
    Ny vare:
    <input name="newItem" bind:value={newItem} />
  </label>
  <button type="submit">Tilføj Vare</button>
</form>