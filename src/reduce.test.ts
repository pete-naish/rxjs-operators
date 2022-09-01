import { of } from "rxjs";
import { myReduce } from "./MyObservable";

test("create our own reduce operator", (done) => {
  const expectedResult = 15;

  let value = 0;

  of(1, 2, 3, 4, 5)
    .pipe(myReduce((acc, curr) => acc + curr, 0))
    .subscribe({
      next: (val) => {
        value = val;
      },
      complete: () => {
        expect(value).toBe(expectedResult);

        done();
      },
    });
});
