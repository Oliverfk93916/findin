
import axios from 'axios'
import url from './URL'

export async function ingredientInfo(ingredient){
	if(ingredient){
		ingredient = ingredient.toLowerCase()
		ingredient = ingredient.replace(/\s/g,'')
		ingredient = ingredient.split(',')
	}
	let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	let data = response.data
	let ing = []
	let filteredData = []
	if(ingredient){
		for (let x = 0; x< ingredient.length; x++) {
			filteredData.push(data.filter(item => item.name == ingredient[x]))
		}
	}
	if (filteredData.length != 0){
		return filteredData.flat()
	} 
	// else {
	// 	return []
	// }
}