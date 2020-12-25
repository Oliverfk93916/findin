
import axios from 'axios'
import url from './URL'

export let storeLocations = []
export async function searchLocations(locations){

	let response = await axios.get(`${url}/locations`).catch(error => console.log(error))
	let data = response.data
	let storeLocations = []
	for (let x=0; x <locations.length; x++){
		storeLocations.push(data.filter(item => item.store_id == locations[x]))
	}
	return storeLocations
}