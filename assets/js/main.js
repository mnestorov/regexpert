import { CookieConsentManager } from './cookieConsentManager.js';
import { PatternManager } from './patternManager.js';
import { TemplateManager } from './templateManager.js';
import { FormManager } from './formManager.js';
import { SEOManager } from './seoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentManager = new CookieConsentManager();
    const patternManager = new PatternManager();
    const templateManager = new TemplateManager();
    const formManager = new FormManager(patternManager);
    const seoManager = new SEOManager();

    // Initialize all managers
    cookieConsentManager.init();
    patternManager.init();
    templateManager.init();
    formManager.init();
    seoManager.injectStructuredData();

    // Bind event listeners programmatically to avoid inline event handlers
    const patternTypeElement = document.getElementById('patternType');
    const showPatternButton = document.getElementById('showPatternButton');
    const resetFormButton = document.getElementById('resetFormButton');

    if (patternTypeElement) {
        patternTypeElement.addEventListener('change', () => patternManager.updateCountriesAndLabel());
    }

    if (showPatternButton) {
        showPatternButton.addEventListener('click', () => formManager.showPattern());
    }

    if (resetFormButton) {
        resetFormButton.addEventListener('click', () => formManager.resetForm());
    }

    // If needed, attach functions to the global window object for legacy inline handlers
    window.updateCountriesAndLabel = () => patternManager.updateCountriesAndLabel();
    window.showPattern = () => formManager.showPattern();
    window.resetForm = () => formManager.resetForm();
});
