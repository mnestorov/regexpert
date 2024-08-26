export class SEOManager {
    constructor() {
        this.structuredData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Regex Pattern Generator",
            "description": "Easily generate and understand regular expressions for various use cases such as phone numbers, postal codes, and VAT numbers. Supports multiple programming languages.",
            "url": "https://regexpert.dev",
            "creator": {
                "@type": "Person",
                "name": "Martin Nestorov"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://regexpert.dev"
            }
        };
    }

    injectStructuredData() {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(this.structuredData);
        document.head.appendChild(script);
    }
}
