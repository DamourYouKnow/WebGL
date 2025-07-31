const passSymbol = '✔';
const failSymbol = '✖';

type Executor = () => void;
type Evaluator = (result: unknown, time?: number) => boolean;

interface TestCase {
    description: string,
    executor: Executor,
    evaluators: Evaluator[]
}

// TODO: Consider recursive tree structure for grouping tests.
class TestUnit {
    public Label: string;
    private testCases: TestCase[] = []
    private successfulTests: number = 0
    private output: string[] = [];

    public constructor(label: string) {
        this.Label = label;
    }

    public Add(
        description: string,
        executor: Executor,
        ...evaluators: Evaluator[]
    ): TestUnit {
        this.testCases.push({
            description: description,
            executor: executor,
            evaluators, ...evaluators
        });

        return this;
    }

    public Execute(): boolean {
        for (const testCase of this.testCases) {
            try {
                const startTime = performance.now();
                const result = testCase.executor();
                const testDeltaTime = performance.now() - startTime;

                for (const evaluator of testCase.evaluators) {
                    const pass = evaluator(result, testDeltaTime);
                    
                    if (pass) {
                        this.successfulTests += 1;

                        this.output.push(
                            `    ${passSymbol} ${testCase.description}`
                        );
                    }
                    else {
                        this.output.push(
                            `    ${failSymbol} ${testCase.description}`
                        );
                    }
                }
            }
            catch (err: unknown) {
                console.error(err);
            }
        }

        const pass = this.successfulTests == this.testCases.length;
        const symbol = pass ? passSymbol : failSymbol;
        
        const passCount = 
            `(${this.successfulTests} / ${this.testCases.length})`;

        this.output = [
            `  ${symbol} ${this.Label} ${passCount}`,
            ...this.output
        ];

        return pass;
    }

    public Output(): string {
        return this.output.join('\n');
    }
}


export class TestModule {
    private label: string;
    private testUnits: TestUnit[] = [];
    private successfulUnits: number = 0;

    public constructor(label: string) {
        this.label = label;
    }

    public CreateUnit(label: string): TestUnit {
        const testUnit = new TestUnit(label);
        this.testUnits.push(testUnit);
        return testUnit;
    }

    public Execute(): boolean {
        let output: string[] = []

        for (const testUnit of this.testUnits) {
            const pass = testUnit.Execute();      
            
            if (pass) {
                this.successfulUnits += 1;
            }

            output.push(testUnit.Output());
        }

        const pass = this.successfulUnits == this.testUnits.length;
        const symbol = pass ? passSymbol : failSymbol;
        const passCount = 
            `(${this.successfulUnits} / ${this.testUnits.length})`;

        output = [
            `${symbol} ${this.label} ${passCount}`,
            ...output
        ]

        console.log(output.join('\n'));
        return pass;
    }
}
