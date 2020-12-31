
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount, afterUpdate, onDestroy} from 'svelte'
  import {searchIngredients} from '../store/searchIngredient'
  import {storeLocations} from '../store/searchLocations'
  import {ingredientInfo} from '../store/ingredientInfo'
  import optimiseRoute from '../store/optimiseRoute'

	//Map styles
	import homeMap, {distance, centerMap, createLocationMarkers, drawPath, clearMarkers, getTimeTaken} from '../components/Map/homeMap'

  //Global variables
	let ingredient, shopLatx, shopLngx, distances
  let locations = searchIngredients(ingredient)
  let info = ingredientInfo(ingredient)
  let locationsDistanceObj = []
  let ingredientObj = []
  let toggle = 1
  let travelMode = google.maps.TravelMode.WALKING
  let selectedMode = google.maps.DirectionsTravelMode.WALKING
  let searched = 0


  //On startup open map
	onMount(()=> {
		 homeMap()
	})

  //Handles each key input
  function handleSubmit(ingredient){
    // console.log(ingredient)
    info = ingredientInfo(ingredient)
    locations = searchIngredients(ingredient)

    //Will probably need to fix when searching for multiple items. 
    info.then(function(result) {
      if (result){
        ingredientObj = []
        for(var x = 0; x < result.length; x++){
           ingredientObj.push(result[x])
        }
      } else {
        ingredientObj = []
        shopLatx = null
        shopLngx = null
      }
    })
    locations.then(function(result) {
      if (result.length != 0) {
        distances = createLocationMarkers(result, travelMode)
        locationsDistanceObj = optimiseRoute(result, distances)
        searched = 1
        for (var x = 0; x < locationsDistanceObj.length; x++){
          getTravelInfo(x,locationsDistanceObj[x][0].lat,locationsDistanceObj[x][0].lng, travelMode)
        }
      } else {
        locationsDistanceObj = []
        clearMarkers()
        homeMap()
      }
    })
  }

  //Draws path from current location to store location selected
  function routeMe(shopLat, shopLng, selectedMode) {
    shopLatx = shopLat
    shopLngx = shopLng
    drawPath(shopLat, shopLng, selectedMode)
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  //Handles transport toggle button and updates all transport info
  function transportToggle(){
    toggle += 1
    if (toggle > 4){
      toggle = 1
    }
    switch (toggle){
      case 1: 
        selectedMode = google.maps.DirectionsTravelMode.WALKING
        travelMode = google.maps.TravelMode.WALKING 
        break;
      case 2: 
        selectedMode = google.maps.DirectionsTravelMode.BICYCLING
        travelMode = google.maps.TravelMode.BICYCLING 
        break;
      case 3:
        selectedMode = google.maps.DirectionsTravelMode.DRIVING
        travelMode = google.maps.TravelMode.DRIVING 
        break;
      case 4:
        selectedMode = google.maps.DirectionsTravelMode.TRANSIT
        travelMode = google.maps.TravelMode.TRANSIT 
        break;
      default:
       selectedMode = google.maps.DirectionsTravelMode.WALKING
       travelMode = google.maps.TravelMode.WALKING
    } if (shopLatx != null) {
      drawPath(shopLatx, shopLngx, selectedMode)
    } 
    for (var x = 0; x < locationsDistanceObj.length; x++){
          getTravelInfo(x,locationsDistanceObj[x][0].lat,locationsDistanceObj[x][0].lng, travelMode)
        }
  }

  //Support function to get duration and distance
  function getTravelInfo(i,shopLat, shopLng, travelMode){
    getTimeTaken(i,shopLat, shopLng, travelMode)
  }
</script>

<!-- MENU BARS -->
<div>
	<button class="menuContainer">
		<i class="fas fa-bars menuButton">
	</button>
</div>

<!-- MODES OF TRANSPORT BUTTON-->
{#if toggle == 1}
  <div>
    <button class="transportContainer" on:click|preventDefault={()=> transportToggle()}>
      <i class="fas fa-bus transportButton">
    </button>
  </div>
{/if}

<!-- MAP -->
	<div id="interactiveMap" class="mapHome"></div>

<!-- RE-CENTER BUTTON-->
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
  {#if locationsDistanceObj.length != 0}
    {#each locationsDistanceObj as shop, i}
    <!-- {console.log(locationsDistanceObj)} -->
      <!-- {#each ingredientObj as ing} -->
        <li class="list-group-item list-group-item-action" id ={shop[0].id} style="z-index: 1" on:click|preventDefault={() => routeMe(shop[0].lat,shop[0].lng, selectedMode)}>
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Shop name: {shop[0].name}</h5>
          <small class="text-muted" id={`duration${i}`}></small>
          <small class="text-muted" id={`distance${i}`}></small>
          <small class="text-muted">{`Price: £${shop.basketPrice}`}</small>
        </div>
    
    <!--     <p class="mb-1">Name: {ing.name}</p>
        <small class="text-muted">Size: {ing.size}</small> -->
        </li>
      <!-- {/each} -->
    {/each}
    <!-- OEN APP STATE INSTRUCTION TO SEARCH FOR AN ITEM -->
    <!-- {:else if searched == 0}
     <li class="list-group-item list-group-item-action" style="z-index: 1;margin-top: 20px" >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Please search for an item</h5>
          <small class="text-muted"></small>
          <small class="text-muted"></small>
        </div>
         </li> -->
          <!-- AFTER ONE SUCCESSFUL SEARCH-->
    {:else if searched > 0}
     <li class="list-group-item list-group-item-action" style="z-index: 1;margin-top: 20px" >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">One or more of your items are not within this radius...</h5>
          <small class="text-muted"></small>
          <small class="text-muted"></small>
        </div>
      </li>
  {/if}
</div>





