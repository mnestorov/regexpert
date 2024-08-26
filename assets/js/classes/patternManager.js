export class PatternManager {
    constructor() {
        this.patternType = document.getElementById('patternType');
        this.label = document.getElementById('secondSelectLabel');
        this.countrySelect = document.getElementById('country');
        this.complianceWarnings = document.getElementById('complianceWarnings');
    }

    init() {
        this.patternType.addEventListener('change', () => this.updateCountriesAndLabel());
    }

    updateCountriesAndLabel() {
        const patternType = this.patternType.value;

        if (patternType === 'commonPatterns') {
            this.label.textContent = 'Select Dates, Currency, CreditCards or Emails:';
        } else {
            this.label.textContent = 'Select Country:';
        }

        if (patternType) {
            fetch('../../data/patterns.json')  // Corrected path
                .then(response => response.json())
                .then(data => {
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
                })
                .catch(error => {
                    console.error('Error fetching patterns:', error);
                    this.countrySelect.innerHTML = '<option value="">Error loading options</option>';
                });
        } else {
            this.countrySelect.innerHTML = '<option value="">- Please select - pattern type first</option>';
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
