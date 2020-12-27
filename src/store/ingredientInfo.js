
import axios from 'axios'
import url from './URL'

export async function ingredientInfo(ingredient){
	let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	let data = response.data
	let ing = []
	let filteredData = []
	filteredData = data.filter(item => item.name == ingredient)
	if (filteredData.length != 0){
		return filteredData[0]
	} 
	// else {
	// 	return []
	// }
}