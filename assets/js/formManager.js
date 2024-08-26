import { PatternManager } from './patternManager.js';
import { TemplateManager } from './templateManager.js';

export class FormManager {
    constructor() {
        this.patternManager = new PatternManager();
        this.templateManager = new TemplateManager();
        this.regexDisplay = document.getElementById('regexDisplay');
        this.codeExampleDisplay = document.getElementById('codeExampleDisplay');
        this.exportButton = document.getElementById('exportButton');
        this.copyButton = document.getElementById('copyButton');
        this.explanationAccordion = document.getElementById('explanationAccordion');
        this.explanationBody = document.getElementById('explanationBody');
    }

    init() {
        document.getElementById('showPatternButton').addEventListener('click', () => this.showPattern());
        document.getElementById('resetFormButton').addEventListener('click', () => this.resetForm());
    }

    showPattern() {
        const patternType = this.patternManager.patternType.value;
        const country = this.patternManager.countrySelect.value;
        const language = document.getElementById('programmingLanguage').value;
        let hasError = this.validateFormFields(patternType, country, language);

        if (hasError) return;

        fetch('patterns.json')
            .then(response => response.json())
            .then(data => this.displayPattern(data.patterns[patternType][country], language))
            .catch(error => this.handleError(error));
    }

    validateFormFields(patternType, country, language) {
        let hasError = false;
        [this.patternManager.patternType, this.patternManager.countrySelect, document.getElementById('programmingLanguage')].forEach((field) => {
            if (!field.value) {
                field.style.borderColor = 'red';
                hasError = true;
            } else {
                field.style.borderColor = '';
            }
        });

        if (hasError) {
            this.regexDisplay.textContent = '- Please select - all fields.';
            this.regexDisplay.classList.replace('alert-success', 'alert-danger');
        }
        return hasError;
    }

    displayPattern(selectedData, language) {
        if (typeof selectedData === 'string') {
            this.regexDisplay.innerHTML = `<strong>Notice:</strong> ${selectedData}`;
            this.regexDisplay.classList.replace('alert-success', 'alert-danger-custom');
        } else {
            this.regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedData.pattern}`;
            this.regexDisplay.classList.replace('alert-danger', 'alert-success');

            const codeExample = this.displayCodeExample(selectedData.pattern, language);
            this.setupExportAndCopy(selectedData.pattern, codeExample, language);
            this.templateManager.explanationBody.innerHTML = this.buildExplanation(selectedData.explanation);
            this.templateManager.explanationAccordion.style.display = 'block';
        }
    }

    handleError(error) {
        this.regexDisplay.textContent = 'Failed to load patterns.';
        this.regexDisplay.classList.replace('alert-success', 'alert-danger');
        console.error('Error loading the patterns:', error);
    }

    displayCodeExample(pattern, language) {
        // Implement display code example logic similar to the original
    }

    setupExportAndCopy(pattern, codeExample, language) {
        this.exportButton.style.display = 'inline-block';
        this.copyButton.style.display = 'inline-block';
        this.exportButton.onclick = () => this.exportToFile(pattern, codeExample, language);
        this.copyButton.onclick = () => this.copyToClipboard(pattern, codeExample);
    }

    buildExplanation(explanation) {
        return Object.entries(explanation)
            .map(([part, explanationText]) => `<strong class="text-warning">${part}:</strong> ${explanationText}<br>`)
            .join('');
    }

    exportToFile(pattern, codeExample, language) {
        // Implement export logic
    }

    copyToClipboard(pattern, codeExample) {
        // Implement copy logic
    }

    resetForm() {
        // Reset the form fields
    }
}
