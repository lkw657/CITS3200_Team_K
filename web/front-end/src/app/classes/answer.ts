export class Answer {
    order: number;
    answer: string;

    constructor(paras: {
        order?: number,
        answer?: string
    } = {}){
        this.order = paras.order === undefined ? 1 : paras.order;
        this.answer = paras.answer || '';
    }
}