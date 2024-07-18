const axios = require('axios');

const callTallyApi = async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:9001');
        res.status(200).json({ data: response.data, message: "Data found successfully", status: res.status });
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
};

module.exports = { callTallyApi };
