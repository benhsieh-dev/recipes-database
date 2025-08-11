import axios from "axios"; 

export default class Search {
    constructor(query) {
        this.query = query; 
    }

    async getResults(query) {    
        const appId = '07785360';
        try {
            // Use CORS proxy for Edamam API
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}`;
            const res = await axios(`${proxyUrl}${apiUrl}`);
            this.result = res.data.hits; 
        } catch(error) {
            console.log('CORS proxy failed, trying direct v1:', error);
            try {
                // Fallback: try direct v1 API (might work for some domains)
                const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}&from=0&to=100`);
                this.result = res.data.hits; 
            } catch(error2) {
                console.error('All API methods failed:', error2);
                // Use mock data as fallback
                this.result = this.getMockData();
            }
        }
    }

    getMockData() {
        return [
            {
                recipe: {
                    label: 'Sample Recipe - API Currently Unavailable',
                    image: 'https://via.placeholder.com/300x200?text=Recipe+Not+Available',
                    url: '#',
                    ingredientLines: ['API temporarily unavailable'],
                    calories: 0,
                    healthLabels: ['Demo'],
                    source: 'Mock Data'
                }
            }
        ];
    }
}


