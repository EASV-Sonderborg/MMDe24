<script lang="ts">
  import ShoppingForm from /components/shoppingForm.svelte;


  type Item= {
    id: string;
    name: string;
    bought: boolean;
  }

  let items: $state<Item[]>([]);

    function addItem(newItem: string) {
    console.log(newItem);
  }
</script>


<main>
  <h1>Shopping List</h1>
  <ShoppingForm {addItem}/>
</main>

<style>


</style>
