export class TemplateManager {
    constructor() {
        this.templateSelect = document.getElementById('validationTemplates');
    }

    init() {
        if (this.templateSelect) {
            this.templateSelect.addEventListener('change', () => this.applyTemplate());
        } else {
            console.error('Template select element not found.');
        }
    }

    applyTemplate() {
        const templateSelectValue = this.templateSelect.value;

        if (templateSelectValue) {
            fetch('patterns.json')
                .then(response => response.json())
                .then(data => this.displayTemplate(data.validationTemplates[templateSelectValue]))
                .catch(error => console.error('Error loading the template:', error));
        }
    }

    displayTemplate(selectedTemplate) {
        if (selectedTemplate) {
            const regexDisplay = document.getElementById('regexDisplay');
            const explanationAccordion = document.getElementById('explanationAccordion');
            const explanationBody = document.getElementById('explanationBody');

            regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedTemplate.pattern}`;
            regexDisplay.classList.replace('alert-danger', 'alert-success');

            explanationBody.innerHTML = `<strong class="text-warning">Explanation:</strong> ${selectedTemplate.explanation}`;
            explanationAccordion.style.display = 'block';

            new PatternManager().handleComplianceWarnings(selectedTemplate.compliance);
        }
    }
}
