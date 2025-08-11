import axios from "axios"; 

export default class Search {
    constructor(query) {
        this.query = query; 
    }

    async getResults(query) {    
        const appId = '07785360';
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://proxy.cors.sh/',
            '' // Direct attempt (no proxy)
        ];
        
        for (const proxy of proxies) {
            try {
                let apiUrl;
                if (proxy === '') {
                    // Direct API calls (try both v2 and v1)
                    const urls = [
                        `https://api.edamam.com/api/recipes/v2?type=public&q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}`,
                        `https://api.edamam.com/search?q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}&from=0&to=100`
                    ];
                    
                    for (const url of urls) {
                        try {
                            const res = await axios(url);
                            this.result = res.data.hits;
                            console.log('Direct API success with:', url);
                            return;
                        } catch(e) {
                            console.log('Direct API failed:', url, e.message);
                        }
                    }
                } else {
                    // Try with proxy
                    apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${this.query}&app_id=${appId}&app_key=${process.env.EDAMAM_API}`;
                    const res = await axios(`${proxy}${encodeURIComponent(apiUrl)}`);
                    this.result = res.data.hits || res.data;
                    console.log('Proxy success with:', proxy);
                    return;
                }
            } catch(error) {
                console.log(`Failed with proxy ${proxy}:`, error.message);
                continue;
            }
        }
        
        // All methods failed - use mock data
        console.warn('All API methods failed, using mock data');
        this.result = this.getMockData();
    }

    getMockData() {
        const query = this.query.toLowerCase();
        const mockRecipes = [
            {
                recipe: {
                    label: `${query.charAt(0).toUpperCase() + query.slice(1)} Recipe - API Unavailable`,
                    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=300&h=200&fit=crop',
                    url: 'https://github.com/benhsieh-dev/recipes-database',
                    ingredientLines: ['Recipe data temporarily unavailable', 'Please try again later'],
                    calories: 250,
                    healthLabels: ['Vegetarian', 'Low-Sodium'],
                    source: 'Demo Recipe'
                }
            },
            {
                recipe: {
                    label: `Delicious ${query} Dish - Demo`,
                    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                    url: 'https://github.com/benhsieh-dev/recipes-database',
                    ingredientLines: ['Sample ingredients', 'API connection needed for real recipes'],
                    calories: 320,
                    healthLabels: ['Gluten-Free'],
                    source: 'Sample Data'
                }
            }
        ];
        return mockRecipes;
    }
}


