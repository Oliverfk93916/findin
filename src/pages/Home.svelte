
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

	<div style="position: fixed;top: 10px;left: 10px; z-index: 2">
	<span>
		<button>
			<i class="fas fa-bars">
		</button>
	</span>
	</div>
	<div id="interactiveMap" class="mapHome" style="z-index: 1; position: fixed;">
	</div>

<!-- <form class="px-5 py-3" style="width: 60%; margin-left: 20%;">
    <div class="mb-3">
    	<label for="ingredient" class="form-label" style="color: #000; text-align: center">INGREDIENT</label>
		<input type="text" id="ingredient" class="form-control" bind:value={ingredient}>
    </div>
</form> -->
<div class="mb-3 ingredientInput" style="position: absolute;">
  <label for="formGroupExampleInput" class="form-label" style="margin-bottom: 0">INGREDIENT</label>
  <input type="text" class="form-control" id="formGroupExampleInput">
  </div>
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






