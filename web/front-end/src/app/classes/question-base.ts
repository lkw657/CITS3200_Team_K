export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;

    constructor(paras: {
        value? : T,
        key?: string,
        label? : string,
        required?: boolean,
        order?: number,
        controlType?: string
    } = {}){
        this.value = paras.value;
        this.key = paras.key || '';
        this.label = paras.label || '';
        this.required = paras.required || true;
        this.order = paras.order === undefined ? 1 : paras.order;
        this.controlType = paras.controlType || '';
    }
}