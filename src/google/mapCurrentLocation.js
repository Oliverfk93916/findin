
import darkStyles from '../google/darkStyles'
import brownStyles from '../google/brownStyles'


export default function mapCurrentLocation(){
	let map = new google.maps.Map(document.getElementById('interactiveMap'), {
				center: new google.maps.LatLng(51.52641389999999,-0.051092),
				disableDefaultUI: true,
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: brownStyles,
			}
		)
}