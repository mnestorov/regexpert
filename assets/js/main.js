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

    // Bind event listeners
    document.getElementById('patternType').addEventListener('change', () => patternManager.updateCountriesAndLabel());
    document.getElementById('showPatternButton').addEventListener('click', () => formManager.showPattern());
    document.getElementById('resetFormButton').addEventListener('click', () => formManager.resetForm());

    // Attach functions to the global window object (to avoid the ReferenceError)
    window.updateCountriesAndLabel = () => patternManager.updateCountriesAndLabel();
    window.showPattern = () => formManager.showPattern();
    window.resetForm = () => formManager.resetForm();
});
