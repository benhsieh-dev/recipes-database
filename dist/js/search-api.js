// Temporary API fix for CORS issues
window.RecipeSearch = {
    async search(query) {
        console.log('Searching for:', query);
        const appId = '07785360';
        const apiKey = 'ed4302d03921218d96c47deb7ef96837'; // This should be moved to backend
        
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            ''
        ];
        
        for (const proxy of proxies) {
            try {
                let url;
                if (proxy === '') {
                    // Direct attempt
                    url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${apiKey}`;
                } else {
                    // With proxy
                    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${apiKey}`;
                    url = `${proxy}${encodeURIComponent(apiUrl)}`;
                }
                
                console.log('Trying:', proxy || 'direct');
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.hits && data.hits.length > 0) {
                    console.log('Success with:', proxy || 'direct');
                    return data.hits;
                }
            } catch (error) {
                console.log('Failed:', proxy || 'direct', error.message);
            }
        }
        
        // Fallback to mock data
        console.log('Using mock data');
        return [
            {
                recipe: {
                    label: `${query.charAt(0).toUpperCase() + query.slice(1)} Recipe - Demo`,
                    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=300&h=200&fit=crop',
                    url: 'https://github.com/benhsieh-dev/recipes-database',
                    ingredientLines: ['Recipe data temporarily unavailable', 'Please try again later'],
                    calories: 250,
                    healthLabels: ['Demo'],
                    source: 'Mock Data'
                }
            }
        ];
    }
};