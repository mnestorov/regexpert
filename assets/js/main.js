import { CookieConsentManager } from './classes/cookieConsentManager.js';
import { PatternManager } from './classes/patternManager.js';
import { FormManager } from './classes/formManager.js';
import { SEOManager } from './classes/seoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentManager = new CookieConsentManager();
    const patternManager = new PatternManager();
    const formManager = new FormManager(patternManager);
    const seoManager = new SEOManager();

    // Initialize all managers
    cookieConsentManager.init();
    patternManager.init();
    formManager.init();
    seoManager.injectStructuredData();

    // Bind event listeners programmatically
    const patternTypeElement = document.getElementById('patternType');
    const showPatternButton = document.getElementById('showPatternButton');
    const resetFormButton = document.getElementById('resetFormButton');

    if (patternTypeElement) {
        patternTypeElement.addEventListener('change', () => patternManager.updateCountriesAndLabel());
    } else {
        console.error('Element with id="patternType" not found.');
    }

    if (showPatternButton) {
        showPatternButton.addEventListener('click', () => formManager.showPattern());
    } else {
        console.error('Element with id="showPatternButton" not found.');
    }

    if (resetFormButton) {
        resetFormButton.addEventListener('click', () => formManager.resetForm());
    } else {
        console.error('Element with id="resetFormButton" not found.');
    }
});
