
import axios from 'axios'
import url from './URL'

export let storeLocations = []
export async function searchLocations(locations){
	let response = await axios.get(`${url}/locations`).catch(error => console.log(error))
	let data = response.data
	// console.log(data)

	let weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday']

	var date = new Date()

	let day = date.getDay()

	let today = date.toLocaleString('en-GB', {weekday:'long'}).toLowerCase()

	let currentTime = date.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})

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

	//Opening days filter
	storeLocations = storeLocations.filter((item) => item[0].days_open[today] === true)

	// Opening hours filter CURRENTLY DOESN'T HANDLE PAST MIDNIGHT
	storeLocations = storeLocations.filter((item)=> item[0].opens < currentTime && item[0].closes > currentTime)


		return storeLocations.flat()
}
