import { QuestionBase } from './question-base';

export class TextQuestion extends QuestionBase<String> {
    controlType = 'text';
    type : string;

    constructor( paras : {} = {} ){
        super(paras);
        this.type = paras['type'] || '';
    }
}
