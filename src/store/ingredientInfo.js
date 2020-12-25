
import axios from 'axios'
import url from './URL'

export async function ingredientInfo(ingredient){
	const response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	const data = response.data
	let ing = []
	let filteredData = []
	filteredData = data.filter(item => item.name == ingredient)
	return filteredData[0]

}