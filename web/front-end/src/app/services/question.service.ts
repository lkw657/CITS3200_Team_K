import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionService {

    HTTP: HttpClient;
    
    constructor(private http: HttpClient){
        this.HTTP = http;
    }

    getData(){
        return this.HTTP.get("http://localhost:3000/db/questionSet/latest");
    }
}
