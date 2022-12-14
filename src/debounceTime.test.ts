import { Subject, interval, Observable, Observer } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { myDebounceTime, myTakeUntil } from "./MyObservable";

test.skip("create our own debounceTime operator", (done) => {
  let expectedResult = [2, 5, 6];

  new Observable((observer: Observer<number>) => {
    observer.next(1);
    setTimeout(() => observer.next(2), 10);
    setTimeout(() => observer.next(3), 40);
    setTimeout(() => observer.next(4), 50);
    setTimeout(() => observer.next(5), 60);
    setTimeout(() => observer.next(6), 90);
    setTimeout(() => observer.complete(), 100);
  })
    .pipe(myDebounceTime(20))
    .subscribe({
      next: (val) => {
        const expected = expectedResult.shift();
        expect(val).toBe(expected);
      },
      error: (err: any) => {},
      complete: () => {
        expect(expectedResult.length).toBe(0);
        done();
      },
    });
});
