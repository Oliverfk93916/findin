
import darkStyles from '../../google/darkStyles'
import brownStyles from '../../google/brownStyles'
import {lat,lng} from '../../google/currentLocation'
import calculateDistance from '../../store/calculateDistance'

let clicked = false
let map, myLocation, latlngBounds
let markers = []
let marker = []
let directionsDisplay = new google.maps.DirectionsRenderer()
export let distance = []
let distances = []


// EXPORT FUNCTIONS

// Draws current location on map (currently hardcoded to my house)
export default function mapCurrentLocation(){

	//Creates location
	myLocation = new google.maps.LatLng(lat, lng)

	//Creates default map with styling
	map = new google.maps.Map(document.getElementById('interactiveMap'), {
		center: new google.maps.LatLng(lat,lng),
		disableDefaultUI: true,
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: brownStyles,
	})

	//Creates marker on default map
	marker = new google.maps.Marker({
		position: myLocation,
		map: map,
		title: "You are Here",
		animation: google.maps.Animation.DROP,
		// icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
	})

	//Creates Info window with content
	let info = new google.maps.InfoWindow({
		content: "Current Location"
	})

	//Lets the info window appear and close on click
	google.maps.event.addListener(marker, "click", function(){
		clicked = ! clicked 
		if (clicked == true) {
			info.open(map, marker)
		} else {
			info.close(map, marker)
		}
	})
}
	
//Centers the map and resets the zoom
export function centerMap() {
	map.setCenter({
		lat: lat,
		lng: lng
	})
	map.setZoom(17)
}

//Takes in an array of objects clears current markers and sets new ones
export function createLocationMarkers(latLng, travelMode){
	//Initiates map bounds
	latlngBounds = new google.maps.LatLngBounds()

	//Clears all current markers
	clearMarkers()

	let distanceObj = []

	//Loop through array and create markers
	for (var x = 0; x < latLng.length;x++){
		let locationLat = latLng[x][0].lat
		let locationLng = latLng[x][0].lng
		let locationName = latLng[x][0].name

		//Use lat, lng and name to create markers function
		createMarkers(locationLat, locationLng, locationName)

		//Consolidate information needed to calculate distance into the distanceObj
		distanceObj.push({
			id: latLng[x][0].id,
			currentLat: lat,
			currentLng: lng,
			newLat: locationLat,
			newLng: locationLng,
			travelMode:travelMode
		})

		//Use information in object to return distance and id from Calculate Distance function
		distances.push(getDistance(distanceObj[x]))
	}
	
	distances = distances.reduce((items, item) => items.find(x => x.id === item.id) ? [...items] : [...items, item], [])
	//Resize map to fit all bounds
	map.fitBounds(latlngBounds)
	return distances
}

//Clears all other markers for use when drawing path
export function clearMarkers(){
	if (markers) {
		for(let i in markers) {
			markers[i].setMap(null)
			centerMap()
		}
	markers = []
	}
}

//Gets locations and draws paths 
export function drawPath(newLat, newLng, selectedMode) {
	clearMarkers()
	clearCurrentMarker()

	if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }

	let directionsService = new google.maps.DirectionsService()
	let poly = new google.maps.Polyline({
		strokeColor: "#FF0000",
		strokeWeight: 3
	})

	let request = {
		origin: new google.maps.LatLng(lat, lng),
		destination: new google.maps.LatLng(newLat,newLng),
		travelMode: selectedMode
	}

	directionsService.route(request, function(response, status){
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay = new google.maps.DirectionsRenderer({
				map:map,
				polylineOptions: poly, 
				directions: response
			})
		}
	})
}


//Gets shop location info and updates small elements with distance and duration
export function getTimeTaken(i,shopLat, shopLng, selectedMode){
	const origin = {lat,lng}
	const destination = {lat: shopLat, lng: shopLng}
	if(destination){
	const service = new google.maps.DistanceMatrixService();
  	service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: selectedMode,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
    if (status !== "OK") {
    	alert("Error was: " + status);
    	} else {
    		if(response){
        	const originList = response.originAddresses;
	        const destinationList = response.destinationAddresses;
	        const durationDiv = document.getElementById(`duration${i}`)
	        const distanceDiv = document.getElementById(`distance${i}`)
	        distanceDiv.innerHTML = 'Distance: <br>' + response.rows[0].elements[0].distance.text
	        durationDiv.innerHTML = 'Duration: <br>' + response.rows[0].elements[0].duration.text
	   	 }
		}
	})
  }
}

// SUPPORT FUNCTIONS

//Creates and displays map markers
function createMarkers(locationLat,locationLng, locationName){
	let markerLocation = new google.maps.LatLng(locationLat, locationLng)
	let marker = new google.maps.Marker({
		position:markerLocation,
		map:map
	})
	markers.push(marker)
	latlngBounds.extend(markerLocation)
	let infoWindow = new google.maps.InfoWindow({
	 	content: locationName
 	})
 	google.maps.event.addListener(marker, 'click', function(){
	 	clicked = ! clicked 
		if (clicked == true) {
			infoWindow.open(map, marker)
		} else {
			infoWindow.close(map, marker)
		}
	})
}

//Clears current location marker for use when drawing path
function clearCurrentMarker(){
	marker.setMap(null)
}

//Gets distances as the crow flies for use by sorting
function getDistance(distanceObj){
	let dist = calculateDistance(distanceObj)
	return dist
}





















