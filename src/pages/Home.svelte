
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount, afterUpdate, onDestroy} from 'svelte'
  import {searchIngredients} from '../store/searchIngredient'
  import {storeLocations} from '../store/searchLocations'

	//map styles
	import homeMap, {centerMap} from '../components/Map/homeMap'

	let ingredient = ''

	onMount(()=> {
		 homeMap()
	})


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
  <input type="text" class="form-control" style="border-radius: 25px;"id="input" placeholder="Search Ingredient" bind:value={ingredient} on:change={searchIngredients(ingredient)}>
  <i class="fas fa-search-location inputIcon">
</div>



<!-- STORE LIST -->
<div class="list-group listContainer">

<!-- Store 1 -->
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 1</h5>
      <small class="text-muted">disance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li>
  <!-- Store 2 -->

  <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 2</h5>
      <small class="text-muted">disance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
  <!-- Store 3 -->

  <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 3</h5>
      <small class="text-muted">disance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
  <!-- Store 4 -->

 <!-- <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 4</h5>
      <small class="text-muted">disance</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li> -->
</div>






