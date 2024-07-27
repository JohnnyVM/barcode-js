// ErrorHandler.js

export class ErrorHandler {

    static displayErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerText = message;

        document.body.appendChild(errorContainer);

        setTimeout(() => {
            document.body.removeChild(errorContainer);
        }, 5000);
    }

    static handleError(error, userMessage) {
        console.error('Error:', error);
        this.displayErrorMessage(userMessage);
    }
}

