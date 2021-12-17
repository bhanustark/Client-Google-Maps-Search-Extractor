import React from "react";
import axios from "axios";
import exportFromJSON from "export-from-json";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import FormHelperText from '@mui/material/FormHelperText';
import './App.css';

var results;

function App() {

  const fileTypes = [
    {
      value: exportFromJSON.types.csv,
      label: 'CSV',
    },
    {
      value: exportFromJSON.types.json,
      label: 'JSON',
    },
    {
      value: exportFromJSON.types.xls,
      label: 'XLS',
    },
  ];

  const [fileType, setFileType] = React.useState(exportFromJSON.types.csv);
  const [loading, setLoading] = React.useState(false);
  const [downloadable, setDownloadable] = React.useState(true);
  const [mapURL, setMapURL] = React.useState('');
  const [noOfPages, setNoOfPages] = React.useState(1);


  const fileName = 'exported';
  const exportType =  exportFromJSON.types.csv;

  const handleChange = (event) => {
    setFileType(event.target.value);
  };

  const handleMapURLChange = (event) => {
    setMapURL(event.target.value);
  }

  const handleNoOfPagesChange = (event) => {
    setNoOfPages(event.target.value);
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return true;
  }

  const handleFetchButton = (event) => {
    if (mapURL !== '') {
      if (isValidHttpUrl(mapURL)) {
        if (noOfPages > 0) {
          getData();
        }
      }
    }
  }

  async function getData() {
    setLoading(true);
    results = await axios.post('https://server-scrape-google-maps.herokuapp.com/', {
      mapURL: mapURL,
      noOfPages: noOfPages
    });
    results = await results.data;
    //console.log(data);
    setLoading(false);
    setDownloadable(false);
    //return result;
  }

  function download() {
    //console.log(results);

    exportFromJSON({ data: results, fileName: 'data', exportType: fileType })
  }


  return (
    <div className="App">

      <div className="App-body">
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            p: 3,
            width: 420,
            height: 500,
          },
        }}
      >
      <Paper elevation={3}>
      <Stack spacing={3} direction="column">
        <GoogleIcon color="primary" sx={{fontSize:50, textAlign: 'center', width: '100%', marginTop:'30px', marginBottom:'30px'}}/>
        <Typography mt={2} variant="h5" component="div" gutterBottom>
          Google Maps Search Extractor
        </Typography>

        <TextField onChange={handleMapURLChange} id="mapURL" label="Map Search Link" size="small" variant="outlined" value={mapURL} />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          spacing={2}
        >
        <Stack direction="row" spacing={2}>
          <TextField sx={{width:'50%'}} type="number" id="mapPages" label="No. of Pages" size="small" variant="outlined" onChange={handleNoOfPagesChange} value={noOfPages} />
          <LoadingButton loading={loading} onClick={handleFetchButton} variant="contained">Fetch</LoadingButton>
        </Stack>
        </Stack>

      <TextField
          id="select-fileType"
          select
          label="Select File Type"
          value={fileType}
          size="small"
          onChange={handleChange}
        >
          {fileTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <LoadingButton loading={loading} loadingIndicator="Please wait a moment..." onClick={download} variant="contained" disabled={downloadable} color="success">Extract</LoadingButton>
      </Stack>
      <Box sx={{ width: '100%'}}>
        <LinearProgress sx={loading ? {display:'block'} : {display:'none'}} />
      </Box>
    </Paper>
    </Box>
      </div>

    </div>
  );
}

export default App;
