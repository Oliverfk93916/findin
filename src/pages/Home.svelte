
<script>
	import {link,navigate} from 'svelte-routing'
	import {onMount} from 'svelte'

	//map styles
	import mapCurrentLocation from '../google/mapCurrentLocation'

	let ingredient = ''

	onMount(()=> {
		 mapCurrentLocation()
	})

</script>

<div>
  <span>
		<button class="menuContainer">
			<i class="fas fa-bars menuButton">
		</button>
	</span>
	</div>

	<div id="interactiveMap" class="mapHome" style="z-index: 1; position: fixed;">
	</div>

<!-- INGREDIENT SEARCH -->
<div class="input-group mb-3 input-group-lg ingredientInput" style="position: absolute;">
  <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Search Ingredient" bind:value={ingredient}>
  <i class="fas fa-search-location inputIcon">
</div>



<!-- STORE LIST -->
<div class="list-group" style="width: 95%; margin-left:2.5%; margin-top: 2.5%">

  	<!-- Store 1 -->
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 1</h5>
      <small class="text-muted">rating</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li>
  <!-- Store 2 -->
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 2</h5>
      <small class="text-muted">rating</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li>
  <!-- Store 3 -->
  <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 3</h5>
      <small class="text-muted">rating</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li>
  <!-- Store 4 -->
 <li class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Store 4</h5>
      <small class="text-muted">rating</small>
    </div>
    <p class="mb-1">Item.</p>
    <small class="text-muted">more item info.</small>
  </li>
</div>






