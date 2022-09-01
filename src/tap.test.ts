import { of } from "rxjs";
import { myTap2 } from "./MyObservable";

test("create our own tap operator", (done) => {
  const expectedResult = [1, 2, 3, 4, 5];

  of(1, 2, 3, 4, 5)
    .pipe(myTap2(console.log))
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
