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
        const templateSelectValue = this.templateSelect.value;

        if (templateSelectValue) {
            fetch('patterns.json')
                .then(response => response.json())
                .then(data => {
                    const selectedTemplate = data.validationTemplates[templateSelectValue];
                    if (selectedTemplate) {
                        this.displayTemplate(selectedTemplate);
                    }
                })
                .catch(error => console.error('Error loading the template:', error));
        }
    }

    displayTemplate(selectedTemplate) {
        this.regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedTemplate.pattern}`;
        this.regexDisplay.classList.replace('alert-danger', 'alert-success');

        this.explanationBody.innerHTML = `<strong class="text-warning">Explanation:</strong> ${selectedTemplate.explanation}`;
        this.explanationAccordion.style.display = 'block';

        const patternManager = new PatternManager();
        patternManager.handleComplianceWarnings(selectedTemplate.compliance);
    }
}
