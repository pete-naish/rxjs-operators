import { Subject, interval, Observable, Observer } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { myDebounceTime, myMergeMap, myTakeUntil } from "./MyObservable";

test("create our own mergeMap operator", (done) => {
  let expectedResult = [1, 1, 2, 1, 2, 2];

  const getObs = (index: number) => {
    return new Observable((observer: Observer<number>) => {
      observer.next(index);
      setTimeout(() => observer.next(index), 20);
      setTimeout(() => observer.next(index), 40);
      setTimeout(() => observer.complete(), 50);
    });
  };

  new Observable((observer: Observer<number>) => {
    observer.next(1);
    setTimeout(() => observer.next(2), 30);
    setTimeout(() => observer.complete(), 50);
  })
    .pipe(myMergeMap((val: number) => getObs(val)))
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
