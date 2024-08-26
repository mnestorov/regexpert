export class TemplateManager {
    constructor() {
        this.templateSelect = document.getElementById('validationTemplates');
        this.regexDisplay = document.getElementById('regexDisplay');
        this.explanationAccordion = document.getElementById('explanationAccordion');
        this.explanationBody = document.getElementById('explanationBody');
    }

    init() {
        this.templateSelect.addEventListener('change', () => this.applyTemplate());
    }

    applyTemplate() {
        const templateSelect = this.templateSelect.value;

        if (templateSelect) {
            fetch('patterns.json')
                .then(response => response.json())
                .then(data => this.displayTemplate(data.validationTemplates[templateSelect]))
                .catch(error => console.error('Error loading the template:', error));
        }
    }

    displayTemplate(selectedTemplate) {
        if (selectedTemplate) {
            this.regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedTemplate.pattern}`;
            this.regexDisplay.classList.replace('alert-danger', 'alert-success');

            this.explanationBody.innerHTML = `<strong class="text-warning">Explanation:</strong> ${selectedTemplate.explanation}`;
            this.explanationAccordion.style.display = 'block';

            new PatternManager().handleComplianceWarnings(selectedTemplate.compliance);
        }
    }
}
