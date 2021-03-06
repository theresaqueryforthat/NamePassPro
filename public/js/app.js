// namepass generation logic
$(document).ready(function () {
    const logoutBtn = $('#logout');
    logoutBtn.on('click', async function () {
        await $.post('/api/users/logout');
        window.location.href = '/';
    });
});

// TODO: port previous functions to work here as normal
// username options
// verbs and nouns are mutally exclusive
// common and uncommon words are mutually exclusive
const verbInput = $('#verbs'); // id="verbs"
const nounInput = $('#nouns'); // id="nouns"
const nameLengthSlider = $('#name-max'); // id="word-max"
const commonWordInput = $('#common'); // id="common"
const uncommonWordInput = $('#uncommon'); // id="uncommon"
const nameLengthEl = $('#name-length-value'); // id="name-length"

// password options
const lowerInput = $('#lowercase'); // id="lowercase"
const upperInput = $('#uppercase'); // id="uppercase"
const numInput = $('#numbers'); // id="numbers"
const specialInput = $('#special'); // id="special"
const passLengthSlider = $('#passLength'); // id="passLength"
const passLengthEl = $('#pass-length-value'); // id="passLength"

// buttons and text boxes
const userGenerateButton = $('#user-generate'); // id="user-generate"
const userCopyButton = $('#user-copy'); // id="user-copy"
const passGenerateButton = $('#pass-generate'); // id="pass-generate"
const passCopyButton = $('#pass-copy'); // id="pass-copy"
const bothGenerateButton = $('#both-generate'); // id="both-generate"
const saveButton = $("#btn-save"); // id="btn-save"

// Initialize the necessary checkboxes so they are checked when the page loads.
// default options are loaded for each:
// username
verbInput.attr('checked', true);
nounInput.attr('checked', true);
commonWordInput.attr('checked', true);

// password
lowerInput.attr('checked', true);
upperInput.attr('checked', true);
numInput.attr('checked', true);
specialInput.attr('checked', true);

// Define UTF codes representing the set of possible password characters per setting
const lowerChars = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
const upperChars = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
const numChars = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
const specialChars = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];

// global arrays, objects, variables
let possibleChars = [];
let userPass = {};
let nums = [];
let generatePassActive = true;
let generateUserActive = true;

passLengthSlider.on('input', () => {
    passLengthEl.text(passLengthSlider.val());
});

nameLengthSlider.on('input', () => {
    nameLengthEl.text(nameLengthSlider.val());
});

const validateNameInput = () => {
    // I confirm whether or not to include verbs and/or nouns in my name
    // my input should be validated and at least one character type should be selected
    if (verbInput.is(':checked') || nounInput.is(':checked')) {
        generateUsername();
    } else {
        alert("Please select either Verbs, Nouns, or both.")
        return;
    }
}

// do not allow password to be generated if no option is chosen
const validatePassInput = () => {
    // I confirm whether or not to include lowercase, uppercase, numeric, and/or special characters
    // my input should be validated and at least one character type should be selected
    if (lowerInput.is(':checked') || upperInput.is(':checked') || numInput.is(':checked') || specialInput.is(':checked')) {
        generatePassword();
    } else {
        alert("Please select at least one password option.")
        return;
    }
}

// initialize the possibleChars array to prep for password generation
const initPassSettings = () => {

    if (lowerInput.is(':checked')) {
        possibleChars = possibleChars.concat(lowerChars);
    }
    if (upperInput.is(':checked')) {
        possibleChars = possibleChars.concat(upperChars);
    }
    if (numInput.is(':checked')) {
        possibleChars = possibleChars.concat(numChars);
    }
    if (specialInput.is(':checked')) {
        possibleChars = possibleChars.concat(specialChars);
    }
}

// Choose password length 8-128 characters
let passLength = passLengthSlider.value;
const generatePassword = () => {

    // Choose password length 8-128 characters
    let passLength = passLengthSlider.val();
    let passTextBox = $('#password');
    let newChar = '';
    let nextChar = '';
    passTextBox.html('Loading...');
    possibleChars = [];

    initPassSettings();
    passTextBox.html('');

    // a password is generated that matches the selected criteria
    for (let i = 0; i < passLength; i++) {
        nextChar = Math.floor(Math.random() * (possibleChars.length - 1));
        newChar = String.fromCharCode(possibleChars[nextChar]);
        passTextBox.append(newChar);
    }

    generatePassActive = true;
}

const generateUsername = async function () {
    let nameTextBox = $('#username');
    let allowVerbs = 0;
    let allowNouns = 0;
    if (nounInput.is(':checked')) {
        allowNouns = 1;
    }
    if (verbInput.is(':checked')) {
        allowVerbs = 1;
    }
    let res = await $.get('/api/word/', {
        length: nameLengthSlider.val(),
        is_verb: allowVerbs,
        is_noun: allowNouns,
    });
    nameTextBox.html(res);
};

// save button logic
saveButton.on('click', async function (event) {

    let usernameField = $("#username");
    let passwordField = $("#password");

    event.preventDefault();
    await $.post('/api/data', {
        username: usernameField.val().trim(),
        password: passwordField.val().trim(),
    });
    window.location.reload();
});

passGenerateButton.on('click', validatePassInput);
userGenerateButton.on('click', validateNameInput);

// I am able to press the button and generate both at the same time
bothGenerateButton.on('click', () => {
    validateNameInput();
    validatePassInput();
});

userCopyButton.on('click', () => {
    let copyText = $("#username");

    $(copyText).focus();
    $(copyText).select();

    navigator.clipboard.writeText(copyText.html());
});

passCopyButton.on('click', () => {
    let copyText = $('#password');

    $(copyText).focus();
    $(copyText).select();

    navigator.clipboard.writeText(copyText.html());
});
