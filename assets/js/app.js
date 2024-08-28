import { CookieConsentManager } from './classes/cookieConsentManager.js';
import { PatternManager } from './classes/patternManager.js';
import { FormManager } from './classes/formManager.js';
import { SEOManager } from './classes/seoManager.js';
import { QRCodeManager } from './classes/qrCodeManager.js';
import { SharingButtonsManager } from './classes/sharingButtonsManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load partials
    const loadPartial = async (name, path) => {
        const response = await fetch(path);
        const template = await response.text();
        Handlebars.registerPartial(name, template);
    };

    await loadPartial('metaInfo', './templates/_partials/metaInfo.hbs');
    await loadPartial('header', './templates/header.hbs');
    await loadPartial('content', './templates/content.hbs');
    await loadPartial('footer', './templates/footer.hbs');
    await loadPartial('cookieConsent', './templates/_partials/cookieConsent.hbs');

    // Compile and render the meta partial
    const metaTemplateSource = document.getElementById('meta-template').innerHTML;
    const metaTemplate = Handlebars.compile(metaTemplateSource);

    // Define the data you want to pass to the template
    const context = {
        homeUrl: './',
        pageTitle: 'RegExpert | Generate & Understand Regular Expressions',
        metaDescription: 'Use the Regex Pattern Generator to easily create and understand regular expressions for phone numbers, postal codes, VAT numbers, and more. Supports multiple programming languages.',
        metaKeywords: 'regex, regular expressions, pattern generator, phone number regex, postal code regex, VAT regex, regex explanation, code generator',
        title: 'Regex Pattern Generator',
        subtitle: 'for the European countries',
        githubUrl: 'https://github.com/mnestorov/regex-patterns',
        leadDescription: 'Designed to help developers easily generate and understand regular expressions for various use cases.',
        description: 'Select a pattern type, country, and programming language to see the corresponding regular expression and code example. You can also view a detailed explanation of how the regex works and export or copy the code for your project.',
        patternTypeLabel: 'Select Pattern Type:',
        patternTypePlaceholder: '- Please select -',
        countryLabel: 'Select Country:',
        countryPlaceholder: '- Please select -',
        programmingLanguageLabel: 'Select Programming Language:',
        programmingLanguagePlaceholder: '- Please select -',
        sharePatternText: 'Share Pattern:',
        showPatternButtonText: 'Show Pattern and Code',
        resetButtonText: 'Reset',
        regexDisplayHeaderText: 'Regex Pattern',
        explanationHeader: 'Explanation of Regex Pattern',
        codeExampleHeaderText: 'Code Example',
        exportButtonText: 'Export to File',
        copyButtonText: 'Copy to Clipboard',
        cookieConsentMessage: 'We use cookies to ensure you get the best experience on our website.',
        acceptButtonText: 'ACCEPT',
        patternTypes: [
            { value: 'phoneNumbers', label: 'Phone Numbers' },
            { value: 'postalCodes', label: 'Postal Codes' },
            { value: 'VATNumbers', label: 'VAT Numbers' },
            { value: 'commonPatterns', label: 'Common Patterns' }
        ],
        programmingLanguages: [
            'PHP', 'JavaScript', 'Python', 'C#', 'Java', 'Ruby', 'Rust', 'Go', 'Swift', 'Perl'
        ],
        footer: {
            title: 'Regex Pattern Generator',
            description: 'This project aims to help developers generate and understand regex patterns for European, making their development process easier and more efficient.',
            support: 'Supports multiple programming languages.',
            projectLinksTitle: 'Project Links',
            projectLinks: [
                { url: 'https://github.com/mnestorov/regex-patterns', label: 'Project on GitHub' },
                { url: 'https://github.com/mnestorov/regex-patterns/issues', label: 'Submit a Bug Report' }
            ],
            usefulLinksTitle: 'Useful Links',
            usefulLinks: [
                { url: 'https://regex101.com/', label: 'Regular Expressions 101' },
                { url: 'https://regexr.com/', label: 'Regexr' },
                { url: 'https://www.regexplanet.com/', label: 'RegexPlanet' },
                { url: 'https://www.rexegg.com/', label: 'RexEgg' },
                { url: 'https://rgxdb.com/', label: 'RegexDB' }
            ]
        },
        developer: {
            url: 'https://github.com/mnestorov/',
            name: 'Martin Nestorov',
            contributions: 'Contributions are welcome so feel free to fork the project on GitHub and submit a pull request. Your help in improving this tool is greatly appreciated.'
        }
    };

    // Render and insert the meta content
    const metaHtml = metaTemplate(context);
    document.head.insertAdjacentHTML('beforeend', metaHtml);
    
    // Load main template
    const response = await fetch('./templates/main.hbs');
    const mainTemplateSource = await response.text();
    const mainTemplate = Handlebars.compile(mainTemplateSource);

    // Render the template with the context data
    const html = mainTemplate(context);

    // Insert the rendered HTML into the body
    document.body.innerHTML = html;

    // Initialize all managers after content is rendered
    const cookieConsentManager = new CookieConsentManager();
    const patternManager = new PatternManager();
    const formManager = new FormManager(patternManager);
    const seoManager = new SEOManager();

    cookieConsentManager.init();
    patternManager.init();
    formManager.init();
    seoManager.injectStructuredData();

    // QR Code and Sharing Buttons integration
    const qrCodeManager = new QRCodeManager('qrCodeContainer');
    const sharingButtonsManager = new SharingButtonsManager('https://regexpert.dev'); // URL to be dynamic based on generated pattern

    document.getElementById('showPatternButton').addEventListener('click', () => {
        const data = "https://regexpert.dev"; // replace with the actual data you want to encode
        qrCodeManager.generate(data);
    });

    // Parse URL parameters and auto-fill the form if parameters are present
    const urlParams = new URLSearchParams(window.location.search);
    const patternType = urlParams.get('patternType');
    const country = urlParams.get('country');
    const language = urlParams.get('language');

    if (patternType && country && language) {
        document.getElementById('patternType').value = patternType;
        patternManager.updateCountriesAndLabel(patternType).then(() => {
            document.getElementById('country').value = country;
            document.getElementById('programmingLanguage').value = language;
            formManager.showPattern();
        });
    }

    // Bind event listeners programmatically
    document.getElementById('patternType').addEventListener('change', () => patternManager.updateCountriesAndLabel());
    document.getElementById('showPatternButton').addEventListener('click', () => formManager.showPattern());
    document.getElementById('resetFormButton').addEventListener('click', () => formManager.resetForm());

    // Register the service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, (error) => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
});
