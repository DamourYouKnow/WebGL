import matrixGroup from "./Modules/MatrixTests";
import testGroup from "./Modules/TestTests";

const testModules = [
    matrixGroup,
    testGroup
];

testModules.forEach((testModule) => {
    testModule.Execute();
    console.log(testModule.Output().join('\n'));
});


