import { CookieConsentManager } from './cookieConsentManager.js';
import { PatternManager } from './patternManager.js';
import { TemplateManager } from './templateManager.js';
import { FormManager } from './formManager.js';
import { SEOManager } from './seoManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentManager = new CookieConsentManager();
    const patternManager = new PatternManager();
    const templateManager = new TemplateManager();
    const formManager = new FormManager();
    const seoManager = new SEOManager();

    // Initialize all managers
    cookieConsentManager.init();
    patternManager.init();
    templateManager.init();
    formManager.init();
    seoManager.injectStructuredData();
});
