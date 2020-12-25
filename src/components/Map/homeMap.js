
import darkStyles from '../../google/darkStyles'
import brownStyles from '../../google/brownStyles'
import {lat,lng} from '../../google/currentLocation'
import calculateDistance from '../../store/calculateDistance'
// import marker from '../../google/mapMarker'

let clicked = false
let map, myLocation, latlngBounds
let markers = []
let distanceObj = []
let directionsDisplay = new google.maps.DirectionsRenderer()
export let distance = []

// EXPORT FUNCTIONS
export default function mapCurrentLocation(){
	myLocation = new google.maps.LatLng(lat, lng)
	map = new google.maps.Map(document.getElementById('interactiveMap'), {
				center: new google.maps.LatLng(lat,lng),
				disableDefaultUI: true,
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: brownStyles,
	})
	let marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: "You are Here",
				animation: google.maps.Animation.DROP,
				// icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'

	})
	let info = new google.maps.InfoWindow({
				content: "Current Location"
	})

	google.maps.event.addListener(marker, "click", function(){
		clicked = ! clicked 
		if (clicked == true) {
			info.open(map, marker)
		} else {
			info.close(map, marker)
		}
	})
}

export function centerMap() {
	map.setCenter({
		lat: lat,
		lng: lng
	})
	map.setZoom(17)
}

export function createLocationMarkers(latLng){
	latlngBounds = new google.maps.LatLngBounds()
	clearMarkers()
	for (var x =0; x < latLng.length;x++){
		let locationLat = latLng[x][0].lat
		let locationLng = latLng[x][0].lng
		let locationName = latLng[x][0].name
		createMarkers(locationLat, locationLng, locationName)
		distanceObj.push({
			id: latLng[x][0].id,
			currentLat: lat,
			currentLng:lng,
			newLat: locationLat,
			newLng: locationLng
		})
		distance.push(calculateDistance(distanceObj[x]))
	}
	map.fitBounds(latlngBounds)
}

// SUPPORT FUNCTIONS
function createMarkers(locationLat,locationLng, locationName){
	let markerLocation = new google.maps.LatLng(locationLat, locationLng)
	let marker = new google.maps.Marker({
		position:markerLocation,
		map:map
	})

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

export function clearMarkers(){
	if (markers) {
		for(i in markers) {
			markers[i].setMap(null)
		}
	markers = []
	}
}

export function drawPath(newLat, newLng) {
	if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }

	let directionsService = new google.maps.DirectionsService()
			let poly = new google.maps.Polyline({
				strokeColor: "#FF0000",
				strokeWeight: 4
			})

			let request = {
				origin: new google.maps.LatLng(lat, lng),
				destination: new google.maps.LatLng(newLat,newLng),
				travelMode: google.maps.DirectionsTravelMode.WALKING
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

