export class TestModule {
    private name: string;
    private executedTests: number = 0;
    private successfulTests: number = 0;
    private totalTime: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    public Test(
        label: string,
        executor: () => unknown,
        expectedResult: unknown,
        timeLimit?: number
    ): boolean {
        const startTime = performance.now();

        const actualResult = executor();

        const testDeltaTime = performance.now() - startTime;
        this.totalTime += testDeltaTime;

        this.executedTests += 1;

        // Correctness test
        if (expectedResult !== actualResult) {
            console.error(this.summarizeTest(label, expectedResult, actualResult));
            return false;
        }

        // Performance test
        if (timeLimit != undefined && testDeltaTime > timeLimit) {
            console.warn(`${label}\nTook ${testDeltaTime} time`);
            return false;
        }

        this.successfulTests += 1;
        return true;
    }

    private summarizeTest(
        label: string | (() => string),
        expected: unknown,
        actual: unknown
    ): string {
        return `${label}\nExpected\n${expected}\nActual\n${actual}`;
    }
}

