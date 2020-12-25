
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount, afterUpdate, onDestroy} from 'svelte'
  import {searchIngredients} from '../store/searchIngredient'
  import {storeLocations} from '../store/searchLocations'
  import {ingredientInfo} from '../store/ingredientInfo'

	//map styles
	import homeMap, {centerMap} from '../components/Map/homeMap'

	let ingredient
  let locations = searchIngredients(ingredient)
  let info = ingredientInfo(ingredient)

	onMount(()=> {
		 homeMap()
	})


  function handleSubmit(ingredient){
    // info = []
    // locations = []
    info = ingredientInfo(ingredient)
    locations = searchIngredients(ingredient)

    let infoInfo = info.then(function(result) {
      if (result){
      alert(result.name)
    } else {
      alert('no')
    }
    })

    let locationsInfo = locations.then(function(result) {
      alert(result[0][0].name)
    })


    
  }

</script>

<!-- MENU BARS -->
<div>
	<button class="menuContainer">
		<i class="fas fa-bars menuButton">
	</button>
</div>

<!-- MAP -->
	<div id="interactiveMap" class="mapHome">
	</div>

<!-- RE-CENTER -->
<div>
  <button on:click={centerMap} class="centerContainer">
    <i class="far fa-compass centerButton">
  </button>
</div>
<!-- INGREDIENT SEARCH -->
<div class="input-group mb-3 input-group-lg ingredientInput" style="position: absolute;">
  <input type="text" class="form-control" style="border-radius: 25px;"id="input" placeholder="Search Ingredient" bind:value={ingredient}>
  <button on:click={handleSubmit(ingredient)} style="width: 50px;"></button>
  <i class="fas fa-search-location inputIcon">
</div>



<!-- STORE LIST -->
<div class="list-group listContainer">
{#await info then ing}
{#await locations then store}
  {#each store as shop, i}
   <li class="list-group-item list-group-item-action" style="z-index: 1">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">Shop name: {shop[0].name}</h5>
        <small class="text-muted">distance</small>
    </div>
  <p class="mb-1">Name: {ing.name}</p>
    <small class="text-muted">Size: {ing.size}</small>
  </li>
  {/each}
{/await}
{/await}



<!-- Store 1 -->
   
<!--   {console.log(shop[0].name)} -->
  <!-- Store 2 -->

  <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 2</h5>
      <small class="text-muted">distance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
  <!-- Store 3 -->

  <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 3</h5>
      <small class="text-muted">distance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
  <!-- Store 4 -->

 <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 4</h5>
      <small class="text-muted">distance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
</div>






