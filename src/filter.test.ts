import { of } from "rxjs";
import { myFilter } from "./MyObservable";

test("create our own filter operator", (done) => {
  const expectedResult = [2, 4];

  of(1, 2, 3, 4, 5)
    .pipe(myFilter((x: number) => x % 2 === 0))
    .subscribe((val) => {
      const expected = expectedResult.shift();

      expect(val).toBe(expected);

      if (!expectedResult.length) {
        done();
      }
    });
});
