import { DrizzleQueryError, DrizzleError } from 'drizzle-orm';

type DBErrorType = { message: string; constraint: string | null };

interface ExtendedDrizzleError extends DrizzleError {
    detail: string;
    hint: string;
    code: string;
    constraint_name: string;
    table_name: string;
}

// Defines the shape of the error handler functions
type ErrorHandler = (error: ExtendedDrizzleError) => { message: string; constraint: string | null };



// Maps PostgreSQL error codes to specific handler functions
const PostgresErrorHandlers: Record<string, ErrorHandler> = {
    '23505': error => ({
        message: 'A duplicate entry was found for a unique field.',
        constraint: error.constraint_name,
    }),
    '23503': error => ({
        message: 'A foreign key violation occurred. The record you are trying to link does not exist.',
        constraint: error.constraint_name || null,
    }),
    '22P02': () => ({
        message: 'The data provided is in an invalid format (e.g., not a valid UUID).',
        constraint: null,
    }),
    '23514': error => ({
        message: 'A check constraint was violated.',
        constraint: error.constraint_name || null,
    }),
    '23502': error => ({
        message: `A required field is missing. The column '${error.hint}' cannot be null.`,
        constraint: error.constraint_name || null,
    }),
    '42703': error => ({
        message: 'An undefined column was referenced in the query.',
        constraint: error.constraint_name || null,
    }),
    '42601': () => ({
        message: "There's a syntax error in the database query.",
        constraint: null,
    }),
    '25000': () => ({
        message: 'Transaction failed: a data integrity issue occurred within a database transaction.',
        constraint: null,
    }),
    '08006': () => ({
        message: 'Database connection failed. The database may be unavailable.',
        constraint: null,
    }),
    '42P01': () => ({
        message: 'A referenced table does not exist in the database.',
        constraint: null,
    }),
    '40001': () => ({
        message:
            'Transaction serialization failure. Please retry the transaction as it could not be completed due to concurrent modifications.',
        constraint: null,
    }),
    default: error => ({
        message: `A database error occurred: ${error.message}`,
        constraint: null,
    }),
};

/**
 * Extracts a user-friendly message and constraint from a Drizzle ORM error.
 * @param error The error object from Drizzle.
 * @returns An object with the main error message and constraint name (if applicable).
 */
const getDbErrorMessage = (error: unknown): DBErrorType => {
    console.log(error);
    if (error instanceof DrizzleQueryError || error instanceof DrizzleError) {
        const originalError = error.cause as ExtendedDrizzleError;
        const handler = PostgresErrorHandlers[originalError.code ?? 'default'];

        if (handler) {
            return handler(originalError);
        }

        // Default case for any other unhandled DatabaseError
        return {
            message: `A database error occurred: ${originalError.message}`,
            constraint: null,
        };
    }

    // Fallback for other Error instances
    if (error instanceof Error) {
        return {
            message: error.message || 'An unexpected error occurred.',
            constraint: null,
        };
    }

    // Final fallback for unknown error types
    return { message: 'An unknown error occurred.', constraint: null };
};

export { PostgresErrorHandlers, getDbErrorMessage, type ErrorHandler, type DBErrorType };
