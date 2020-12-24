

<script>
	//pages
	import Home from './pages/Home.svelte'
	import Settings from './pages/Settings.svelte'

	// router
	import { Router, Route, Link } from "svelte-routing"

</script>

<Router>
	<Route path="/" component={Home} />
	<Route path="/settings" component={Settings} />
</Router>