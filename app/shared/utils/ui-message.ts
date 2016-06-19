import {Injectable}       from '@angular/core';
import dialogs = require('ui/dialogs');

@Injectable()
export class UIMessage {
    
    constructor () {}
  
    showMessage(message, options:any={}):Promise<void>{
        return dialogs.alert({
            title: options.title || 'Info',
            message: message,
            okButtonText: options.okText || 'OK'
        }); 
    }
}