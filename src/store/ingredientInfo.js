
import axios from 'axios'
import url from './URL'

export async function ingredientInfo(ingredient){
	let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	let data = response.data
	let ing = []
	let filteredData = []
	filteredData = data.filter(item => item.name == ingredient)
	return filteredData[0]
}