const passSymbol = '✔';
const failSymbol = '✖';
const unknownSymbol = '?';

type Executor = () => void;
type Evaluator = (result: unknown, time?: number) => boolean;

class TestCase {
    private description: string;
    private executor: Executor;
    private evaluators: Evaluator[];
    private success: boolean | null;

    public constructor(
        description: string,
        executor: Executor,
        evaluators: Evaluator[]
    ) {
        this.description = description;
        this.executor = executor;
        this.evaluators = evaluators;
        this.success = null;
    }

    public Execute(): boolean {
        try {
            const startTime = performance.now();
            const result = this.executor();
            const testDeltaTime = performance.now() - startTime;

            for (const evaluator of this.evaluators) {
                const pass = evaluator(result, testDeltaTime);
                
                if (!pass) {
                    this.success = false;
                    return false;
                }
            }

            this.success = true;
            return true;
        }
        catch (err: unknown) {
            console.error(err);
            this.success = false;
            return false;
        }
    }

    public Output(): string {
        if (this.success === true) {
            return `${passSymbol} ${this.description}`;
        }
        else if (this.success === false) {
            return `${failSymbol} ${this.description}`;
        }
        else {
            return `${unknownSymbol} ${this.description}`;
        }
    }
}

export class TestGroup {
    private label: string;

    private parentGroup: TestGroup | null = null;
    private childGroups: TestGroup[] = [];

    private testCases: TestCase[] = [];
    private successfulTests: number = 0;
    
    public constructor(label: string) {
        this.label = label;
    }

    public AddTest(
        description: string,
        executor: Executor,
        ...evaluators: Evaluator[]
    ): TestGroup {
        const testCase = new TestCase(description, executor, evaluators);
        this.testCases.push(testCase);
        return this;
    }

    public AddGroup(testGroup: string | TestGroup): TestGroup {
        if (typeof testGroup == "string") {
            testGroup = new TestGroup(testGroup);
        }

        this.childGroups.push(testGroup);
        return testGroup;
    }

    public Execute(): boolean {
        for (const testCase of this.testCases) {
            const pass = testCase.Execute();
            if (pass) {
                this.successfulTests += 1;
            }
        }

        for (const testGroup of this.childGroups) {
            const pass = testGroup.Execute();
            if (pass) {
                this.successfulTests += 1;
            }
        }

        return this.Success();
    }

    public Success() {
        const testsInGroup = this.testCases.length + this.childGroups.length;
        return this.successfulTests == testsInGroup;
    }

    public Output(level: number=0): string[] {
        const testsInGroup = this.testCases.length + this.childGroups.length;

        const symbol = this.Success() ? passSymbol : failSymbol;

        const testsOutputs = this.testCases.map((testCase) => {
            return indent(testCase.Output(), level + 1);
        });

        const childGroupOutputs = this.childGroups.map((childGroup) => {
            return childGroup.Output(level + 1).map((childOuput) => {
                return childOuput;
            }).join('\n');
        });

        const passCount = `${this.successfulTests} / ${testsInGroup}`;

        return [
            indent(`${symbol} ${this.label} (${passCount})`, level),
            ...testsOutputs,
            ...childGroupOutputs
        ];
    }

    private depth(): number {
        let result = 1;
        
        let currentGroup = this.parentGroup;
        while (currentGroup) {
            currentGroup = currentGroup.parentGroup;
            result += 1;
        }

        return result;
    }
}

function indent(string: string, level: number, spacesPerLevel: number=4) {
    const indentation = ' '.repeat(level * spacesPerLevel);
    return `${indentation}${string}`;
}
