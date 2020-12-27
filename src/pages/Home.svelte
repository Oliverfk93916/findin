
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount, afterUpdate, onDestroy} from 'svelte'
  import {searchIngredients} from '../store/searchIngredient'
  import {storeLocations} from '../store/searchLocations'
  import {ingredientInfo} from '../store/ingredientInfo'
  import orderByDistance from '../store/orderByDistance'

	//map styles
	import homeMap, {distance, centerMap, createLocationMarkers, drawPath, clearMarkers} from '../components/Map/homeMap'

	let ingredient
  let locations = searchIngredients(ingredient)
  let info = ingredientInfo(ingredient)
  let locationsDistanceObj = []

	onMount(()=> {
		 homeMap()
	})


  function handleSubmit(ingredient){
    info = ingredientInfo(ingredient)
    locations = searchIngredients(ingredient)

    //Something here to remove the await block for the ingredient. - Will probably need to fix when searching for multiple items. 
    // info.then(function(result) {
    //   if (result.length != 0){
    //     let newInfo = result
    //   }
    // })

    locations.then(function(result) {
      if (result.length != 0) {
        let distances = createLocationMarkers(result)
        locationsDistanceObj = orderByDistance(result, distances)
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
      {#each locationsDistanceObj as shop, i}
        <li class="list-group-item list-group-item-action" id ={shop.id} style="z-index: 1" on:click|preventDefault={() => routeMe(shop.lat,shop.lng)}>
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Shop name: {shop.name}</h5>
          <small class="text-muted">{getDistance(shop.id)}m</small>
        </div>
        <p class="mb-1">Name: {ing.name}</p>
        <small class="text-muted">Size: {ing.size}</small>
        </li>
      {/each}
    {/await}
</div>





