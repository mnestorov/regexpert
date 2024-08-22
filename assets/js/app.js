document.addEventListener('DOMContentLoaded', function () {
    // Cookie consent logic
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptCookiesButton = document.getElementById('acceptCookies');

    if (!getCookie('cookieConsent')) {
        cookieBanner.style.display = 'block';
    }

    acceptCookiesButton.addEventListener('click', function () {
        setCookie('cookieConsent', 'accepted', 365);
        cookieBanner.style.display = 'none';
    });

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});

function updateCountriesAndLabel() {
    const patternType = document.getElementById('patternType').value;
    const label = document.getElementById('secondSelectLabel');
    const countrySelect = document.getElementById('country');
    const validationTemplateSelect = document.getElementById('validationTemplateSelectWrapper');
    const countryWrapper = document.getElementById('countryWrapper');
    const languageWrapper = document.getElementById('languageWrapper');

    if (patternType === 'commonPatterns') {
        label.textContent = 'Select Dates, Currency, CreditCards or Emails:';
        countryWrapper.style.display = 'block';
        validationTemplateSelect.style.display = 'none';
        countrySelect.required = true;
    } else if (patternType === 'validationTemplates') {
        label.textContent = 'Select Validation Template:';
        countryWrapper.style.display = 'none';
        validationTemplateSelect.style.display = 'block';
        countrySelect.required = false; // Make country not required
    } else {
        label.textContent = 'Select Country:';
        countryWrapper.style.display = 'block';
        validationTemplateSelect.style.display = 'none';
        countrySelect.required = true;
    }

    // Always show the language select if a pattern type is selected
    languageWrapper.style.display = patternType ? 'block' : 'none';

    if (patternType && patternType !== 'validationTemplates') {
        fetch('patterns.json')
            .then(response => response.json())
            .then(data => {
                let options = '<option value="">Please select</option>';
                const patterns = data.patterns[patternType];
                const items = Object.keys(patterns);
                items.forEach(item => {
                    options += `<option value="${item}">${item}</option>`;
                });
                countrySelect.innerHTML = options;
            })
            .catch(error => {
                console.error('Error fetching patterns:', error);
                countrySelect.innerHTML = '<option value="">Error loading options</option>';
            });
    } else if (!patternType) {
        countrySelect.innerHTML = '<option value="">Please select pattern type first</option>';
    }
}

