import { makeAutoObservable } from "mobx";

export default class CounterStore {
    title = "Counter store";
    count = 42;
    events: string[] = [`Initial count is ${this.count}`]; // nội dung ban đầu của events

    constructor() {
        makeAutoObservable(this);
    }

    increment = (amount = 1) => {
        this.count += amount;
        this.events.push(`Increment by ${amount} - count is now ${this.count}`); // thêm nội dung vào mảng events
    };

    decrement = (amount = 1) => {
        this.count -= amount;
        this.events.push(`Decrement by ${amount} - count is now ${this.count}`);
    };

    get eventCount() {
        return this.events.length; // đếm số lần sự kiện xảy ra
    }
}
