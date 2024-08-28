export class QRCodeManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    generate(data) {
        if (this.container && this.container.tagName.toLowerCase() === 'canvas') {
            QRCode.toCanvas(this.container, data, { width: 190 }, (error) => {
                if (error) {
                    console.error('QR Code Generation Error:', error);
                }
            });
        } else {
            console.error('Invalid element. Please ensure the target element is a canvas.');
        }
    }
}
