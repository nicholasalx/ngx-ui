import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

import { getMonth } from './calendar-utils';
import './calendar.scss';

const CALENDAR_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Component({
  selector: 'swui-calendar',
  providers: [CALENDAR_VALUE_ACCESSOR],
  template: `
    <div class="swui-calendar" tabindex="0">
      <div class="flex-row--stretch flex-row--middle flex-row--gutter-none title-row">
        <div class="col-2 text-center">
          <button
            type="button"
            class="prev-month"
            [disabled]="disabled"
            title="Previous Month"
            (click)="prevMonth()">
            <span class="icon-arrow-left"></span>
          </button>
        </div>
        <div class="current-month col-8 text-center">
          {{ activeDate | amDateFormat: 'MMMM YYYY' }}
        </div>
        <div class="col-2 text-center">
          <button
            type="button"
            class="next-month col-2"
            title="Next Month"
            [disabled]="disabled"
            (click)="nextMonth()">
            <span class="icon-arrow-right"></span>
          </button>
        </div>
      </div>
      <div class="day-name-row flex-row--stretch">
        <div
          class="day-name col"
          *ngFor="let d of daysOfWeek">
          {{d}}
        </div>
      </div>
      <div class="day-container">
        <div
          class="day-row flex-row--stretch"
          *ngFor="let week of weeks">
          <div
            class="day-cell col"
            *ngFor="let day of week">
            <button
              *ngIf="day.num"
              class="day"
              type="button"
              [title]="day.date | amDateFormat: 'LL'"
              [ngClass]="getDayClass(day)"
              [disabled]="getDayDisabled(day.date)"
              (click)="onDayClick(day.date)">
              {{day.num}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    '(blur)': 'onTouchedCallback()'
  }
})
export class CalendarComponent implements OnInit, ControlValueAccessor {

  @Input() minDate: Date;
  @Input() disabled: boolean;
  @Input() maxDate: Date;
  @Input() daysOfWeek: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  @Output() change: EventEmitter<any> = new EventEmitter();

  get value() {
    return this._value;
  }

  set value(val: any) {
    const isSame = moment(val).isSame(this._value, 'day');
    if (!isSame) {
      this._value = val;
      this.onChangeCallback(this._value);
      this.change.emit(this._value);
    }
  }

  private activeDate: any;
  private _value: any;
  private weeks: any[];

  ngOnInit() {
    this.activeDate = moment(this.value);
    this.weeks = getMonth(this.activeDate);
  }

  getDayClass(day) {
    return {
      'first-day-of-month': day.num === 1,
      'last-day-of-week': day.dayOfWeek === 6,
      today: day.today,
      active: day.date.isSame(this.value, 'day')
    };
  }

  getDayDisabled(date) {
    if(this.disabled) return true;
    if(!date) return false;

    const isBeforeMin = this.minDate && date.isSameOrBefore(this.minDate);
    const isAfterMax = this.maxDate && date.isSameOrAfter(this.maxDate);

    return isBeforeMin || isAfterMax;
  }

  onDayClick(day) {
    this.value = day.clone().toDate();
  }

  prevMonth() {
    let date = this.activeDate.clone();
    this.activeDate = date.subtract(1, 'month');
    this.weeks = getMonth(this.activeDate);
  }

  nextMonth() {
    let date = this.activeDate.clone();
    this.activeDate = date.add(1, 'month');
    this.weeks = getMonth(this.activeDate);
  }

  writeValue(val: any) {
    const isSame = moment(val).isSame(this.value, 'day');
    if (!isSame) {
      this._value = val;
      this.activeDate = moment(val);
      this.weeks = getMonth(this.activeDate);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

}