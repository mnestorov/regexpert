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
        const codeExamples = {
            'PHP': `<?php\nif (preg_match('/${regex}/', $input)) {\n    echo 'Valid';\n} else {\n    echo 'Invalid';\n}\n?>`,
            'JavaScript': `if (/${regex}/.test(input)) {\n    console.log('Valid');\n} else {\n    console.log('Invalid');\n}`,
            'Python': `import re\n\nif re.match(r'${regex}', input):\n    print('Valid')\nelse:\n    print('Invalid')`,
            'C#': `using System;\nusing System.Text.RegularExpressions;\n\nclass Program {\n    static void Main() {\n        string input = "...";\n        if (Regex.IsMatch(input, @"${regex}")) {\n            Console.WriteLine("Valid");\n        } else {\n            Console.WriteLine("Invalid");\n        }\n    }\n}`,
            'Java': `import java.util.regex.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String input = "...";\n        Pattern pattern = Pattern.compile("${regex}");\n        Matcher matcher = pattern.matcher(input);\n        if (matcher.find()) {\n            System.out.println("Valid");\n        } else {\n            System.out.println("Invalid");\n        }\n    }\n}`,
            'Ruby': `if /${regex}/.match(input)\n  puts 'Valid'\nelse\n  puts 'Invalid'\nend`,
            'Rust': `use regex::Regex;\n\nfn main() {\n    let input = "...";\n    let re = Regex::new(r"${regex}").unwrap();\n    if re.is_match(input) {\n        println!("Valid");\n    } else {\n        println!("Invalid");\n    }\n}`,
            'Go': `package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    input := "..." \n    matched, _ := regexp.MatchString("${regex}", input)\n    if matched {\n        fmt.Println("Valid")\n    } else {\n        fmt.Println("Invalid")\n    }\n}`,
            'Swift': `import Foundation\n\nlet regex = try! NSRegularExpression(pattern: "${regex}")\nlet input = "..." \nlet range = NSRange(location: 0, length: input.utf16.count)\nif regex.firstMatch(in: input, options: [], range: range) != nil {\n    print("Valid")\n} else {\n    print("Invalid")\n}`,
            'Perl': `if ($input =~ /${regex}/) {\n    print "Valid";\n} else {\n    print "Invalid";\n}`
        };
        
        const codeExample = codeExamples[language];
        const codeExampleDisplay = document.getElementById('codeExampleDisplay');
        
        // Create a textarea to host the code example
        codeExampleDisplay.innerHTML = `<textarea id="codeMirrorEditor">${codeExample}</textarea>`;
        
        // Initialize CodeMirror on the textarea
        CodeMirror.fromTextArea(document.getElementById('codeMirrorEditor'), {
            lineNumbers: true,
            mode: getModeForLanguage(language),
            theme: 'material-darker', // You can change this to any CodeMirror theme you prefer
            readOnly: true,
            tabSize: 4,
            indentWithTabs: true
        });
        
        return codeExample;
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
    
        // Check if the Clipboard API is supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content)
                .then(() => {
                    alert('Pattern and code copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy with Clipboard API:', err);
                    fallbackCopyToClipboard(content); // Use fallback
                });
        } else {
            // Use fallback if Clipboard API is not supported
            fallbackCopyToClipboard(content);
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
        // Reset the form fields
    document.getElementById('patternType').value = '';
    document.getElementById('country').innerHTML = '<option value="">- Please select -</option>';
    document.getElementById('programmingLanguage').value = '';

    // Clear the displayed results
    document.getElementById('regexDisplay').textContent = 'Regex pattern will be displayed here.';
    document.getElementById('regexDisplay').classList.remove('alert-success', 'alert-danger-custom', 'alert-danger');
    document.getElementById('regexDisplay').classList.add('alert-success');
    
    document.getElementById('codeExampleDisplay').textContent = 'Code example will be displayed here.';
    document.getElementById('codeExampleDisplay').innerHTML = 'Code example will be displayed here.';
    document.getElementById('codeExampleDisplay').classList.remove('border-success', 'border-danger');
    document.getElementById('codeExampleDisplay').classList.add('border-success');

    // Hide buttons and explanation accordion
    document.getElementById('exportButton').style.display = 'none';
    document.getElementById('copyButton').style.display = 'none';
    document.getElementById('explanationAccordion').style.display = 'none';

    // Hide disclaimer text
    const disclaimer = document.getElementById('disclaimerText');
    if (disclaimer) {
        disclaimer.classList.add('d-none');
    }

    // Hide compliance warnings
    const complianceWarnings = document.getElementById('complianceWarnings');
    if (complianceWarnings) {
        complianceWarnings.style.display = 'none';
        complianceWarnings.innerHTML = ''; // Clear the warnings content
    }

    // Reset the label for the second select field
    const label = document.getElementById('secondSelectLabel');
    label.textContent = 'Select Country:'; // Reset the label to default

    // Reset visibility of select fields
    document.getElementById('countryWrapper').style.display = 'block';
    document.getElementById('validationTemplateSelectWrapper').style.display = 'none';
    document.getElementById('languageWrapper').style.display = 'block';
    document.getElementById('showPatternButton').style.display = 'block';
    }
}
