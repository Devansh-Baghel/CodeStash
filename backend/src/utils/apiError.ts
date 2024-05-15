class ApiError extends Error {
  statusCode: number;
  data: object | null;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      //@ts-expect-error
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
