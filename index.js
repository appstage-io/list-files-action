const core = require("@actions/core");
const axios = require("axios");
const https = require('https');

const token = core.getInput('token');
const host = core.getInput('host') || 'https://www.appstage.io';

(async () => {
  try {
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    const { data } = await instance.get(`${host}/api/live_builds`,{
      headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
      }
    });
    console.log(data.release_files.map((f) => {return f.name}).join('\r\n'));
    core.setOutput("files", data.release_files);
  } catch (error) {
    core.setFailed(`File listing failed - ${error.message}`);
  }
})();
  