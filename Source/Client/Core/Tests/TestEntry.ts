import matrixGroup from "./Modules/MatrixTests";

const testModules = [
    matrixGroup
];

testModules.forEach((testModule) => {
    testModule.Execute();
    console.log(testModule.Output().join('\n'));
});