function applyTemplate() {
    const templateSelect = document.getElementById('validationTemplates').value;

    if (templateSelect) {
        fetch('patterns.json')
            .then(response => response.json())
            .then(data => {
                const selectedTemplate = data.validationTemplates[templateSelect];
                if (selectedTemplate) {
                    const regexDisplay = document.getElementById('regexDisplay');
                    regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedTemplate.pattern}`;
                    regexDisplay.classList.remove('alert-danger', 'alert-danger-custom');
                    regexDisplay.classList.add('alert-success');

                    const explanationBody = document.getElementById('explanationBody');
                    explanationBody.innerHTML = `<strong class="text-warning">Explanation:</strong> ${selectedTemplate.explanation}`;
                    document.getElementById('explanationAccordion').style.display = 'block';

                    showComplianceWarnings(selectedTemplate.compliance);
                }
            })
            .catch(error => {
                console.error('Error loading the template:', error);
            });
    }
}

function showComplianceWarnings(complianceData) {
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

function showPattern() {
    const patternType = document.getElementById('patternType');
    const country = document.getElementById('country');
    const language = document.getElementById('programmingLanguage');
    const regexDisplay = document.getElementById('regexDisplay');
    const codeExampleDisplay = document.getElementById('codeExampleDisplay');
    const exportButton = document.getElementById('exportButton');
    const copyButton = document.getElementById('copyButton');
    const explanationAccordion = document.getElementById('explanationAccordion');
    const explanationBody = document.getElementById('explanationBody');

    let hasError = false;

    // Reset borders
    patternType.style.borderColor = '';
    country.style.borderColor = '';
    language.style.borderColor = '';

    // Check if any fields are unselected
    if (!patternType.value) {
        patternType.style.borderColor = 'red';
        hasError = true;
    }
    if (!country.value) {
        country.style.borderColor = 'red';
        hasError = true;
    }
    if (!language.value) {
        language.style.borderColor = 'red';
        hasError = true;
    }

    // If there's an error, display the message and return
    if (hasError) {
        regexDisplay.textContent = 'Please select all fields.';
        regexDisplay.classList.remove('alert-success', 'alert-danger-custom');
        regexDisplay.classList.add('alert-danger');
        codeExampleDisplay.style.display = 'none'; // Hide code example
        exportButton.style.display = 'none'; // Hide export button
        copyButton.style.display = 'none'; // Hide copy button
        explanationAccordion.style.display = 'none'; // Hide explanation
        return;
    }

    // Fetch data and show pattern
    fetch('patterns.json')
        .then(response => response.json())
        .then(data => {
            const selectedData = data.patterns[patternType.value][country.value];

            if (selectedData.compliance) {
                showComplianceWarnings(selectedData.compliance);
            }

            if (typeof selectedData === 'string') {
                // If it's a special message, display it directly without showing a regex pattern
                regexDisplay.innerHTML = `<strong>Notice:</strong> ${selectedData}`;
                regexDisplay.classList.remove('alert-success');
                regexDisplay.classList.add('alert-danger-custom');
                codeExampleDisplay.style.display = 'none'; // Hide code example
                exportButton.style.display = 'none'; // Hide export button
                copyButton.style.display = 'none'; // Hide copy button
                explanationAccordion.style.display = 'none'; // Hide explanation
            } else {
                // Otherwise, display the regex pattern and code example
                const selectedPattern = selectedData.pattern;
                regexDisplay.innerHTML = `<strong>Regex Pattern:</strong> ${selectedPattern}`;
                regexDisplay.classList.remove('alert-danger', 'alert-danger-custom');
                regexDisplay.classList.add('alert-success');
                
                const codeExample = displayCodeExample(selectedPattern, language.value);
                
                codeExampleDisplay.style.display = 'block'; // Show code example
                exportButton.style.display = 'inline-block'; // Show export button
                copyButton.style.display = 'inline-block'; // Show copy button

                // Inject disclaimer text dynamically
                injectDisclaimerText();

                // Display the explanation
                const explanation = selectedData.explanation;
                explanationBody.innerHTML = ''; // Clear previous explanations
                if (explanation) {
                    for (const [part, explanationText] of Object.entries(explanation)) {
                        explanationBody.innerHTML += `<strong class="text-warning">${part}:</strong> ${explanationText}<br>`;
                    }
                    explanationAccordion.style.display = 'block'; // Show explanation accordion
                } else {
                    explanationAccordion.style.display = 'none'; // Hide explanation if not available
                }

                // Handle export button click
                exportButton.onclick = function() {
                    exportToFile(selectedPattern, codeExample, language.value);
                };

                // Handle copy button click
                copyButton.onclick = function() {
                    copyToClipboard(selectedPattern, codeExample);
                };
            }
        })
        .catch(
            error => {
            regexDisplay.textContent = 'Failed to load patterns.';
            regexDisplay.classList.remove('alert-success');
            regexDisplay.classList.add('alert-danger');
            console.error('Error loading the patterns:', error);
            codeExampleDisplay.style.display = 'none'; // Hide code example
            exportButton.style.display = 'none'; // Hide export button
            copyButton.style.display = 'none'; // Hide copy button
            explanationAccordion.style.display = 'none'; // Hide explanation
        });
}

// Function to return the code example string and initialize CodeMirror
function displayCodeExample(regex, language) {
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

// Function to map languages to CodeMirror modes
function getModeForLanguage(language) {
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

// Function to inject disclaimer text dynamically
function injectDisclaimerText() {
    const disclaimerId = 'disclaimerText';
    let disclaimer = document.getElementById(disclaimerId);
    
    // If the disclaimer doesn't already exist, create and inject it
    if (!disclaimer) {
        disclaimer = document.createElement('small');
        disclaimer.id = disclaimerId;
        disclaimer.className = 'text-secondary mt-2 d-block';
        disclaimer.innerHTML = `Please note that these code samples are automatically generated. They are not guaranteed to work. If you find a syntax error, <a href="https://github.com/mnestorov/regex-patterns/issues" target="_blank" class="link-secondary">please submit a bug report</a>.`;

        // Inject the disclaimer after the code example
        const codeExampleDisplay = document.getElementById('codeExampleDisplay');
        codeExampleDisplay.parentNode.insertBefore(disclaimer, codeExampleDisplay.nextSibling);
    } else {
        // If it exists, make sure it's visible
        disclaimer.classList.remove('d-none');
    }
}

// Function to export the pattern and code example to a file
function exportToFile(pattern, codeExample, language) {
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

// Function to copy the pattern and code example to the clipboard
function copyToClipboard(pattern, codeExample) {
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

// Fallback method using document.execCommand('copy')
function fallbackCopyToClipboard(text) {
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

function resetForm() {
    // Reset the form fields
    document.getElementById('patternType').value = '';
    document.getElementById('country').innerHTML = '<option value="">- Please select -</option>';
    document.getElementById('programmingLanguage').value = '';
    document.getElementById('validationTemplates').value = '';

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

    // Reset visibility of select fields
    document.getElementById('countryWrapper').style.display = 'block';
    document.getElementById('validationTemplateSelectWrapper').style.display = 'none';
    document.getElementById('languageWrapper').style.display = 'block';

    // Make country required by default
    document.getElementById('country').required = true;
}