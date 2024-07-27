// ErrorHandler.js

export class ErrorHandler {

    static displayErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-container');
        
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;

        errorContainer.appendChild(errorMessage);
        document.body.appendChild(errorContainer);

        setTimeout(() => {
            document.body.removeChild(errorContainer);
        }, 15000);
    }

    static handleError(error, userMessage) {
        console.error('Error:', error);
        this.displayErrorMessage(userMessage);
    }
}

