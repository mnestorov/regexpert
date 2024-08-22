function updateCountriesAndLabel() {
    const patternType = document.getElementById('patternType').value;
    const label = document.getElementById('secondSelectLabel');
    const countrySelect = document.getElementById('country');

    if (patternType === 'commonPatterns') {
        label.textContent = 'Select Dates, Currency or CreditCards:';
    } else {
        label.textContent = 'Select Country:';
    }

    if (patternType) {
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
    } else {
        countrySelect.innerHTML = '<option value="">Please select pattern type first</option>';
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
    const disclaimerText = document.getElementById('disclaimerText'); // Get the disclaimer text element

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
        disclaimerText.classList.add('d-none'); // Hide disclaimer text
        return;
    }

    // Fetch data and show pattern
    fetch('patterns.json')
        .then(response => response.json())
        .then(data => {
            const selectedData = data.patterns[patternType.value][country.value];

            if (typeof selectedData === 'string') {
                // If it's a special message, display it directly without showing a regex pattern
                regexDisplay.innerHTML = `<strong>Notice:</strong> ${selectedData}`;
                regexDisplay.classList.remove('alert-success');
                regexDisplay.classList.add('alert-danger-custom');
                codeExampleDisplay.style.display = 'none'; // Hide code example
                exportButton.style.display = 'none'; // Hide export button
                copyButton.style.display = 'none'; // Hide copy button
                explanationAccordion.style.display = 'none'; // Hide explanation
                disclaimerText.classList.add('d-none'); // Hide disclaimer text
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
                disclaimerText.classList.remove('d-none'); // Show disclaimer text

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
        .catch(error => {
            regexDisplay.textContent = 'Failed to load patterns.';
            regexDisplay.classList.remove('alert-success');
            regexDisplay.classList.add('alert-danger');
            console.error('Error loading the patterns:', error);
            codeExampleDisplay.style.display = 'none'; // Hide code example
            exportButton.style.display = 'none'; // Hide export button
            copyButton.style.display = 'none'; // Hide copy button
            explanationAccordion.style.display = 'none'; // Hide explanation
            disclaimerText.classList.add('d-none'); // Hide disclaimer text
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
    document.getElementById('country').innerHTML = '<option value="">Please select</option>';
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
}
