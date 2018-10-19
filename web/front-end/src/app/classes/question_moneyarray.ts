import { QuestionBase } from './question-base';

export class MoneyArrayQuestion extends QuestionBase<String> {
    controlType = 'money_array';
    type : string;
    number : number;

    constructor( paras : {} = {} ){
        super(paras);
        this.type = paras['type'] || '';
        this.number = paras['number'] || 0;
    }
}
