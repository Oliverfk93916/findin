
import axios from 'axios'
import url from './URL'

export let storeLocations = []
export async function searchLocations(locations){
	let response = await axios.get(`${url}/locations`).catch(error => console.log(error))
	let data = response.data
	let storeLocations = []
	let storeInfo
	for (let x = 0; x < locations.length; x++){
		storeInfo = data.filter(item => item.store_id == locations[x].store_id)
		let basketPrice = {basketPrice: locations[x].basketPrice}

		storeLocations.push({
			...storeInfo,
			...basketPrice
		})

		// console.log(storeInfo.push(basketPrice))
		// storeLocations.push(storeInfo)
		// storeLocations.basketPrice  = locations[x].basketPrice
		// console.log(newObject)

	}
		return storeLocations.flat()
}
