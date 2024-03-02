import './App.css';
import React from 'react';
import { useEffect } from "react";
import ReactFlow , {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position
}
from 'reactflow'
import 'reactflow/dist/style.css';

import data from './data.json'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = generateNodes();

var initialEdges = generateEdges();

function App() {
  return (
    <div>
      <NavBar/>
      <InputGroup />
      <CreateFlow />
    </div>
  );
}

function generateNodes(){
    var positions = generateNodePositions(data["successors"])
    var nodes = Array.from(positions.keys());
    return nodes.map((functionName, i) => (
      { 
        id: `${functionName}`, 
        position: positions.get(`${functionName}`), 
        data: { label: `${functionName}` } ,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    ))
}

function generateEdges(){
  var edges = data["successors"];
  var keys = Object.keys(edges);
  var res=[];
  for(let i=0; i < keys.length; i++){
    var sourceNode = keys[i];
    var destinationNodes = edges[sourceNode]
    for(let j=0; j<destinationNodes.length; j++){
      res.push(
        { id: sourceNode+destinationNodes[j], source: sourceNode, target: destinationNodes[j], animated:true }
      );
    }
  }
  return res;
}

function generateNodePositions(edges){
  var res = new Map();
  var firstNode = Object.keys(edges)[0];
  generateNodePositionsUtil(edges, res, firstNode);
  return res;
}

function generateNodePositionsUtil(edges, res, node){
  const xWidth = 200;
  const yWidth = 100;
  if(edges[node] == null){
    return;
  }
  if(res.size == 0){
    var point = {x: 0, y:0};
    res.set(node, point);
  }
  var n = edges[node].length;
  var mid = Math.floor(n/2);
  for(let i=0 ; i < n ; i++){
    var parentPoint = res.get(node);
    var tempNode = edges[node][i];
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


function InputGroup(){
  var [value, setValue] = React.useState(dayjs(new Date(Date.now() - 864e5).toISOString().split('T')[0]));
  return (
  <div id="floatingDiv">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
      <DatePicker
          label="Process Day"
          value={value}
          style={{'marginRight': '10px'}}
          onChange={(newValue) => {
              setValue(newValue)
            }
          }
        />
      </DemoContainer>
      </LocalizationProvider>
      <Divider sx={{ height: 50, m: 0.5, mr: 2, ml: 2}} orientation="vertical" />
      <IconButton size="large" color='primary' style={{'background-color': '#1769aa', 'color': 'white'}}>
        <SearchIcon fontSize="inherit" />
      </IconButton>
  </div>
  );
}

function NavBar() {
  return (
      <AppBar style={{'background-color':'#1769aa'}}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 2 }} style={{'fontSize': 'calc(10px + 2vmin)'}}>
            Monitor UI  
          </Typography>
          <Button color="inherit" variant="outlined" startIcon={<RefreshIcon />}> REFRESH </Button>
        </Toolbar>
      </AppBar>
  );
}

function CreateFlow(){

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow         
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView>
      <Controls />
        <MiniMap />
        <Background variant="cross" gap={7} size={1} />
        </ReactFlow>
    </div>
  );
}

export default App;
