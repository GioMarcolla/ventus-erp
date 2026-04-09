const getErrorMessage = (error: unknown): string | void => {
    if (error instanceof Error) {
        return error.message;
    }
};

export { getErrorMessage };
