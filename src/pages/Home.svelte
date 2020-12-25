
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount, afterUpdate, onDestroy} from 'svelte'
  import {searchIngredients} from '../store/searchIngredient'
  import {storeLocations} from '../store/searchLocations'
  import {ingredientInfo} from '../store/ingredientInfo'

	//map styles
	import homeMap, {distance, centerMap, createLocationMarkers, drawPath, clearMarkers} from '../components/Map/homeMap'

	let ingredient
  let locations = searchIngredients(ingredient)
  let info = ingredientInfo(ingredient)

	onMount(()=> {
		 homeMap()
	})


  function handleSubmit(ingredient){
    info = ingredientInfo(ingredient)
    locations = searchIngredients(ingredient)

    locations.then(function(result) {
      if (result.length != 0) {
         createLocationMarkers(result)
      } else {
        clearMarkers()
      }
    })  
  }

  function getDistance (id){
    for (let x = 0; x < distance.length; x++){
      if (distance[x].id == id){
        return distance[x].distance
      }
    }
    // return hello.newLat
  }

  function routeMe(one, two) {
    drawPath(one, two)
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
  <input type="text" class="form-control" style="border-radius: 25px;"id="input" placeholder="Search Ingredient" bind:value={ingredient} on:input={handleSubmit(ingredient)} >
  <i class="fas fa-search-location inputIcon">
</div>


<!-- STORE LIST -->
<div class="list-group listContainer">
  {#await info then ing}
    {#await locations then store}
      {#each store as shop, i}
        <li class="list-group-item list-group-item-action" id ={shop[0].id} style="z-index: 1" on:click|preventDefault={() => routeMe(shop[0].lat,shop[0].lng)}>
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Shop name: {shop[0].name}</h5>
          <small class="text-muted">{getDistance(shop[0].id)}m</small>
        </div>
        <p class="mb-1">Name: {ing.name}</p>
        <small class="text-muted">Size: {ing.size}</small>
        </li>
      {/each}
    {/await}
  {/await}
</div>





