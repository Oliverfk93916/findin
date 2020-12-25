
export default function calculateDistance(distanceObj){

	let currentLatRadians = distanceObj.currentLat*Math.PI/180;
	let currentLngRadians = distanceObj.currentLng*Math.PI/180;
	let newLatRadians = distanceObj.newLat*Math.PI/180;
	let newLngRadians = distanceObj.newLng*Math.PI/180;
	let distance = 3959 * Math.acos(Math.cos(currentLatRadians) * Math.cos(newLatRadians) * Math.cos(currentLngRadians - newLngRadians) + Math.sin(currentLatRadians) * Math.sin(newLatRadians));

	// console.log(Math.round(distance*10)/10)
	return {distance: Math.round(distance*100)/100, id:distanceObj.id}
}