async function fetchWebsiteInfo(url: string) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/html',
            }
        });
        
        // Ensure the response is successful
        if (!response.ok) throw new Error(response.statusText);
        
        // Get the text of the HTML
        const html = await response.text();
        
        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        // Extract the title
        const title = doc.querySelector('title')?.innerText || 'No title found';
        
        // Extract meta description
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found';
        
        // Extract the logo (usually it's in the link[rel~="icon"] or a similar element)
        const logo = doc.querySelector('link[rel*="icon"]')?.getAttribute('href') || 'No logo found';
        
        return {
            title,
            description,
            logo: new URL(logo, url).href,  // Ensure the logo URL is absolute
        };
        
    } catch (error) {
        console.error('Error fetching website info:', error);
        return {
            title: 'Error',
            description: 'Error',
            logo: 'Error',
        };
    }
}

export default fetchWebsiteInfo;