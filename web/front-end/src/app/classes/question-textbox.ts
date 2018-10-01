import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase<String> {
    controlType = 'textbox';
    type : string;

    constructor( paras : {} = {} ){
        super(paras);
        this.type = paras['type'] || '';
    }
}