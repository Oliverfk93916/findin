
import axios from 'axios'
import url from './URL'
import {searchInventories} from './searchInventories'

export async function searchIngredients(ingredient){
	let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	let data = response.data
	let ing = []
	let filteredData = []
	filteredData = data.filter(item => item.name == ingredient)
	if (filteredData.length == 0) {
	} else {
		let ingredient_id = filteredData[0].ingredient_id
		ing = searchInventories(ingredient_id)
	}
	return ing
}