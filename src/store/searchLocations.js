
import axios from 'axios'
import url from './URL'

export let storeLocations = []
export async function searchLocations(locations){

	const response = await axios.get(`${url}/locations`).catch(error => console.log(error))
	const data = response.data

	for (let x=0; x <locations.length; x++){
		storeLocations.push(data.filter(item => item.store_id == locations[x]))
	}
	return storeLocations
}