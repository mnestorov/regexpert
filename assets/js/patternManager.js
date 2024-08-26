export class PatternManager {
    constructor() {
        this.patternType = document.getElementById('patternType');
        this.countrySelect = document.getElementById('country');
        this.label = document.getElementById('secondSelectLabel');
        this.complianceWarnings = document.getElementById('complianceWarnings');
    }

    init() {
        this.patternType.addEventListener('change', () => this.updateCountriesAndLabel());
    }

    updateCountriesAndLabel() {
        const patternType = this.patternType.value;

        this.label.textContent = patternType === 'commonPatterns' 
            ? 'Select Dates, Currency, CreditCards or Emails:' 
            : 'Select Country:';

        if (patternType) {
            fetch('patterns.json')
                .then(response => response.json())
                .then(data => this.populateCountryOptions(data, patternType))
                .catch(error => {
                    console.error('Error fetching patterns:', error);
                    this.countrySelect.innerHTML = '<option value="">Error loading options</option>';
                });
        } else {
            this.countrySelect.innerHTML = '<option value="">- Please select - pattern type first</option>';
        }
    }

    populateCountryOptions(data, patternType) {
        let options = '<option value="">- Please select -</option>';
        const patterns = data.patterns[patternType];
        const items = Object.keys(patterns);
        items.forEach(item => {
            options += `<option value="${item}">${item}</option>`;
        });
        this.countrySelect.innerHTML = options;

        if (patternType === 'commonPatterns') {
            this.countrySelect.addEventListener('change', () => this.handleComplianceWarnings());
        }
    }

    handleComplianceWarnings() {
        const selectedOption = this.countrySelect.value;
        if (selectedOption === 'Dates' || selectedOption === 'Currency') {
            this.complianceWarnings.style.display = 'none';
            this.complianceWarnings.innerHTML = '';
        }
    }
}
