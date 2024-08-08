document.addEventListener('DOMContentLoaded', () => {
    showSection('customers');

    document.addEventListener('scroll', () => {
        const customersSection = document.getElementById('safety-cust-part');
        const sherYdrSection = document.getElementById('safety-sherydr-part');
        const customersToggle = document.getElementById('customersToggle');
        const sherYdrToggle = document.getElementById('sherydrToggle');

        if (isInViewport(customersSection)) {
            customersToggle.classList.add('active');
            sherYdrToggle.classList.remove('active');
        } else if (isInViewport(sherYdrSection)) {
            customersToggle.classList.remove('active');
            sherYdrToggle.classList.add('active');
        }
    });
});

function showSection(section) {
    const customersSection = document.getElementById('safety-cust-part');
    const sherYdrSection = document.getElementById('safety-sherydr-part');
    const customersToggle = document.getElementById('customersToggle');
    const sherYdrToggle = document.getElementById('sherydrToggle');

    if (section === 'customers') {
        customersSection.classList.add('active-section');
        sherYdrSection.classList.remove('active-section');
        customersToggle.classList.add('active');
        sherYdrToggle.classList.remove('active');
    } else if (section === 'sherydr') {
        customersSection.classList.remove('active-section');
        sherYdrSection.classList.add('active-section');
        customersToggle.classList.remove('active');
        sherYdrToggle.classList.add('active');
    }
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
