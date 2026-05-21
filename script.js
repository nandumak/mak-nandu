document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initParticles();
  initTilt();
  initSkillsObserver();
  initProjectFilters();
  initMobileMenu();
  initContactConsole();
  initScrollSpy();
});

/* ==========================================
   1. Diagnostics Loader Animation
   ========================================== */
function initLoader() {
  const terminal = document.getElementById('loader-terminal');
  const progressBar = document.getElementById('loader-progress');
  const loaderWrapper = document.getElementById('loader-wrapper');
  
  if (!terminal || !progressBar || !loaderWrapper) return;

  const logs = [
    'MAK_SYS_INIT :: LOADING CORE MODULES...',
    'RESOLVING DOMAIN: nanda_kishor_k.dev',
    'GEOLOCATING SITE OWNER... Kasargod, KL, IN [OK]',
    'LINKING INSTITUTION HUB... Vimal Jyothi Engineering College [OK]',
    'IMPORTING TECH STACK DATASETS...',
    '  - Python/Algorithm Logic: active',
    '  - React/Next.js Core: active',
    '  - SQL & DB Orchestration: active',
    'COMPILING 3D TILT ENGINE & PARTICLES...',
    'ESTABLISHING GLOW MASKING AND NEON MATRICES...',
    'SYS_STATUS: READY FOR INTERACTION.'
  ];

  let currentLogIndex = 0;
  let progress = 0;

  // Add line to terminal simulator
  function printLog() {
    if (currentLogIndex < logs.length) {
      const line = document.createElement('div');
      line.className = 'loader-line';
      line.innerHTML = `<span style="color: var(--neon-blue); font-weight:bold;">></span> ${logs[currentLogIndex]}`;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
      currentLogIndex++;
      
      // Variable speed for realism
      setTimeout(printLog, 150 + Math.random() * 200);
    }
  }

  // Update progress bar
  const progressInterval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // Short delay before removing loader
      setTimeout(() => {
        loaderWrapper.classList.add('fade-out');
        // Enable scroll once loader is gone
        document.body.style.overflowY = 'auto';
      }, 500);
    }
    progressBar.style.width = `${progress}%`;
  }, 100);

  printLog();
}

/* ==========================================
   2. Custom Cursor with Glow Tracker
   ========================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  const mouseBg = document.getElementById('mouse-gradient-bg');
  
  if (!cursor || !cursorGlow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core dot immediately follows
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    // Static spotlight tracking
    if (mouseBg) {
      mouseBg.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 240, 255, 0.08), rgba(189, 0, 255, 0.04) 50%, transparent 80%)`;
    }
  });

  // Smooth lagging glow follow using LERP
  function updateGlowPosition() {
    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    
    // 0.15 interpolation factor gives a nice cinematic lag
    currentX += dx * 0.15;
    currentY += dy * 0.15;
    
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    
    requestAnimationFrame(updateGlowPosition);
  }
  updateGlowPosition();

  // Add Hover effects on interactive elements
  const hoverables = document.querySelectorAll('a, button, .glass-card, .filter-btn, .floating-tech-icon, input, textarea');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.backgroundColor = 'var(--neon-cyan)';
      cursorGlow.classList.add('hovered');
    });
    
    item.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = '#fff';
      cursorGlow.classList.remove('hovered');
    });
  });
}

/* ==========================================
   3. Interactive Canvas Particle Background
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = { x: null, y: null, radius: 130 };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Adjust canvas bounds
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticlesArray();
  }
  window.addEventListener('resize', resizeCanvas);
  
  // Set initial dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle Blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    
    // Draw single node
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    // Update vector and bounce borders
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }
      
      this.x += this.directionX;
      this.y += this.directionY;
      
      this.draw();
    }
  }

  // Populate particles
  function initParticlesArray() {
    particlesArray = [];
    // Control density relative to page size
    const numberOfParticles = Math.min((canvas.width * canvas.height) / 11000, 100);
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.6) - 0.3;
      let directionY = (Math.random() * 0.6) - 0.3;
      // Blue, Purple, Cyan color shades
      const colors = ['rgba(0, 240, 255, 0.25)', 'rgba(189, 0, 255, 0.25)', 'rgba(0, 255, 209, 0.25)'];
      let color = colors[Math.floor(Math.random() * colors.length)];
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  // Draw lines connecting nearby nodes
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
          + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        if (distance < (canvas.width / 8) * (canvas.height / 8)) {
          opacityValue = 1 - (distance / 16000);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue * 0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
      
      // Connect to mouse pointer
      if (mouse.x !== null && mouse.y !== null) {
        let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
          + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
        
        if (mouseDistance < mouse.radius * mouse.radius) {
          opacityValue = 1 - (mouseDistance / (mouse.radius * mouse.radius));
          ctx.strokeStyle = `rgba(0, 255, 209, ${opacityValue * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  initParticlesArray();
  animate();
}

/* ==========================================
   4. 3D Tilt Hover Effect for Glass Cards
   ========================================== */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x relative to card
      const y = e.clientY - rect.top;  // mouse y relative to card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Dynamic angles (intensity controlled by dividing factor)
      const rotateX = (centerY - y) / 15;
      const rotateY = (x - centerX) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================
   5. Skills progress bars anim on Intersection
   ========================================== */
