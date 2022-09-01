import { of, interval } from "rxjs";
import { take } from "rxjs/operators";
import { myTake } from "./MyObservable";
// import { myScan } from "./MyObservable";

test("create our own test operator", (done) => {
  const expectedResult = [0, 1, 2, 3, 4];

  interval(10)
    .pipe(myTake(5))
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
