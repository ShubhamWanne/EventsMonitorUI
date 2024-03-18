import './App.css';
import React from 'react';
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
import {generateNodePositions} from './AppUtil'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';

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


function InputGroup(){
  var [value, setValue] = React.useState(dayjs(new Date(Date.now() - 864e5).toISOString().split('T')[0]));
  return (
  <div id="floatingDiv">
    <Stack direction="column" spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
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
        <EnvironmentSelect />
        <ProductSelect />
      </Stack>
      <Divider sx={{ height: 200, m: 0.5, mr: 2, ml: 2}} orientation="vertical" />
      <IconButton size="large" color='primary' style={{'background-color': '#1769aa', 'color': 'white'}}>
        <RefreshIcon fontSize="inherit" />
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

function EnvironmentSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 140 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Environment</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Environment"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function ProductSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 140 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Product Id</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="product_id"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}


export default App;