function initSkillsObserver() {
  const skillSection = document.getElementById('skills');
  const skillPcts = document.querySelectorAll('.skill-pct');
  const progressFills = document.querySelectorAll('.skill-progress-fill');
  
  if (!skillSection || progressFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFills.forEach((fill, index) => {
          const pct = skillPcts[index].getAttribute('data-pct');
          fill.style.width = `${pct}%`;
        });
        // Disconnect after animating once
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillSection);
}

/* ==========================================
   6. Projects Categorized Filter Controls
   ========================================== */
function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      projects.forEach(project => {
        const category = project.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          project.style.display = 'flex';
          // Smooth fade in
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
          }, 50);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.95)';
          // Wait for scale transitions before removing display
          setTimeout(() => {
            project.style.display = 'none';
          }, 350);
        }
      });
    });
  });
}

/* ==========================================
   7. Mobile Hamburger Menu Toggle
   ========================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-links');
  
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Close when links are clicked
  const links = document.querySelectorAll('.nav-link a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

/* ==========================================
   8. Contact form terminal console log simulator
   ========================================== */
function initContactConsole() {
  const form = document.getElementById('cyber-contact-form');
  const consolePanel = document.getElementById('form-feedback-console');
  
  if (!form || !consolePanel) return;

  const textSpan = consolePanel.querySelector('span');

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const label = input.nextElementSibling ? input.nextElementSibling.innerText : 'Field';
      textSpan.innerText = `SYS: Editing [${label}] input buffer...`;
    });
    
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        textSpan.innerText = `SYS: Buffer loaded for [${input.id.replace('form-', '')}].`;
      } else {
        textSpan.innerText = 'System status: Awaiting instruction inputs...';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    textSpan.innerText = 'SYS: Resolving secure mail socket...';
    
    // Simulate terminal compilation log
    setTimeout(() => {
      textSpan.innerText = 'SYS: Packaging communication payload...';
      setTimeout(() => {
        textSpan.innerText = 'SYS: Transmitting packets to nandakishorkmak@gmail.com...';
        setTimeout(() => {
          textSpan.innerText = 'SYS_SUCCESS: Transmission completed! [Ref: 200_OK]';
          // Clean inputs
          form.reset();
        }, 1500);
      }, 1000);
    }, 1000);
  });
}

/* ==========================================
   9. Scroll Navigation Spy & Header Resizer
   ========================================== */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header resizing
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link detection
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.querySelector('a').getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  });
}
