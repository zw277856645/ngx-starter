export enum ApiResponseStatus {

    SUCCESS = 'SUCCESS', ERROR = 'ERROR'
}

export class ApiResponse {

    status: ApiResponseStatus;

    message?: string;

    data?: any;

    detail?: string;

}
