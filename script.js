document.addEventListener('DOMContentLoaded', function () {

    /**
     * Funcionalidade da Navegação Mobile (Menu Hambúrguer)
     */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            const isExpanded = mainNav.classList.contains('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
    }


    /**
     * Funcionalidade do Acordeão (FAQ)
     */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerPanel = item.querySelector('.faq-answer');

        if (questionButton && answerPanel) {
            questionButton.addEventListener('click', () => {
                const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

                // Fecha todos os outros itens antes de abrir o atual (opcional, mas bom para UX)
                // faqItems.forEach(otherItem => {
                //     otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                //     otherItem.querySelector('.faq-answer').style.maxHeight = null;
                // });

                if (isExpanded) {
                    questionButton.setAttribute('aria-expanded', 'false');
                    answerPanel.style.maxHeight = null;
                } else {
                    questionButton.setAttribute('aria-expanded', 'true');
                    answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
                }
            });
        }
    });

});