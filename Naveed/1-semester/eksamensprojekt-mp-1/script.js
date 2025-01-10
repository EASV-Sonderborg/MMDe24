document.querySelectorAll('.pincode__digit').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        // Move to the next input if the current input has a value
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        // Handle backspace to move focus to the previous input
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

