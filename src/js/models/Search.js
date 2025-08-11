import axios from "axios"; 

export default class Search {
    constructor(query) {
        this.query = query; 
    }

    async getResults(query) {    
        const appId = '07785360';
        try {
            // Try API v2 first, fallback to v1
            const res = await axios(`https://api.edamam.com/api/recipes/v2?type=public&q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}&from=0&to=100`);
            this.result = res.data.hits; 
        } catch(error) {
            console.log('API v2 failed, trying v1:', error);
            try {
                // Fallback to v1 API
                const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}&from=0&to=100`);
                this.result = res.data.hits; 
            } catch(error2) {
                console.error('Both APIs failed:', error2);
                alert('Unable to search recipes. Please try again later.'); 
            }
        }
    }
}


