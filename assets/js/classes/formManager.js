export class FormManager {
    constructor(patternManager) {
        this.patternManager = patternManager;
        this.regexDisplay = document.getElementById('regexDisplay');
        this.codeExampleDisplay = document.getElementById('codeExampleDisplay');
        this.exportButton = document.getElementById('exportButton');
        this.copyButton = document.getElementById('copyButton');
        this.regexAccordion = document.getElementById('regexAccordion');
        this.explanationAccordion = document.getElementById('explanationAccordion');
        this.codeExampleAccordion = document.getElementById('codeExampleAccordion');
        this.explanationDisplay = document.getElementById('explanationDisplay');
        this.alertMessage = document.getElementById('alertMessage');
        this.noticeMessage = document.getElementById('noticeMessage');
    }

    init() {
        document.getElementById('showPatternButton').addEventListener('click', () => this.showPattern());
        document.getElementById('resetFormButton').addEventListener('click', () => this.resetForm());
    }

    showPattern() {
        const patternType = document.getElementById('patternType');
        const country = document.getElementById('country');
        const language = document.getElementById('programmingLanguage');

        let hasError = this.validateFormFields(patternType, country, language);
        if (hasError) {
            this.hideAllMessagesExcept('alert');
            return;
        }

        fetch('./data/patterns.json')
            .then(response => response.json())
            .then(data => {
                const selectedData = data.patterns[patternType.value][country.value];

                if (typeof selectedData === 'string' || !selectedData.explanation) {
                    this.showNoticeMessage(selectedData);
                    this.hideAllMessagesExcept('notice');
                    this.hideAccordions();
                } else {
                    this.displayPattern(selectedData, language.value);
                    this.hideNoticeMessage();
                    this.showAccordions();
                }
            })
            .catch(error => this.handleError(error));
    }

    hideAccordions() {
        this.regexAccordion.style.display = 'none';
        this.codeExampleAccordion.style.display = 'none';
        this.explanationAccordion.style.display = 'none';
    }

    showAccordions() {
        this.regexAccordion.style.display = 'block';
        this.codeExampleAccordion.style.display = 'block';
        this.explanationAccordion.style.display = 'block';
    }

    showNoticeMessage(message) {
        this.noticeMessage.innerHTML = `<strong>Notice:</strong> ${message}`;
        this.noticeMessage.classList.remove('d-none');
    }

    hideNoticeMessage() {
        this.noticeMessage.classList.add('d-none');
    }

    showAlertMessage(message) {
        this.alertMessage.innerHTML = `<strong>Error:</strong> ${message}`;
        this.alertMessage.classList.remove('d-none');
    }

    hideAlertMessage() {
        this.alertMessage.classList.add('d-none');
    }

    hideAllMessagesExcept(type) {
        if (type !== 'alert') {
            this.hideAlertMessage();
        }
        if (type !== 'notice') {
            this.hideNoticeMessage();
        }
    }

    validateFormFields(patternType, country, language) {
        let hasError = false;
        [patternType, country, language].forEach((field) => {
            if (!field.value) {
                field.style.borderColor = '#dc3545';
                hasError = true;
            } else {
                field.style.borderColor = '';
            }
        });

        if (hasError) {
            this.showAlertMessage('Please select all fields.');
        } else {
            this.hideAlertMessage();
        }

        return hasError;
    }

    displayPattern(selectedData, language) {
        this.regexDisplay.innerHTML = `${selectedData.pattern}`;
        this.regexDisplay.classList.replace('alert-danger', 'alert-success');

        const codeExample = this.displayCodeExample(selectedData.pattern, language);
        this.setupExportAndCopy(selectedData.pattern, codeExample, language);
        this.buildExplanation(selectedData.explanation);

        this.injectDisclaimerText();
        this.showComplianceWarnings(selectedData.compliance);
    }

    handleError(error) {
        this.hideAllMessagesExcept('alert');
        this.showAlertMessage('Failed to load patterns.');
        console.error('Error loading the patterns:', error);
    }

    displayCodeExample(pattern, language) {
        const codeExamples = {
            'PHP': `<?php\nif (preg_match('/${pattern}/', $input)) {\n    echo 'Valid';\n} else {\n    echo 'Invalid';\n}\n?>`,
            'JavaScript': `if (/${pattern}/.test(input)) {\n    console.log('Valid');\n} else {\n    console.log('Invalid');\n}`,
            'Python': `import re\n\nif re.match(r'${pattern}', input):\n    print('Valid')\nelse:\n    print('Invalid')`,
            'C#': `using System;\nusing System.Text.RegularExpressions;\n\nclass Program {\n    static void Main() {\n        string input = "...";\n        if (Regex.IsMatch(input, @"${pattern}")) {\n            Console.WriteLine("Valid");\n        } else {\n            Console.WriteLine("Invalid");\n        }\n    }\n}`,
            'Java': `import java.util.regex.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String input = "...";\n        Pattern pattern = Pattern.compile("${pattern}");\n        Matcher matcher = pattern.matcher(input);\n        if (matcher.find()) {\n            System.out.println("Valid");\n        } else {\n            System.out.println("Invalid");\n        }\n    }\n}`,
            'Ruby': `if /${pattern}/.match(input)\n  puts 'Valid'\nelse\n  puts 'Invalid'\nend`,
            'Rust': `use regex::Regex;\n\nfn main() {\n    let input = "...";\n    let re = Regex::new(r"${pattern}").unwrap();\n    if re.is_match(input) {\n        println!("Valid");\n    } else {\n        println!("Invalid");\n    }\n}`,
            'Go': `package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    input := "..." \n    matched, _ := regexp.MatchString("${pattern}", input)\n    if matched {\n        fmt.Println("Valid")\n    } else {\n        fmt.Println("Invalid")\n    }\n}`,
            'Swift': `import Foundation\n\nlet regex = try! NSRegularExpression(pattern: "${pattern}")\nlet input = "..." \nlet range = NSRange(location: 0, length: input.utf16.count)\nif regex.firstMatch(in: input, options: [], range: range) != nil {\n    print("Valid")\n} else {\n    print("Invalid")\n}`,
            'Perl': `if ($input =~ /${pattern}/) {\n    print "Valid";\n} else {\n    print "Invalid";\n}`
        };

        const codeExample = codeExamples[language];
        const codeExampleDisplay = document.getElementById('codeExampleDisplay');

        if (codeExampleDisplay) {
            // Display the code example using CodeMirror or plain text
            codeExampleDisplay.innerHTML = `<textarea id="codeMirrorEditor">${codeExample}</textarea>`;
            CodeMirror.fromTextArea(document.getElementById('codeMirrorEditor'), {
                lineNumbers: true,
                mode: this.getModeForLanguage(language),
                theme: 'material-darker',
                readOnly: true,
                tabSize: 4,
                indentWithTabs: true
            });
        }

        return codeExample;
    }

    getModeForLanguage(language) {
        const modes = {
            'PHP': 'application/x-httpd-php',
            'JavaScript': 'javascript',
            'Python': 'python',
            'C#': 'text/x-csharp',
            'Java': 'text/x-java',
            'Ruby': 'ruby',
            'Rust': 'rust',
            'Go': 'go',
            'Swift': 'swift',
            'Perl': 'perl'
        };
        return modes[language] || 'text/plain';
    }

    setupExportAndCopy(pattern, codeExample, language) {
        this.exportButton.style.display = 'inline-block';
        this.copyButton.style.display = 'inline-block';
        this.exportButton.onclick = () => this.exportToFile(pattern, codeExample, language);
        this.copyButton.onclick = () => this.copyToClipboard(pattern, codeExample);
    }

    buildExplanation(explanation) {
        this.explanationDisplay.innerHTML = ''; // Clear previous explanations
        for (const [part, explanationText] of Object.entries(explanation)) {
            this.explanationDisplay.innerHTML += `<strong class="text-warning">${part}:</strong> ${explanationText}<br>`;
        }
        this.explanationAccordion.style.display = 'block'; // Show explanation accordion
    }

    exportToFile(pattern, codeExample, language) {
        const content = `Regex Pattern:\n${pattern}\n\nCode Example in ${language}:\n${codeExample}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `regex-pattern.${language.toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    copyToClipboard(pattern, codeExample) {
        const content = `Regex Pattern:\n${pattern}\n\n${codeExample}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content)
                .then(() => alert('Pattern and code copied to clipboard!'))
                .catch(err => {
                    console.error('Failed to copy with Clipboard API:', err);
                    this.fallbackCopyToClipboard(content);
                });
        } else {
            this.fallbackCopyToClipboard(content);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Pattern and code copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    resetForm() {
        document.getElementById('patternType').value = '';
        document.getElementById('country').innerHTML = '<option value="">- Please select -</option>';
        document.getElementById('programmingLanguage').value = '';

        this.regexDisplay.textContent = 'Regex pattern will be displayed here.';
        this.regexDisplay.classList.remove('alert-success', 'alert-danger-custom', 'alert-danger');
        this.regexDisplay.classList.add('alert-success');

        this.codeExampleDisplay.textContent = 'Code example will be displayed here.';
        this.codeExampleDisplay.classList.remove('border-success', 'border-danger');
        this.codeExampleDisplay.classList.add('border-success');

        this.exportButton.style.display = 'none';
        this.copyButton.style.display = 'none';
        this.hideAccordions();

        this.hideAlertMessage();
        this.hideNoticeMessage();

        const disclaimer = document.getElementById('disclaimerText');
        if (disclaimer) disclaimer.classList.add('d-none');

        const complianceWarnings = document.getElementById('complianceWarnings');
        if (complianceWarnings) {
            complianceWarnings.style.display = 'none';
            complianceWarnings.innerHTML = ''; // Clear the warnings content
        }

        const label = document.getElementById('secondSelectLabel');
        label.textContent = 'Select Country:'; // Reset the label to default
    }

    injectDisclaimerText() {
        const disclaimerId = 'disclaimerText';
        let disclaimer = document.getElementById(disclaimerId);
        
        // If the disclaimer doesn't already exist, create and inject it
        if (!disclaimer) {
            disclaimer = document.createElement('small');
            disclaimer.id = disclaimerId;
            disclaimer.className = 'text-secondary text-bg-dark px-3 pb-3 d-block';
            disclaimer.innerHTML = `Please note that these code examples are automatically generated. They are not guaranteed to work. If you find a syntax error or any other error, <a href="https://github.com/mnestorov/regex-patterns/issues" target="_blank" class="link-secondary">please submit a bug report</a>.`;

            // Inject the disclaimer after the code example
            const codeExampleDisplay = document.getElementById('codeExampleDisplay');
            if (codeExampleDisplay && codeExampleDisplay.parentNode) {
                codeExampleDisplay.parentNode.insertBefore(disclaimer, codeExampleDisplay.nextSibling);
            }
        } else {
            // If it exists, make sure it's visible
            disclaimer.classList.remove('d-none');
        }
    }

    showComplianceWarnings(complianceData) {
        const complianceWarnings = document.getElementById('complianceWarnings');

        if (complianceWarnings) {
            complianceWarnings.innerHTML = ''; // Clear existing warnings

            if (complianceData) {
                for (const [law, warning] of Object.entries(complianceData)) {
                    complianceWarnings.innerHTML += `<div class="alert alert-warning"><strong>${law} Compliance:</strong> ${warning}</div>`;
                }
                complianceWarnings.style.display = 'block'; // Show compliance warnings
            } else {
                complianceWarnings.style.display = 'none'; // Hide if no warnings
            }
        } else {
            console.error('complianceWarnings element not found in the DOM.');
        }
    }
}
