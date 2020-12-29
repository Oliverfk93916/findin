
export default function orderByDistance(result, distances){
	
	let trial = []
	for(var x = 0; x < result.length; x++){
    trial.push(result[x])
  }
  let locationsDistanceObj = trial.map(rslt => Object.assign({}, rslt, {
    distance: distances.filter(dst => dst.id === rslt.id).map(dst => dst.distance)
  }))
  locationsDistanceObj.sort((a,b) => parseFloat(a.distance[0]) - parseFloat(b.distance[0]))
  return locationsDistanceObj
}