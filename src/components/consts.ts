const FieldRequired = "This field is required";

const buildStages: string[] = [
    'Unknown',
    'Init',
    'Cloning',
    'Building',
    'Pushing',
    'Deploying',
    'Success',
    'Failure',
]

const stageSuccess = 6;
const stageFail = 7;

export {FieldRequired, buildStages, stageFail, stageSuccess};