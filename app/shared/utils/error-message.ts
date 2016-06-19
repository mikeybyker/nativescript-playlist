export class ErrorMessage {

    title: string;
    message: string;

    constructor(title: string = 'Error',
        message: string = 'There has been an error'
    )
    {
        this.title = title;
        this.message = message;
    }
}