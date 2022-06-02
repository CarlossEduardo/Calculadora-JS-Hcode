class CalcController {
    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._operation = [];
        this._lastOperator = '';
        this._lastNumber = '';
        this._currentDate;
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this.initialize();
       
        this.initButtonsEvent();
        this.initkeyBoard();
    }


    initialize() {

        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.togglerAudio();
            });
        })



    }

    togglerAudio(){
        this._audioOnOff = !this._audioOnOff; 

    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }




    execBtn(value) { // Metodo responsavel por executar o botão
        this.playAudio();
        
        switch (value) {
            case 'ac':
                this.clearAll();
                this.setLastNumberDisplay();

                break;
            case 'ce':
                this.clearEntry();
                this.setLastNumberDisplay();

                break;
            case 'porcento':
                this.addOperation('%');

                break;
            case 'divisao':
                this.addOperation('/');

                break;
            case 'multiplicacao':
                this.addOperation('*');

                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'soma':
                this.addOperation('+');
                break;

            case 'igual':
                if(this._operation.length == 2) {
                    this._lastOperator = this.getLastItem();
                    this._lastNumber = this.getLastItem(false);
                }
                this.calculate();

                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(value);


                break;

            default:
                this.setError();
                break;

        }
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator= '';

    }

    clearEntry() {
        this._operation.pop();
        this._displayCalcEl.innerHTML = "0";

    }

    setError() {
        this._displayCalcEl.innerHTML = "Erro";

    }


    pushOperator(value){



        if (this._operation.length <= 2) {
            this._operation.push(value);
            
            
        } else {      
            this._operation.push(value);
            this.calculate();    
        }
        
    }

    
    getResult(){
      //  this.displayDate = this._operation.join("");
      try{
        console.log(this._operation.join(""));
        return eval(this._operation.join(""));
      }catch(e){
          console.log(e);
          setTimeout(() => {
            this.setError();
          }, 1);
      }

    }

    calculate(){
        let last = '';


        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        
        if(this._operation.length > 3 ) {
            last = this._operation.pop();
            this._lastOperator = this.getLastItem();
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){
            this._lastOperator = this.getLastItem();
            this._lastNumber = this.getLastItem(false);
        }

        

        if (last == '%') {
            //this.setLastOperator((this.getLastOperation() / 100));
            let percent = this.getLastOperation() / 100;

            if(this._operation[1] == '+'){ // tratando as diferentes tipos de operação com porcentagem - ADIÇÃO
                percent = 1 + percent;
                this._operation = [this._operation[0] * percent];

            }
            if (this._operation[1] == '-') { // Para subtração
                percent = 1 - percent;
                this._operation = [this._operation[0] * percent];
            }

            if(this._operation[1] == '*'){ // Para Multiplicação
                this._operation = [this._operation[0] * percent];

            }
            if(this._operation[1] == "/"){ // Para Divisão
                this._operation = [this._operation[0] / percent];

            }
            
        }else{
            
            let result = this.getResult();
            this._operation = [result];
            console.log(` Novo ${this._operation}`);
            if(last) this._operation.push(last);
        }

        this.setLastNumberDisplay();

    }
    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation == 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.IsOperation(lastOperation) || !lastOperation){
            this.pushOperator('0.');

        }else{
            this.setLastOperator(`${lastOperation}.`);

        }
        this.setLastNumberDisplay();


    }


    addOperation(value) {
        
        if (isNaN(this.getLastOperation())) {//Para quando estiver vazio , no caso do meu primeiro numero/ para trocar o sinal da operação
            if (this.IsOperation(value)) {
                this.setLastOperator(value);
                console.log(` Mudei Operador${this._operation}`);
            } else {
                this.pushOperator(value);
                console.log(` Primeira ${this._operation}`);
                this.setLastNumberDisplay();
                
            }

        }else if (this.IsOperation(value)) {// caso eu tenha parado de digitar digitos e passado a digitar operador
            this.pushOperator(value);
            console.log(`ADD Operator ${this._operation}`);

        } else {//caso cntinue digitando digitos , vou concatenar eles

            this.setLastOperator(this.concatNumbers(this.getLastOperation(), value));
            console.log(`Concat Number ${this._operation}`);
            this.setLastNumberDisplay();


        }
    }

    getLastItem(IsOperation = true){// ao chamar esse metodo , se eu passar true ,é pq quero um operador
        let lastItem;

        for (let index = this._operation.length - 1; index >= 0 ; index--) {



                if(this.IsOperation(this._operation[index]) == IsOperation){
                    lastItem = this._operation[index];
                    break;
                }


        }
    //Forma certa de resolver, quando o last Item é sobrescrito por undefined
      //  if(!lastItem) {
       //     lastItem = (IsOperation) ? this._lastOperator : this._lastNumber;
       // }

        
        return lastItem;
        


    }

    setLastNumberDisplay(){
        let lastNumber = this.getLastItem(false);

        if(!lastNumber){
            lastNumber = 0;
        }

        this.displayCalc = lastNumber;

    }

    IsOperation(value) {
        let operators = ['+', '-', '*', '/', '%'];
        if (operators.indexOf(value) > -1) {// index of me retorna -1 caso n tenha o item no array , ou um numero com a qtd de vezes que o mesmo aparece
            return true;
        } else {
            
            return false;
        }
        //maneira mais pratica mas
        //  return (operators.indexOf(value) > -1);

    }

    setLastOperator(value){ 

        this._operation[this._operation.length - 1] = value;
    }

    concatNumbers(value, value2) {
        //let numbers = `${value}${value2}`;
        let numbers = value.toString() + value2.toString();
        
        return numbers;
    }

    initButtonsEvent() {
        let buttons = document.querySelectorAll('#buttons > g, #parts >g');

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                console.log(btn.className.baseVal.replace("btn-", ""));
                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });



        });


    }

    initkeyBoard(){

        document.addEventListener('keyup', e=>{
            console.log(e.key);
            this.playAudio();

            switch (e.key) {
                case 'escape':
                    this.clearAll();
                    this.setLastNumberDisplay();
    
                    break;
                case 'Backspace':
                    this.clearEntry();
                    this.setLastNumberDisplay();
    
                    break;
                case '%':
                    
                case '/':
                    
                case '*':
                    
                case '-':
                  
                case '+':
                    this.addOperation(e.key);
                    break;
    
                case '=':
                case 'Enter':
                    if(this._operation.length == 2) {
                        this._lastOperator = this.getLastItem();
                        this._lastNumber = this.getLastItem(false);
                    }
                    this.calculate();
    
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
    
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                        if(e.ctrlKey) this.copyToClipBoard();
                    break;

                //case 'V':
                  //  if(e.ctrlKey) this.pasteFromClipBoard();
                //break;
            }
        

        } );


    }

    addEventListenerAll(element, events, fn) {
        let groupEvents = events.split(" ");

        groupEvents.forEach(eventListen => {
            element.addEventListener(eventListen, fn, false);
        });

    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];

    }

    copyToClipBoard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);

        input.select();
        document.execCommand("Copy");
        input.remove();


    }
    pasteFromClipBoard(){
        document.addEventListener('paste', e=>{

        let text = e.clipboardData.getData('Text');
        
            this.displayCalc = parseFloat(text);
            this.addOperation(parseFloat(text));
        


        })

    }


    get displayTime() {
        return this._timeEl.innerHTML;

    }
    set displayTime(value) {
        return this._timeEl.innerHTML = value;

    }



    get displayDate() {
        return this._dateEl.innerHTML;
    }


    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }


    get displayCalc() {
        return this._displayCalcEl.innerHTML;

    }
    set displayCalc(value) {
        if(value.length >= 10){
            this.setError();
            return false;
        }
            this._displayCalcEl.innerHTML = value;
        
        
    }

    get currentDate() {

        return new Date();
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }


}