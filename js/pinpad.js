document.addEventListener('DOMContentLoaded', () => {
    const lcdScreen = document.getElementById('lcd-screen');
    const pinButtons = document.querySelectorAll('.pin-button');
    const clearButton = document.getElementById('clear-button');
    const saveButton = document.getElementById('save-button');
    const modalWelcome = document.getElementById('modal-welcome');
    const modalAccess = document.getElementById('modal-access');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const attemptsDisplay = document.getElementById('attempts');
    const yellowBar = document.getElementById('yellow-bar');

    let enteredPin = '';
    let verificationPin = '';
    let savedPin = localStorage.getItem('pin');
    let attempts = 3;
    let isFirstTimeEntry = !savedPin;
    let isFirstFailure = true;
    let isPinVisible = true;

    const updateLcdScreen = () => {
        const pinToDisplay = isFirstTimeEntry ? enteredPin : verificationPin;
        lcdScreen.textContent = isPinVisible ? (pinToDisplay || 'Insert PIN') : (pinToDisplay ? '*'.repeat(pinToDisplay.length) : 'Insert PIN');
    };

    const openModal = (modal) => {
        modal.style.display = 'flex';
        saveButton.textContent = modal === modalWelcome ? 'Save' : 'OK';
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    const clearPin = () => {
        enteredPin = '';
        verificationPin = '';
        updateLcdScreen();
    };

    const displayError = (message) => {
        lcdScreen.classList.add('not-a-number');
        lcdScreen.textContent = message;

        setTimeout(() => {
            lcdScreen.classList.remove('not-a-number');
            updateLcdScreen();
        }, 1000);
    };

    const savePin = () => {
        if (enteredPin.length === 6 && enteredPin !== 'Insert PIN') {
            localStorage.setItem('pin', enteredPin);
            savedPin = enteredPin;
            isFirstTimeEntry = false;
            updateLcdScreen();
            closeModal(modalWelcome);
            openModal(modalAccess);
            clearPin();
        } else {
            displayError('Enter a valid 6-digit PIN');
        }
    };

    const checkPin = () => {
        if (verificationPin === savedPin) {
            lcdScreen.classList.add('correct-pin');
            lcdScreen.textContent = 'Correct';

            setTimeout(() => {
                window.location.href = 'https://www.codebay-innovation.com';
            }, 1000);
        } else {
            lcdScreen.classList.add('wrong-pin');
            lcdScreen.textContent = 'Wrong';

            setTimeout(() => {
                lcdScreen.classList.remove('wrong-pin');
                attempts--;
                attemptsDisplay.textContent = `${attempts}`;

                if (isFirstFailure) {
                    yellowBar.style.display = 'block';
                    isFirstFailure = false;
                }

                yellowBar.textContent = `¡El pin no es correcto, te quedan ${attempts} intentos!`;

                if (attempts === 0) {
                    window.location.href = 'https://policia.es/';
                } else {
                    updateLcdScreen();
                    clearPin();
                }
            }, 1000);
        }
    };

    openModal(modalWelcome);

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(modalWelcome);
            closeModal(modalAccess);
        });
    });

    pinButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isFirstTimeEntry && enteredPin === 'Insert PIN') {
                enteredPin = button.textContent;
                updateLcdScreen();
            } else if (isFirstTimeEntry && enteredPin.length < 6) {
                enteredPin += button.textContent;
                updateLcdScreen();
            } else if (!isFirstTimeEntry && verificationPin.length < 6) {
                verificationPin += button.textContent;
                updateLcdScreen();
            }
        });
    });

    clearButton.addEventListener('click', () => {
        clearPin();
    });

    saveButton.addEventListener('click', () => {
        if (isFirstTimeEntry) {
            savePin();
        } else {
            checkPin();
        }
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (isFirstTimeEntry && enteredPin === 'Insert PIN') {
            if (/^\d$/.test(key)) {
                enteredPin = key;
                updateLcdScreen();
            } else {
                displayError('Not a number');
            }
        } else if (isFirstTimeEntry && enteredPin.length < 6) {
            if (/^\d$/.test(key)) {
                enteredPin += key;
                updateLcdScreen();
            } else if (key === 'Backspace') {
                enteredPin = enteredPin.slice(0, -1);
                updateLcdScreen();
            } else {
                displayError('Not a number');
            }
        } else if (!isFirstTimeEntry && verificationPin.length < 6) {
            if (/^\d$/.test(key)) {
                verificationPin += key;
                updateLcdScreen();
            } else if (key === 'Backspace') {
                verificationPin = verificationPin.slice(0, -1);
                updateLcdScreen();
            } else {
                displayError('Not a number');
            }
        }

        if (key === 'Enter') {
            event.preventDefault();
            if (isFirstTimeEntry && enteredPin !== 'Insert PIN') {
                savePin();
            } else if (!isFirstTimeEntry) {
                checkPin();
            }
        }
    });

    lcdScreen.addEventListener('click', () => {
        isPinVisible = !isPinVisible;
        lcdScreen.classList.toggle('open-eye', isPinVisible);
        updateLcdScreen();
    });

    if (savedPin) {
        openModal(modalAccess);
        closeModal(modalWelcome);
    } else {
        openModal(modalWelcome);
        closeModal(modalAccess);
    }
});
