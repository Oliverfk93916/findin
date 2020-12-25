
import axios from 'axios'
import url from './URL'
import {searchInventories} from './searchInventories'

export async function searchIngredients(ingredient){
	const response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	const data = response.data
	let ing = []
	let filteredData = []
	filteredData = data.filter(item => item.name == ingredient)
	if (filteredData.length == 0) {
	} else {
		const ingredient_id = filteredData[0].ingredient_id
		ing = searchInventories(ingredient_id)
	}
	return ing
}