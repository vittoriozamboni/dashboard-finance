export function getSavedState() {
    if (Storage) {
        const savedState = localStorage.getItem('FINANCE__STATE');
        if (savedState) {
            try {
                return JSON.parse(savedState);
            } catch(error) {
                console.error('Impossible to load finance state from localStorage:', e);
            }
        }
    }
    return {};
}

export function saveState(state) {
    if (Storage) {
        const { selectedPeriod } = state;

        localStorage.setItem('FINANCE__STATE', JSON.stringify({
            selectedPeriod,
        }));
    }
}