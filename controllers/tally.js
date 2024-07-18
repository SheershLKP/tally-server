const axios = require('axios');
const xml2js = require('xml2js');

const ngrok = require('ngrok');

const callTallyApi = async (req, res) => {
    try {
        // Start ngrok tunnel
        const url = await ngrok.connect(9001); // Assumes your local service runs on port 9001
        console.log(`ngrok tunnel opened at: ${url}`);

        // Make the API call to the public URL
        const response = await axios.get(url);
        
        // Close ngrok tunnel after request
        // await ngrok.disconnect(url);
        // await ngrok.kill();

        res.status(200).json({ data: response.data, message: "Data found successfully", status: res.status });
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
};

const fetchDataFromTally = async (req, res) => {
    try {
    const response = await axios.post('https://f79b-121-241-109-219.ngrok-free.app/', requestXml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    const parsedResponse = await xml2js.parseStringPromise(response.data);
    return JSON.stringify(parsedResponse);
  } catch (error) {
    console.error('Error fetching data from Tally:', error.message);
    return JSON.stringify({ error: 'Failed to fetch data from Tally' });
  }
}

// const callTallyApi = async (req, res) => {
//     try {
//         const response = await axios.get('https://f79b-121-241-109-219.ngrok-free.app/');
//         res.status(200).json({ data: response.data, message: "Data found successfully", status: res.status });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching data", error: error.message });
//     }
// };

// Example request XML
const requestXml = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>List of Ledgers</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
`;
module.exports = { callTallyApi, fetchDataFromTally};
