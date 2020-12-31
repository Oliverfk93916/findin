
export default function optimiseRoute(result, distances){
	let trial = []
	for(var x = 0; x < result.length; x++){
    trial.push(result[x])
  }
  let locationsDistanceObj = result.map(rslt => Object.assign({}, rslt, {
    distance: distances.filter(dst => dst.id === rslt[0].id).map(dst => dst.distance)
  }))


  // get cost mean
  let cost = 0
  for (let x = 0; x < locationsDistanceObj.length; x++){
    cost += locationsDistanceObj[x].basketPrice
  }
  let priceMean = cost / locationsDistanceObj.length


  //get distance mean
  let distance = 0
  for(let i = 0; i < locationsDistanceObj.length; i++){
    distance += locationsDistanceObj[i].distance[0]
  }
  let distanceMean = distance / locationsDistanceObj.length
  

  //This is currently the algo for best route basted on distance from mean
  let optimisedList = []
  for (let j = 0; j < locationsDistanceObj.length; j++){
    optimisedList.push({
      ...locationsDistanceObj[j],
      priorityNumber: (Math.abs(locationsDistanceObj[j].distance[0] - distanceMean) * Math.abs(locationsDistanceObj[j].basketPrice - priceMean))*100
    })
  }

  //This sorts via the shortest distance
  // locationsDistanceObj.sort((a,b) => parseFloat(a.distance[0]) - parseFloat(b.distance[0]))


  //This sorts via the lowest price
  // let lowestPrice = locationsDistanceObj.sort((a,b) => parseFloat(a.basketPrice) - parseFloat(b.basketPrice))


  //This sorts via the smallest priority number first
  optimisedList.sort((a,b) => parseFloat(a.priorityNumber) - parseFloat(b.priorityNumber))


  return optimisedList
}