



export function createMarkers(response, status){
	 	let latlngBounds = new google.maps.LatLngBounds()
	 	if(status == google.maps.places.PlacesServiceStatus.OK){
	 		clearMarkers()
	 		for(var i = 0; i < response.length; i++) {
	 			drawMarker(response[i])
	 			latlngBounds.extend(response[i].geometry.location)
	 		}
	 		map.fitBounds(latlngBounds)
	 	} else {
	 		alert('Error')
	 	}
	 }