export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    disabled : boolean;
    allowComments: boolean;
    form_name : string;

    constructor(paras: {
        value? : T,
        key?: string,
        label? : string,
        required?: boolean,
        order?: number,
        controlType?: string,
        disabled? : boolean,
        allowComments? : boolean,
        form_name? : string
    } = {}){
        this.value = paras.value;
        this.key = paras.key || '';
        this.label = paras.label || '';
        this.required = paras.required || true;
        this.order = paras.order === undefined ? 1 : paras.order;
        this.controlType = paras.controlType || '';
        this.disabled = paras.disabled || false;
        this.allowComments = paras.allowComments || false;
        this.form_name = paras.form_name || '';
    }
}