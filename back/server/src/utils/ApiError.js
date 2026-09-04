export class ApiError extends Error {
    constructor(status, message) {

        const defaultMessages = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            500: 'Internal Server Error',
        };

        super(message || defaultMessages[status] || 'Unknown Error');
        this.status = status;
        this.name = 'ApiError';
    }
}