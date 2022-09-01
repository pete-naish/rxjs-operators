import { Subject, interval } from "rxjs";
import { myTakeUntil } from "./MyObservable";

test.skip("create our own takeUntil operator", (done) => {
  const stop$ = new Subject();

  setTimeout(() => stop$.next("world"), 45);

  const expectedResult = [0, 1, 2];

  interval(7)
    .pipe(myTakeUntil(stop$))
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
