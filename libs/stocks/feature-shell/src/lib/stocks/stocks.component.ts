import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  customPeriod: Boolean = false;  
  customPeriodValue: string;
  fromDate = new FormControl(new Date());
  toDate = new FormControl(new Date());
  maxDate = new Date();


  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' },
    { viewValue: 'Custom Selection', value: 'cs' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  ngOnInit() {}

  selectDuration() {    
    if(this.stockPickerForm.get('period').value == 'cs'){
      this.customPeriod = true;
      return;
    }
    this.customPeriod = false;
    this.fetchQuote();
  }

  fetchDate() {
    if(this.toDate.value < this.fromDate.value){
      this.fromDate.setValue(new Date());      
      this.toDate.setValue(new Date());
    }
    this.fetchQuote();
  }


  fetchQuote() {    
    if (this.stockPickerForm.valid) {
      if(this.stockPickerForm.get('period').value == 'cs'){
        var diff = Math.abs(this.fromDate.value - this.toDate.value);
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        var thisYear = (new Date()).getFullYear(); 
        var defaultStart = new Date(thisYear, 0, 1);
        if((this.fromDate.value.toDateString() == defaultStart.toDateString()) && (this.toDate.value.toDateString() == (new Date()).toDateString())){
          this.customPeriodValue = 'ytd';
        }else{
          if(diffDays <= 30){
            this.customPeriodValue = '1m';
          }else if(diffDays > 30 && diffDays <= 90){
            this.customPeriodValue = '3m';
          }else if(diffDays > 90 && diffDays <= 180){
            this.customPeriodValue = '6m';
          }else if(diffDays > 180 && diffDays <= 365){
            this.customPeriodValue = '1y';
          }else if(diffDays > 365 && diffDays <= (365*2)){
            this.customPeriodValue = '2y';
          }else if(diffDays > (365*2) && diffDays <= (365*5)){
            this.customPeriodValue = '5y';
          }          
        }
        const { symbol } = this.stockPickerForm.value;
        this.priceQuery.fetchQuote(symbol, this.customPeriodValue);
      }else{     
        const { symbol, period } = this.stockPickerForm.value;
        this.priceQuery.fetchQuote(symbol, period);
      }
    }
  }
}
