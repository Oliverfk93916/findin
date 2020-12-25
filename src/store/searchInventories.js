
import axios from 'axios'
import url from './URL'
import {searchLocations} from './searchLocations'

export async function searchInventories(ingredient_id){
	
	const response = await axios.get(`${url}/inventories`).catch(error => console.log(error))
	const data = response.data
	let stores = [] 
	const filteredData = data.filter(item => item.ingredient_id == ingredient_id && item.status == true)
	if (filteredData.length == 0){ 
		console.log('no stores have this in stock')
	} else {
		const locations = filteredData.map(item => item.store_id)
		stores = searchLocations(locations)
	}
	return stores
}