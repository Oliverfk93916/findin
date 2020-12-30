
import axios from 'axios'
import url from './URL'
import {searchInventories} from './searchInventories'

import fuzzball from 'fuzzball/dist/fuzzball.umd.min.js'

export async function searchIngredients(ingredient){
	if(ingredient){
		ingredient = ingredient.toLowerCase()
		ingredient = ingredient.replace(/\s/g,'')
		ingredient = ingredient.split(',')
	}
	let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
	let data = response.data

	//testing fuzzy matching
	// let ratio = fuzzball.ratio("hello world", "hiyyo wyrld")
	// console.log(ratio)


	let ing = []
	let filteredData = []
	let ingredient_id = []
	if(ingredient){
		for (let x = 0; x< ingredient.length; x++) {
			filteredData.push(data.filter(item => item.name == ingredient[x]))
		} 
		//number of items in the array, increases after a ',' due to split
		let numSearches = filteredData.length
		filteredData = filteredData.flat()
		let matchedSearches = filteredData.length
		if (filteredData.length == 0) {
			} else {
				for (let i = 0; i < numSearches; i++){
					if(filteredData[i]){
						ingredient_id.push(filteredData[i].ingredient_id)
						ingredient_id = ingredient_id.filter(function(item, pos) {
    					return ingredient_id.indexOf(item) == pos	
					})
					} else {
						ingredient_id = ['']
					}
				}
				if (ingredient_id != ''){
				ing = searchInventories(ingredient_id)
			} else {
				ing = ''
			}
			}
		}
	return ing
}

//OLD RESPONSE BEFORE MULTIPLE WORDS
// let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
// 	let data = response.data
// 	let ing = []
// 	let filteredData = []
// 	filteredData = data.filter(item => item.name == ingredient)
// 	if (filteredData.length == 0) {
// 	} else {
// 		let ingredient_id = filteredData[0].ingredient_id
// 		ing = searchInventories(ingredient_id)
// 	}
// 	console.log(ing)
// 	return ing
// }

