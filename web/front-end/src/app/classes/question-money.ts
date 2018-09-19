import { QuestionBase } from './question-base';

export class MoneyQuestion extends QuestionBase<String> {
    controlType = 'money';
    type : string;

    constructor( paras : {} = {} ){
        super(paras);
        this.type = paras['type'] || '';
    }
}