export class CookieConsentManager {
    constructor() {
        this.cookieBanner = document.getElementById('cookieConsent');
        this.acceptCookiesButton = document.getElementById('acceptCookies');
    }

    init() {
        if (!this.getCookie('cookieConsent')) {
            this.cookieBanner.style.display = 'block';
        }

        this.acceptCookiesButton.addEventListener('click', () => {
            this.setCookie('cookieConsent', 'accepted', 365);
            this.cookieBanner.style.display = 'none';
        });
    }

    setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }
}
