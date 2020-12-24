
import darkStyles from '../../google/darkStyles'
import brownStyles from '../../google/brownStyles'
import {lat,lng} from '../../google/currentLocation'
// import marker from '../../google/mapMarker'


export default function mapCurrentLocation(){
	let map = new google.maps.Map(document.getElementById('interactiveMap'), {
				center: new google.maps.LatLng(lat,lng),
				disableDefaultUI: true,
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: brownStyles,
			}
		)
	let marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat,lng),
				map: map,
				title: "You are Here",
				animation: google.maps.Animation.DROP
			})

}