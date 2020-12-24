
import darkStyles from '../../google/darkStyles'
import brownStyles from '../../google/brownStyles'
import {lat,lng} from '../../google/currentLocation'
// import marker from '../../google/mapMarker'

let clicked = false
let map 

export default function mapCurrentLocation(){
	 map = new google.maps.Map(document.getElementById('interactiveMap'), {
				center: new google.maps.LatLng(lat,lng),
				disableDefaultUI: true,
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: brownStyles,
	})
	let marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat,lng),
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