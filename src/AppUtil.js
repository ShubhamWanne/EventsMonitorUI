function generateNodePositions(edges){
    var res = new Map();
    // var firstNode = Object.keys(edges)[0];
    // console.log(Object.keys(edges))
    // var point = {x: 0, y:0};
    // res.set(firstNode, point);
    // generateNodePositionsUtil(edges, res, firstNode);
    // console.log(res)
    var edgeArr = Object.keys(edges);
    var index=0;
    for(let i=0; i<edgeArr.length; i++){
        console.log("iterating for : "+ edgeArr[i])
        if(edgeArr[i] != undefined && !res.has(edgeArr[i])){
            console.log("executing for "+edgeArr[i])
            res.set(edgeArr[i], {x: index, y: index*200});
            generateNodePositionsUtil(edges, res, edgeArr[i]);
            index++;
        }
    }
    return res;
}
  
function generateNodePositionsUtil(edges, res, node){
    const xWidth = 200;
    const yWidth = 100;

    if(edges[node] == null){
      return;
    }
    var n = edges[node].length;
    var mid = Math.floor(n/2);
    for(let i=0 ; i < n ; i++){
      var parentPoint = res.get(node);
      var tempNode = edges[node][i];
      console.log("executing child "+ tempNode+" of parent "+node)
      if(res.get(tempNode) != null){
        continue;
      }
      if(i == 0){
        var newPoint = {x: parentPoint.x + xWidth, y: parentPoint.y - (mid * yWidth)};
        res.set(tempNode, newPoint)
      }else{
        if(i < mid){
          var newPoint = {x: parentPoint.x + xWidth, y: parentPoint.y - ( (mid - i) * yWidth)};
          res.set(tempNode, newPoint)
        }else{
          var newPoint = {x: parentPoint.x + xWidth, y: parentPoint.y + ( (i - mid) * yWidth)};
          res.set(tempNode, newPoint)
        }
      }
      generateNodePositionsUtil(edges, res, tempNode)
    }
}

export {generateNodePositions}