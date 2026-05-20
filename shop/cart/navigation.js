let steps = [];
let progressBar = null;

export function initNavigation() {
    steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ].filter(Boolean);

    progressBar = document.getElementById('checkout-progress-bar');
    window.showStep = showStep;
}

export function showStep(stepNumber) {
    steps.forEach((step) => step?.classList.add('hidden'));

    const currentStep = steps[stepNumber - 1];

    if (currentStep) {
        currentStep.classList.remove('hidden');
        currentStep.scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    updateProgress(stepNumber);
}

export function updateProgress(stepNumber) {
    if (!progressBar || !steps.length) return;

    progressBar.style.width = `${(stepNumber / steps.length) * 100}%`;
}