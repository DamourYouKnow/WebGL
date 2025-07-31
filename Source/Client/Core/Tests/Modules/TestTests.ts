import { TestGroup } from "../TestGroup";

const testGroup = new TestGroup("Tests");

let wasExecuted = false;

let passingTestCase = new TestGroup("Test").AddTest(
    "Passing test",
    () => null,
    () => true,
    () => true
);

let failingTestCase = new TestGroup("Test").AddTest(
    "Failing test",
    () => null,
    () => true,
    () => false
)

testGroup.AddGroup("Test cases")
.AddTest(
    "Executor executes user code",
    () => {
        wasExecuted = true;
    },
    () => wasExecuted
).AddTest(
    "Test case passes if all evaluators resolve to true",
    () => passingTestCase.Execute(),
    () => passingTestCase.Success(),
).AddTest(
    "Test case fails if any evaluator resolves to false",
    () => failingTestCase.Execute(),
    () => !failingTestCase.Success()
);

const passingChildGroup = new TestGroup("Passing group").AddTest(
    "Test",
    () => null,
    () => true
);

const failingChildGroup = new TestGroup("Failing group").AddTest(
    "Test",
    () => null,
    () => false
);

const passingTestGroup = new TestGroup("Test group").AddTest(
    "Test case",
    () => null,
    () => true
).AddGroup(passingChildGroup);

const testGroupTestGroup = testGroup.AddGroup("Test groups")
.AddTest(
    "Test group passes if all test cases and child groups pass",
    () => passingTestGroup.Execute(),
    () => passingChildGroup.Success() 
);

let failingTestGroup = new TestGroup("Test group").AddTest(
    "Test case",
    () => null,
    () => true
).AddGroup(failingChildGroup);

testGroupTestGroup.AddTest(
    "Test group fails if any child group fails",
    () => failingTestGroup.Execute(),
    () => !failingChildGroup.Success()
)

failingTestGroup = new TestGroup("Test group").AddTest(
    "Test case",
    () => null,
    () => false
).AddGroup(passingChildGroup)

testGroupTestGroup.AddTest(
    "Test group fails if any test case fails",
    () => failingTestGroup.Execute(),
    () => !failingTestGroup.Success()
);

export default testGroup;