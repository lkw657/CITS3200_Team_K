import { QuestionBase } from './question-base';

export class MoneyQuestion extends QuestionBase<String> {
    controlType = 'date';
    type : string;

    constructor( paras : {} = {} ){
        super(paras);
        this.type = paras['type'] || '';
    }
}