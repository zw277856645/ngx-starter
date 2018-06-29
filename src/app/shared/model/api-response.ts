export enum ApiResponseStatus {

    SUCCESS, ERROR
}

export class ApiResponse {

    status: ApiResponseStatus;

    message?: string;

    data?: any;

    detail?: string;

}
