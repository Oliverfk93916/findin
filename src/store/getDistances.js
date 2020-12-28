
import {lat,lng} from '../google/currentLocation'

export function getDistances(distanceObj){
	let test = []
const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
      const matrixOptions = {
        origins: ["41.8848274,-87.6320859", "41.878729,-87.6301087", "41.8855277,-87.6440611"], // technician locations
        destinations: ["233 S Wacker Dr, Chicago, IL 60606"], // customer address
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
      };
      // Call Distance Matrix service
      service.getDistanceMatrix(matrixOptions, callback);

      // Callback function used to process Distance Matrix response
      function callback(response, status) {
        if (status !== "OK") {
          alert("Error with distance matrix");
          return;
        }
        test = response 
      }
  }


//SECOND TRY
// const getDistanceMatrix = (service, data) => new Promise((resolve, reject) => {
//   service.getDistanceMatrix(data, (response, status) => {
//     if(status === 'OK') {
//       resolve(response)
//     } else {
//       reject(response);
//     }
//   })
// })


// let getDistance = async() => {
//   const origin = {lat,lng}
//   const final = {lat: distanceObj[0].newLat, lng: distanceObj[0].newLng}
//   const service = new google.maps.DistanceMatrixService()
//   const result = await getDistanceMatrix(
//     service,
//     {
//       origins: [origin],
//       destinations: [final],
//       travelMode: distanceObj[0].travelMode
//     }
//   )
//   const results = result.rows[0].elements
//   let response =  {distance:results[0].distance.text, timeTaken:results[0].duration.text, id:distanceObj.id}
//   console.log(response)
//   return response
// }
// }


  	// FIRST TRY DOESN'T WORK
	// const rsp = []
	// for (var x = 0; x< 1; x++){
	// const origin = {lat,lng}
	// const final = {lat: distanceObj[x].newLat, lng: distanceObj[x].newLng}
	// const service = new google.maps.DistanceMatrixService()
	// await service.getDistanceMatrix(
 //    {
 //      origins: [origin],
 //      destinations: [final],
 //      travelMode: google.maps.TravelMode.DRIVING
 //    }
 //  ,(response, status) => {
 //      if (status !== "OK") {
 //        alert("Error was: " + status);
 //      } else {
	// 	}
 //  	console.log(response)
 //  	rsp.push({distance:response.rows[0].elements[0].distance.text})
 //  	return rsp
	// 	})
	// }

