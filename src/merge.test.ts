import { merge, Observable, Observer } from "rxjs";
import { myMerge } from "./MyObservable";

test("create our own merge operator", (done) => {
  const obs1 = new Observable((observer: Observer<number>) => {
    observer.next(1);
    setTimeout(() => {
      observer.next(2);
    }, 10);
    setTimeout(() => {
      observer.next(3);
    }, 30);
    setTimeout(() => {
      observer.next(4);
    }, 40);
    setTimeout(() => {
      observer.next(5);
    }, 80);
    setTimeout(() => {
      observer.complete();
    }, 80);
  });
  const obs2 = new Observable((observer: Observer<string>) => {
    observer.next("a");
    setTimeout(() => {
      observer.next("b");
    }, 20);
    setTimeout(() => {
      observer.next("c");
    }, 50);
    setTimeout(() => {
      observer.next("d");
    }, 60);
    setTimeout(() => {
      observer.next("e");
    }, 70);
    setTimeout(() => {
      observer.complete();
    }, 80);
  });

  let expectedResult = [1, "a", 2, "b", 3, 4, "c", "d", "e", 5];

  myMerge(obs1, obs2).subscribe({
    next: (val: any) => {
      const expected = expectedResult.shift();
      expect(val).toBe(expected);
    },
    error: (err: any) => console.log(err),
    complete: () => done(),
  });
});
