document.addEventListener('DOMContentLoaded', function() {
    // Atualizar ano no footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Efeito de scroll no header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
        
        // Ativar animações quando as seções ficarem visíveis
        activateAnimations();
    });
    
    // Efeito de digitação dinâmica
    const typingText = document.getElementById('typing-text');
    const professions = [
        "Analista de Dados",
        "Especialista em RPA",
        "Gestora de Projetos",
        "Consultora em Transformação Digital"
    ];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            typingText.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = charIndex === 0 ? 200 : 100;
        }
        
        if (!isDeleting && charIndex === currentProfession.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }

    // Iniciar efeito de digitação
    setTimeout(type, 1000);
    
    // Controle das abas de skills
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover classe active de todos os botões e conteúdos
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            btn.classList.add('active');
            
            // Mostrar o conteúdo correspondente
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Animação dos números na seção Sobre
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (obj.classList.contains('number')) {
                    obj.textContent = end + (obj.getAttribute('data-suffix') || '');
                }
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animação das barras de progresso
    function animateProgressBars() {
        document.querySelectorAll('.progress').forEach(progress => {
            const width = progress.style.width;
            progress.style.width = '0';
            setTimeout(() => {
                progress.style.width = width;
            }, 100);
        });
    }

    // Ativar animações quando as seções ficarem visíveis
    function activateAnimations() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;
            
            // Se a seção estiver 30% visível na tela
            if (sectionTop < windowHeight * 0.7 && sectionTop > -sectionHeight * 0.3) {
                if (section.id === 'about') {
                    // Animar números
                    document.querySelectorAll('.number').forEach(num => {
                        const target = +num.getAttribute('data-count');
                        animateValue(num, 0, target, 2000);
                    });
                }
                
                if (section.id === 'skills') {
                    // Animar barras de progresso apenas uma vez
                    if (!section.classList.contains('animated')) {
                        animateProgressBars();
                        section.classList.add('animated');
                    }
                }
            }
        });
    }

    // Observador de interseção para ativar animações
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'about') {
                    document.querySelectorAll('.number').forEach(num => {
                        const target = +num.getAttribute('data-count');
                        animateValue(num, 0, target, 2000);
                    });
                }
                
                if (entry.target.id === 'skills' && !entry.target.classList.contains('animated')) {
                    animateProgressBars();
                    entry.target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.3 });

    // Observar as seções relevantes
    document.querySelectorAll('section').forEach(section => {
        if (section.id === 'about' || section.id === 'skills') {
            observer.observe(section);
        }
    });

    // Smooth scroll para links do menu
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.querySelector('.menu-toggle').classList.remove('active');
                }
            }
        });
    });

    // Formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Validação básica
            if (!formValues.name || !formValues.email || !formValues.message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Feedback visual
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simular envio assíncrono
            setTimeout(() => {
                console.log('Formulário enviado:', formValues);
                
                // Feedback ao usuário
                submitBtn.textContent = 'Mensagem Enviada!';
                setTimeout(() => {
                    submitBtn.textContent = 'Enviar Mensagem';
                    submitBtn.disabled = false;
                }, 2000);
                
                // Resetar formulário
                this.reset();
                
                // Mostrar mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Sua mensagem foi enviada com sucesso! Entrarei em contato em breve.</p>
                `;
                this.parentNode.insertBefore(successMessage, this.nextSibling);
                
                // Remover mensagem após 5 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }

    // Menu mobile (caso necessário)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            document.querySelector('.mobile-menu').classList.toggle('active');
        });
    }

    // Ativar animações na carga inicial
    activateAnimations();
});

// Animação dos números dos resultados
function animateResults() {
    const resultValues = document.querySelectorAll('.result-value');
    
    resultValues.forEach(value => {
        const target = value.textContent;
        value.textContent = '0';
        
        const animate = () => {
            const current = +value.textContent;
            const increment = target.toString().includes('→') ? 1 : target / 20;
            
            if (current < target) {
                value.textContent = Math.ceil(current + increment);
                setTimeout(animate, 50);
            } else {
                value.textContent = target;
            }
        };
        
        animate();
    });
}

// Ativar quando a seção for visível
const resultsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateResults();
            resultsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
    if (section.id === 'results' || section.id === 'experience') {
        resultsObserver.observe(section);
    }
});

// Controle das abas de skills
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover classe active de todos os botões e conteúdos
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        btn.classList.add('active');
        
        // Mostrar o conteúdo correspondente
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});