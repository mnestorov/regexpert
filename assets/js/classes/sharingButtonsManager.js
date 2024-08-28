export class SharingButtonsManager {
    constructor(url) {
        this.url = url;
    }

    setup() {
        const facebookButton = document.getElementById('facebookShareButton');
        const twitterButton = document.getElementById('twitterShareButton');
        const linkedinButton = document.getElementById('linkedinShareButton');

        if (facebookButton) {
            facebookButton.onclick = () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`, '_blank');
            };
        }

        if (twitterButton) {
            twitterButton.onclick = () => {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(this.url)}`, '_blank');
            };
        }

        if (linkedinButton) {
            linkedinButton.onclick = () => {
                window.open(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(this.url)}`, '_blank');
            };
        }
    }
}
