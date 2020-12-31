
import axios from 'axios'
import url from './URL'
import {searchLocations} from './searchLocations'

export async function searchInventories(ingredient_id){
	// gets data
	let response = await axios.get(`${url}/inventories`).catch(error => console.log(error))
	let data = response.data
	let stores = [] 
	let filteredData = []

	//filters data for each id in ingredient_id
	for (let x = 0; x < ingredient_id.length; x++){
		filteredData.push(data.filter(item => item.ingredient_id == ingredient_id[x] && item.status == true))
	}

	//flattens all data recieved and deletes duplicate stores
	//flattens data
	let flat = filteredData.flat()


	//counts store appearances
	const counts = flat.reduce((c, v) => {
  	c[v.store_id] = (c[v.store_id] || 0) + 1;
 	 return c;
	}, {});

	//counts items searched
	const x = filteredData.length

	//filters for inventories that match every item searched
	let result = flat.filter(v => counts[v.store_id] == x)

	//Deleted duplicate inventories add prices
	// result = result.reduce((items, item) => items.find(x => x.store_id === item.store_id) ? [...items] : [...items, item], [])
	result = Object.values(result.reduce((acc,item) => {
	 	const { store_id } = item;
		const prev = acc[store_id];
		acc[store_id] = prev ? { ...prev, total_price: prev.price+item.price } : {...item};
		return acc;
		}, {}));

	if (result.length == 0) { 
		console.log('no stores have this in stock')
	} else {
		let storePrices = []
		for (let i = 0; i <result.length; i++){
			if (result[i].total_price){
			storePrices.push({store_id: result[i].store_id, basketPrice: result[i].total_price})
		} else {
			storePrices.push({store_id: result[i].store_id, basketPrice: result[i].price})
		}
	}

		// let locations = result.map(item => item.store_id)
		// console.log(locations)
		stores = searchLocations(storePrices)
	}
	return stores
}

// OLD CODE BEFORE MULTIPLE INPUTS
// let response = await axios.get(`${url}/inventories`).catch(error => console.log(error))
// 	let data = response.data
// 	let stores = [] 
// 	let filteredData = []
// 	filteredData = data.filter(item => item.ingredient_id == ingredient_id && item.status == true)
// 	if (filteredData.length == 0){ 
// 		console.log('no stores have this in stock')
// 	} else {
// 		let locations = filteredData.map(item => item.store_id)
// 		stores = searchLocations(locations)
// 	}
// 	console.log(stores)
// 	return stores
// }






