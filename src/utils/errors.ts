
export class UnauthorizedError extends Error {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = "Invalid email or password") {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class NotFoundError extends Error {
    constructor(message: string = "Resource not found") {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends Error {
    constructor(message: string = "Conflict with existing resource") {
        super(message);
        this.name = 'ConflictError';
    }
}

