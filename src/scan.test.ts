import { of, scan } from "rxjs";
import { myScan } from "./MyObservable";

test("create our own scan operator", (done) => {
  const expectedResult = [1, 3, 6, 10, 15];

  of(1, 2, 3, 4, 5)
    .pipe(myScan((acc, curr) => acc + curr, 0))
    .subscribe((val) => {
      const expected = expectedResult.shift();
      expect(val).toBe(expected);

      if (!expectedResult.length) {
        done();
      }
    });
});
