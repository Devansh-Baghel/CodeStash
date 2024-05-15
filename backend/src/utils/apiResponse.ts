class ApiResponse {
  statusCode: number;
  data: object;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: object, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
