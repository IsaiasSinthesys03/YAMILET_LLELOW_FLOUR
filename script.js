// El Jardín Cinemático - Script Principal
document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const inicioScreen = document.getElementById('inicio-screen');
    const menuScreen = document.getElementById('menu-screen');
    const florContainer = document.getElementById('flor-container');
    const centro = document.querySelector('.centro');
    const petalos = document.querySelectorAll('.petalo');
    const imagenMostradaFrente = document.getElementById('imagen-mostrada-frente');
    const textoMostradoFrente = document.getElementById('texto-mostrado-frente');
    const imagenMostradaDetras = document.getElementById('imagen-mostrada-detras');
    const textoMostradoDetras = document.getElementById('texto-mostrado-detras');
    const finalMensajeContainer = document.getElementById('final-mensaje-container');
    const galeriaContainer = document.getElementById('galeria-container');
    const petalosContainer = document.getElementById('petalos-container');

    // Datos de la galería - ORDEN CORRECTO: B1, B2, B3, B5, B4, B6
    const galeriaData = [
        {
            imagenSrc: "img/B1.jpg",
            texto: "En todos estos años juntos hemos hecho muchas cosas, y por la falta de fotos pues tenia algunas tuyas, espero no te moleste"
        },
        {
            imagenSrc: "img/B2.jpg",
            texto: "Tu me has ayudado en todo momento, has estado en mis peores momentos y yo he estado con tigo en los tuyos"
        },
        {
            imagenSrc: "img/B3.jpg",
            texto: "Yo conosco tus miedos y tu conoces los mios, tu conoces lo que me hace mas feliz y yo conosco lo que te encanta"
        },
        {
            imagenSrc: "img/B5.png",
            texto: "Nuestros miedos y el reencor nos llevan al exicto, a ti te llama la arquitectura y ami la programacion"
        },
        {
            imagenSrc: "img/B4.jpg",
            texto: "Hay dias en los que duermo temprano y cuando veo un mensaje tuyo que no respondi me siento culpable por no ayudarte en ese momento"
        },
        {
            imagenSrc: "img/B6.jpg",
            texto: "Espero que sigamos teniendo una amistad que dura hasta que el suicidio nos alcanze a los dos, yo solo espero nunca separarme de ti, aunque me odies"
        }
    ];

    // Variables de control
    let diapositivaActual = 0;
    let florAnimada = false;
    
    // Variables para el cubo 3D
    let isAnimating = false;
    let rotacionCubo = 0;
    
    console.log('🚀 INICIALIZACIÓN - diapositivaActual:', diapositivaActual);

    // Variables para controlar la lluvia CONSTANTE
    let intervaloPetalos = null;
    let petalosActivos = 0;
    const maxPetalosSimultaneos = 60; // Mucho más pétalos para lluvia abundante

    // Función para crear un pétalo individual
    function crearPetalo() {
        const container = document.getElementById('petalos-container');
        if (!container) return;

        const petalo = document.createElement('div');
        
        // 1. Asigna la clase base de animación
        petalo.classList.add('petalo-img');

        // 2. Elige un estilo de pétalo al azar (del 1 al 5)
        const estiloPetalo = Math.floor(Math.random() * 5) + 1;
        petalo.classList.add(`petalo-img-${estiloPetalo}`);

        // Posición inicial aleatoria en la parte superior
        petalo.style.top = '-10%';
        petalo.style.left = Math.random() * 100 + '%'; // Usar % para mejor distribución

        // Duración de la animación aleatoria
        const duracion = Math.random() * 7 + 8; // Entre 8 y 15 segundos
        petalo.style.animationDuration = duracion + 's';

        // Variación en la dirección de caída (algunos van a la izquierda, otros a la derecha)
        const direccion = Math.random() > 0.5 ? 1 : -1;
        const distanciaHorizontal = Math.random() * 50 + 25; // Entre 25vw y 75vw
        petalo.style.setProperty('--direccion-caida', `${direccion * distanciaHorizontal}vw`);

        // Tamaño aleatorio
        const tamano = Math.random() * 15 + 20; // Entre 20px y 35px
        petalo.style.width = tamano + 'px';
        petalo.style.height = tamano + 'px';

        container.appendChild(petalo);
        petalosActivos++;

        // Eliminar el pétalo cuando termine la animación
        setTimeout(() => {
            if (petalo.parentNode) {
                petalo.parentNode.removeChild(petalo);
                petalosActivos--;
            }
        }, duracion * 1000);
    }

    // Función para iniciar la lluvia CONSTANTE
    function iniciarLluviaContinua() {
        // Limpiar cualquier intervalo existente
        if (intervaloPetalos) {
            clearInterval(intervaloPetalos);
        }

        // Crear pétalos iniciales INMEDIATAMENTE sin retraso
        for (let i = 0; i < 30; i++) {
            crearPetalo(); // Sin setTimeout, se crean inmediatamente
        }

        // Continuar creando pétalos CONSTANTEMENTE
        intervaloPetalos = setInterval(() => {
            if (petalosActivos < maxPetalosSimultaneos) {
                crearPetalo();
            }
        }, 150); // Crear un nuevo pétalo cada 150ms para lluvia muy densa
    }

    // Función para crear lluvia de pétalos (ahora llama a la función continua)
    function crearLluviaDePetalos() {
        iniciarLluviaContinua();
    }

    // INICIA LA LLUVIA DE PÉTALOS INMEDIATAMENTE
    crearLluviaDePetalos();
    
    // Inicializar el cubo 3D
    gsap.set("#cubo", {
        rotationY: 0
    });

    // Configuración inicial de GSAP
    gsap.set([centro, ...petalos], {
        opacity: 0,
        scale: 0,
        transformOrigin: "100px 100px"
    });

    gsap.set([imagenMostradaFrente, textoMostradoFrente, imagenMostradaDetras, textoMostradoDetras], {
        opacity: 1
    });

    gsap.set(finalMensajeContainer, {
        opacity: 0,
        scale: 0
    });

    // Configuración inicial del sticker C4 - oculto por defecto
    gsap.set('.marco-decorativo', {
        opacity: 0,
        display: "none"
    });

    // Configuración inicial del sticker C8 - oculto por defecto
    gsap.set('.cara-frontal .marco-decorativo-c8', {
        opacity: 0,
        display: "none"
    });
    gsap.set('.cara-trasera .marco-decorativo-c8', {
        opacity: 0,
        display: "none"
    });

    // Configuración inicial del sticker C9 - oculto por defecto
    gsap.set('.cara-frontal .marco-decorativo-c9', {
        opacity: 0,
        display: "none"
    });
    gsap.set('.cara-trasera .marco-decorativo-c9', {
        opacity: 0,
        display: "none"
    });

    // Configuración inicial del sticker C10 - oculto por defecto
    gsap.set('.cara-frontal .marco-decorativo-c10', {
        opacity: 0,
        display: "none"
    });
    gsap.set('.cara-trasera .marco-decorativo-c10', {
        opacity: 0,
        display: "none"
    });

    // Configuración inicial del sticker C7 - oculto por defecto
    gsap.set('.cara-frontal .marco-decorativo-c7', {
        opacity: 0,
        display: "none"
    });
    gsap.set('.cara-trasera .marco-decorativo-c7', {
        opacity: 0,
        display: "none"
    });

    // Configuración inicial del sticker C3 - oculto por defecto
    gsap.set('.cara-frontal .marco-decorativo-c3', {
        opacity: 0,
        display: "none"
    });
    gsap.set('.cara-trasera .marco-decorativo-c3', {
        opacity: 0,
        display: "none"
    });

    // Función para animar la entrada de la flor
    function animarEntradaFlor() {
        const tl = gsap.timeline({
            onComplete: () => {
                florAnimada = true;
                florContainer.classList.add('flor-animada');
                // Después de 3 segundos, mostrar el menú
                setTimeout(() => {
                    mostrarMenu();
                }, 3000);
            }
        });

        // Animación del centro con efecto de pulso
        tl.to(centro, {
            duration: 1.2,
            opacity: 1,
            scale: 1.3,
            ease: "back.out(1.7)"
        })
        .to(centro, {
            duration: 0.8,
            scale: 1,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.4");

        // Animamos todos los pétalos con stagger, pero sin rotación para evitar problemas
        tl.to(petalos, {
            duration: 1.5,
            opacity: 1,
            scale: 1,
            ease: "elastic.out(1, 0.5)",
            transformOrigin: "100px 100px",
            stagger: {
                amount: 1.2,
                from: "center",
                ease: "power2.out"
            }
        }, "-=0.6");

        // Efecto de brillo adicional
        tl.to(florContainer, {
            duration: 0.5,
            filter: "drop-shadow(0 15px 50px rgba(255, 215, 0, 0.4))",
            ease: "power2.out"
        }, "-=0.3");
    }

    // Función para mostrar el menú
    function mostrarMenu() {
        const tl = gsap.timeline();

        // Desvanecer pantalla de inicio
        tl.to(inicioScreen, {
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            ease: "power2.inOut"
        })
        .set(inicioScreen, { display: "none" })
        .set(menuScreen, { display: "flex" })
        .from(menuScreen, {
            duration: 1.2,
            opacity: 0,
            scale: 1.1,
            ease: "power2.out"
        })
        .to(galeriaContainer, {
            duration: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.6");

        // La lluvia de pétalos ya está activa desde el inicio 

        // Cargar primera imagen en la cara frontal del cubo
        setTimeout(() => {
            const primeraImagen = galeriaData[0];
            console.log('🎬 MOSTRAR MENÚ - Cargando primera imagen');
            console.log('📊 diapositivaActual al cargar B1:', diapositivaActual);
            console.log('🖼️ Primera imagen:', primeraImagen);
            
            if (imagenMostradaFrente && textoMostradoFrente && primeraImagen) {
                imagenMostradaFrente.src = primeraImagen.imagenSrc;
                textoMostradoFrente.textContent = primeraImagen.texto;
                console.log('✅ B1 cargada en cara frontal:', primeraImagen.imagenSrc);
                
                // Mostrar sticker C4 para B1
                const stickerC4 = document.querySelector('.marco-decorativo');
                if (primeraImagen.imagenSrc === "img/B1.jpg") {
                    gsap.set(stickerC4, { opacity: 0.9, display: "block" });
                    console.log('🏷️ Sticker C4 mostrado para B1');
                }
            }
        }, 500);
    }

    // Función para mostrar una diapositiva específica - SOLUCIÓN DEFINITIVA
    function mostrarDiapositiva(index) {
        console.log(`🎯 mostrarDiapositiva(${index}) - Imagen: ${galeriaData[index]?.imagenSrc}`);
        console.log(`📊 Estado actual: diapositivaActual=${diapositivaActual}, rotacionCubo=${rotacionCubo}`);
        
        if (isAnimating || index >= galeriaData.length) {
            console.log(`❌ Bloqueado: isAnimating=${isAnimating}, index=${index}`);
            return;
        }
        
        isAnimating = true;
        const datosActuales = galeriaData[index];
        console.log(`🖼️ Mostrando: ${datosActuales.imagenSrc}`);

        // LÓGICA ULTRA SIMPLE: Mapeo manual de caras
        const caraFrontal = document.querySelector('.cara-frontal');
        const caraTrasera = document.querySelector('.cara-trasera');
        const stickerC4 = document.querySelector('.marco-decorativo');
        
        // MAPEO MANUAL DE CARAS - Puedes cambiar estas asignaciones
        let caraActiva;
        let necesitaRotacion = false;
        
        if (index === 0) {
            // B1 → Cara frontal (sin rotación)
            caraActiva = caraFrontal;
            console.log(`📍 B1 → cara-frontal (sin rotación)`);
        } else if (index === 1) {
            // B2 → Cara trasera (con rotación)
            caraActiva = caraTrasera;
            necesitaRotacion = true;
            console.log(`📍 B2 → cara-trasera (con rotación)`);
        } else if (index === 2) {
            // B3 → Cara frontal (sin rotación)
            caraActiva = caraFrontal;
            necesitaRotacion = true;
            console.log(`📍 B3 → cara-frontal (con rotación)`);
        } else if (index === 3) {
            // B5 → Cara trasera (con rotación)
            caraActiva = caraTrasera;
            necesitaRotacion = true;
            console.log(`📍 B5 → cara-trasera (con rotación)`);
        } else if (index === 4) {
            // B4 → Cara frontal (sin rotación)
            caraActiva = caraFrontal;
            necesitaRotacion = true;
            console.log(`📍 B4 → cara-frontal (sin rotación)`);
        } else if (index === 5) {
            // B6 → Cara trasera (con rotación)
            caraActiva = caraTrasera;
            necesitaRotacion = true;
            console.log(`📍 B6 → cara-trasera (con rotación)`);
        }
        
        // Cargar imagen en la cara correspondiente
        if (caraActiva) {
            caraActiva.querySelector('img').src = datosActuales.imagenSrc;
            caraActiva.querySelector('p').textContent = datosActuales.texto;
            console.log(`✅ Imagen cargada: ${datosActuales.imagenSrc}`);
        }

        // Controlar sticker C4 - solo para B1
        if (datosActuales.imagenSrc === "img/B1.jpg") {
            gsap.set(stickerC4, { opacity: 0.9, display: "block" });
        } else {
            gsap.set(stickerC4, { opacity: 0, display: "none" });
        }

        // Controlar sticker C8 - solo para B2 (se oculta inmediatamente)
        const stickerC8Frente = document.querySelector('.cara-frontal .marco-decorativo-c8');
        const stickerC8Trasera = document.querySelector('.cara-trasera .marco-decorativo-c8');
        console.log(`🏷️ Sticker C8 - Imagen actual: ${datosActuales.imagenSrc}`);
        
        // Ocultar sticker C8 inmediatamente
        gsap.set(stickerC8Frente, { opacity: 0, display: "none" });
        gsap.set(stickerC8Trasera, { opacity: 0, display: "none" });
        console.log(`❌ Sticker C8 oculto inicialmente para ${datosActuales.imagenSrc}`);

        // Controlar sticker C9 - solo para B3 (se oculta inmediatamente)
        const stickerC9Frente = document.querySelector('.cara-frontal .marco-decorativo-c9');
        const stickerC9Trasera = document.querySelector('.cara-trasera .marco-decorativo-c9');
        console.log(`🏷️ Sticker C9 - Imagen actual: ${datosActuales.imagenSrc}`);
        
        // Ocultar sticker C9 inmediatamente
        gsap.set(stickerC9Frente, { opacity: 0, display: "none" });
        gsap.set(stickerC9Trasera, { opacity: 0, display: "none" });
        console.log(`❌ Sticker C9 oculto inicialmente para ${datosActuales.imagenSrc}`);

        // Controlar sticker C10 - solo para B5 (se oculta inmediatamente)
        const stickerC10Frente = document.querySelector('.cara-frontal .marco-decorativo-c10');
        const stickerC10Trasera = document.querySelector('.cara-trasera .marco-decorativo-c10');
        console.log(`🏷️ Sticker C10 - Imagen actual: ${datosActuales.imagenSrc}`);
        console.log(`🔍 Sticker C10 Frente encontrado:`, stickerC10Frente);
        console.log(`🔍 Sticker C10 Trasera encontrado:`, stickerC10Trasera);
        
        // Ocultar sticker C10 inmediatamente
        if (stickerC10Frente && stickerC10Trasera) {
            gsap.set(stickerC10Frente, { opacity: 0, display: "none" });
            gsap.set(stickerC10Trasera, { opacity: 0, display: "none" });
            console.log(`❌ Sticker C10 oculto inicialmente para ${datosActuales.imagenSrc}`);
        } else {
            console.log(`⚠️ Sticker C10 no encontrado en el DOM`);
        }

        // Controlar sticker C7 - solo para B4 (se oculta inmediatamente)
        const stickerC7Frente = document.querySelector('.cara-frontal .marco-decorativo-c7');
        const stickerC7Trasera = document.querySelector('.cara-trasera .marco-decorativo-c7');
        console.log(`🏷️ Sticker C7 - Imagen actual: ${datosActuales.imagenSrc}`);
        console.log(`🔍 Sticker C7 Frente encontrado:`, stickerC7Frente);
        console.log(`🔍 Sticker C7 Trasera encontrado:`, stickerC7Trasera);
        
        // Ocultar sticker C7 inmediatamente
        if (stickerC7Frente && stickerC7Trasera) {
            gsap.set(stickerC7Frente, { opacity: 0, display: "none" });
            gsap.set(stickerC7Trasera, { opacity: 0, display: "none" });
            console.log(`❌ Sticker C7 oculto inicialmente para ${datosActuales.imagenSrc}`);
        } else {
            console.log(`⚠️ Sticker C7 no encontrado en el DOM`);
        }

        // Controlar sticker C3 - solo para B6 (se oculta inmediatamente)
        const stickerC3Frente = document.querySelector('.cara-frontal .marco-decorativo-c3');
        const stickerC3Trasera = document.querySelector('.cara-trasera .marco-decorativo-c3');
        console.log(`🏷️ Sticker C3 - Imagen actual: ${datosActuales.imagenSrc}`);
        console.log(`🔍 Sticker C3 Frente encontrado:`, stickerC3Frente);
        console.log(`🔍 Sticker C3 Trasera encontrado:`, stickerC3Trasera);
        
        // Ocultar sticker C3 inmediatamente
        if (stickerC3Frente && stickerC3Trasera) {
            gsap.set(stickerC3Frente, { opacity: 0, display: "none" });
            gsap.set(stickerC3Trasera, { opacity: 0, display: "none" });
            console.log(`❌ Sticker C3 oculto inicialmente para ${datosActuales.imagenSrc}`);
        } else {
            console.log(`⚠️ Sticker C3 no encontrado en el DOM`);
        }

        // Rotar cubo solo si es necesario
        if (necesitaRotacion) {
            rotacionCubo -= 180;
            console.log(`🔄 Rotando cubo a: ${rotacionCubo} grados`);
            
            gsap.to("#cubo", {
                rotationY: rotacionCubo,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    console.log(`✅ Cubo rotado`);
                    
                    // Mostrar sticker C8 después de la rotación si es B2
                    if (datosActuales.imagenSrc === "img/B2.jpg") {
                        gsap.set(stickerC8Frente, { opacity: 0.9, display: "block" });
                        gsap.set(stickerC8Trasera, { opacity: 0.9, display: "block" });
                        console.log(`✅ Sticker C8 mostrado DESPUÉS de la rotación para B2`);
                    }
                    
                    // Mostrar sticker C9 después de la rotación si es B3
                    if (datosActuales.imagenSrc === "img/B3.jpg") {
                        gsap.set(stickerC9Frente, { opacity: 0.9, display: "block" });
                        gsap.set(stickerC9Trasera, { opacity: 0.9, display: "block" });
                        console.log(`✅ Sticker C9 mostrado DESPUÉS de la rotación para B3`);
                    }
                    
                    // Mostrar sticker C10 después de la rotación si es B5
                    console.log(`🔍 Verificando C10 - Imagen actual: ${datosActuales.imagenSrc}`);
                    if (datosActuales.imagenSrc === "img/B5.jpg" || datosActuales.imagenSrc === "img/B5.png") {
                        console.log(`🎯 Condición C10 cumplida para: ${datosActuales.imagenSrc}`);
                        if (stickerC10Frente && stickerC10Trasera) {
                            gsap.set(stickerC10Frente, { opacity: 0.9, display: "block" });
                            gsap.set(stickerC10Trasera, { opacity: 0.9, display: "block" });
                            console.log(`✅ Sticker C10 mostrado DESPUÉS de la rotación para B5`);
                        } else {
                            console.log(`⚠️ No se puede mostrar C10 - elementos no encontrados`);
                        }
                    } else {
                        console.log(`❌ Condición C10 NO cumplida para: ${datosActuales.imagenSrc}`);
                    }
                    
                    // Mostrar sticker C7 después de la rotación si es B4
                    console.log(`🔍 Verificando C7 - Imagen actual: ${datosActuales.imagenSrc}`);
                    if (datosActuales.imagenSrc === "img/B4.jpg" || datosActuales.imagenSrc === "img/B4.png") {
                        console.log(`🎯 Condición C7 cumplida para: ${datosActuales.imagenSrc}`);
                        if (stickerC7Frente && stickerC7Trasera) {
                            gsap.set(stickerC7Frente, { opacity: 0.9, display: "block" });
                            gsap.set(stickerC7Trasera, { opacity: 0.9, display: "block" });
                            console.log(`✅ Sticker C7 mostrado DESPUÉS de la rotación para B4`);
                        } else {
                            console.log(`⚠️ No se puede mostrar C7 - elementos no encontrados`);
                        }
                    } else {
                        console.log(`❌ Condición C7 NO cumplida para: ${datosActuales.imagenSrc}`);
                    }
                    
                    // Mostrar sticker C3 después de la rotación si es B6
                    console.log(`🔍 Verificando C3 - Imagen actual: ${datosActuales.imagenSrc}`);
                    if (datosActuales.imagenSrc === "img/B6.jpg" || datosActuales.imagenSrc === "img/B6.png") {
                        console.log(`🎯 Condición C3 cumplida para: ${datosActuales.imagenSrc}`);
                        if (stickerC3Frente && stickerC3Trasera) {
                            gsap.set(stickerC3Frente, { opacity: 0.9, display: "block" });
                            gsap.set(stickerC3Trasera, { opacity: 0.9, display: "block" });
                            console.log(`✅ Sticker C3 mostrado DESPUÉS de la rotación para B6`);
                        } else {
                            console.log(`⚠️ No se puede mostrar C3 - elementos no encontrados`);
                        }
                    } else {
                        console.log(`❌ Condición C3 NO cumplida para: ${datosActuales.imagenSrc}`);
                    }
                    
                    isAnimating = false;
                }
            });
        } else {
            console.log(`⏭️ No rotación necesaria`);
            
            // Mostrar sticker C8 inmediatamente si es B2 y no hay rotación
            if (datosActuales.imagenSrc === "img/B2.jpg") {
                gsap.set(stickerC8Frente, { opacity: 0.9, display: "block" });
                gsap.set(stickerC8Trasera, { opacity: 0.9, display: "block" });
                console.log(`✅ Sticker C8 mostrado INMEDIATAMENTE para B2 (sin rotación)`);
            }
            
            // Mostrar sticker C9 inmediatamente si es B3 y no hay rotación
            if (datosActuales.imagenSrc === "img/B3.jpg") {
                gsap.set(stickerC9Frente, { opacity: 0.9, display: "block" });
                gsap.set(stickerC9Trasera, { opacity: 0.9, display: "block" });
                console.log(`✅ Sticker C9 mostrado INMEDIATAMENTE para B3 (sin rotación)`);
            }
            
            // Mostrar sticker C10 inmediatamente si es B5 y no hay rotación
            console.log(`🔍 Verificando C10 (sin rotación) - Imagen actual: ${datosActuales.imagenSrc}`);
            if (datosActuales.imagenSrc === "img/B5.jpg" || datosActuales.imagenSrc === "img/B5.png") {
                console.log(`🎯 Condición C10 cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
                if (stickerC10Frente && stickerC10Trasera) {
                    gsap.set(stickerC10Frente, { opacity: 0.9, display: "block" });
                    gsap.set(stickerC10Trasera, { opacity: 0.9, display: "block" });
                    console.log(`✅ Sticker C10 mostrado INMEDIATAMENTE para B5 (sin rotación)`);
                } else {
                    console.log(`⚠️ No se puede mostrar C10 - elementos no encontrados (sin rotación)`);
                }
            } else {
                console.log(`❌ Condición C10 NO cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
            }
            
            // Mostrar sticker C7 inmediatamente si es B4 y no hay rotación
            console.log(`🔍 Verificando C7 (sin rotación) - Imagen actual: ${datosActuales.imagenSrc}`);
            if (datosActuales.imagenSrc === "img/B4.jpg" || datosActuales.imagenSrc === "img/B4.png") {
                console.log(`🎯 Condición C7 cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
                if (stickerC7Frente && stickerC7Trasera) {
                    gsap.set(stickerC7Frente, { opacity: 0.9, display: "block" });
                    gsap.set(stickerC7Trasera, { opacity: 0.9, display: "block" });
                    console.log(`✅ Sticker C7 mostrado INMEDIATAMENTE para B4 (sin rotación)`);
                } else {
                    console.log(`⚠️ No se puede mostrar C7 - elementos no encontrados (sin rotación)`);
                }
            } else {
                console.log(`❌ Condición C7 NO cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
            }
            
            // Mostrar sticker C3 inmediatamente si es B6 y no hay rotación
            console.log(`🔍 Verificando C3 (sin rotación) - Imagen actual: ${datosActuales.imagenSrc}`);
            if (datosActuales.imagenSrc === "img/B6.jpg" || datosActuales.imagenSrc === "img/B6.png") {
                console.log(`🎯 Condición C3 cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
                if (stickerC3Frente && stickerC3Trasera) {
                    gsap.set(stickerC3Frente, { opacity: 0.9, display: "block" });
                    gsap.set(stickerC3Trasera, { opacity: 0.9, display: "block" });
                    console.log(`✅ Sticker C3 mostrado INMEDIATAMENTE para B6 (sin rotación)`);
                } else {
                    console.log(`⚠️ No se puede mostrar C3 - elementos no encontrados (sin rotación)`);
                }
            } else {
                console.log(`❌ Condición C3 NO cumplida (sin rotación) para: ${datosActuales.imagenSrc}`);
            }
            
            isAnimating = false;
        }
    }

    // Función para mostrar el mensaje final
    function mostrarFinal() {
        const tl = gsap.timeline();

        // Ocultar galería
        tl.to(galeriaContainer, {
            duration: 1,
            opacity: 0,
            y: -50,
            scale: 0.9,
            ease: "power2.in"
        })
        .set(galeriaContainer, { display: "none" });

        // Mostrar mensaje final con efecto de revelado
        tl.set(finalMensajeContainer, { display: "block" })
        .fromTo(finalMensajeContainer, 
            {
                opacity: 0,
                scale: 0.5,
                y: 50
            },
            {
                duration: 1.2,
                opacity: 1,
                scale: 1,
                y: 0,
                ease: "back.out(1.7)"
            }
        );

        // Animación de las letras del título
        const titulo = finalMensajeContainer.querySelector('h2');
        const texto = titulo.textContent;
        titulo.textContent = '';
        
        tl.call(() => {
            let i = 0;
            const intervalo = setInterval(() => {
                titulo.textContent += texto[i];
                i++;
                if (i >= texto.length) {
                    clearInterval(intervalo);
                    // Mostrar sticker C2 después de que terminen las letras
                    setTimeout(() => {
                        const stickerC2 = document.querySelector('.sticker-c2-final');
                        if (stickerC2) {
                            gsap.to(stickerC2, {
                                opacity: 1,
                                duration: 1.5,
                                ease: "power2.out"
                            });
                        }
                    }, 500); // Pequeño retraso después de las letras
                }
            }, 100);
        });

    }

    // Función para reiniciar la experiencia
    function reiniciarExperiencia() {
        const tl = gsap.timeline();

        // Ocultar sticker C2 si está visible
        const stickerC2 = document.querySelector('.sticker-c2-final');
        if (stickerC2) {
            gsap.set(stickerC2, { opacity: 0 });
        }

        // Ocultar elementos del menú
        tl.to(finalMensajeContainer, {
            duration: 0.6,
            opacity: 0,
            scale: 0.8,
            ease: "power2.in"
        })
        .set(finalMensajeContainer, { display: "none" })
        .set(galeriaContainer, { display: "flex" });

        // Ocultar menú
        tl.to(menuScreen, {
            duration: 1,
            opacity: 0,
            scale: 1.1,
            ease: "power2.in"
        })
        .set(menuScreen, { display: "none" })
        .set(inicioScreen, { display: "flex" });

        // Mostrar pantalla de inicio
        tl.to(inicioScreen, {
            duration: 1.2,
            opacity: 1,
            scale: 1,
            ease: "power2.out"
        });

        // Resetear variables
        diapositivaActual = 0;
        florAnimada = false;
        florContainer.classList.remove('flor-animada');
        
        // Resetear variables del cubo 3D
        isAnimating = false;
        rotacionCubo = 0;

        // Resetear elementos
        tl.set([centro, ...petalos], {
            opacity: 0,
            scale: 0
        })
        .set([imagenMostradaFrente, textoMostradoFrente, imagenMostradaDetras, textoMostradoDetras], {
            opacity: 0,
            clearProps: "transform"
        })
        .set("#cubo", {
            rotationY: 0
        });

        // Reiniciar animación de la flor
        tl.call(() => {
            setTimeout(() => {
                animarEntradaFlor();
            }, 500);
        });
    }

    // Event Listeners - VERSIÓN CON LOGS DETALLADOS
    menuScreen.addEventListener('click', function() {
        console.log(`🖱️ CLIC DETECTADO`);
        console.log(`📊 Estado actual: diapositivaActual=${diapositivaActual}, galeriaData.length=${galeriaData.length}`);
        console.log(`🖼️ Imagen actual: ${galeriaData[diapositivaActual]?.imagenSrc}`);
        
        // Si no hemos llegado al final, mostrar la siguiente imagen
        if (diapositivaActual < galeriaData.length - 1) {
            const siguienteIndex = diapositivaActual + 1;
            console.log(`➡️ AVANZANDO a índice ${siguienteIndex}`);
            console.log(`🖼️ Siguiente imagen: ${galeriaData[siguienteIndex].imagenSrc}`);
            console.log(`📝 Texto: ${galeriaData[siguienteIndex].texto}`);
            
            // Llamar a mostrarDiapositiva con el siguiente índice
            mostrarDiapositiva(siguienteIndex);
            
            // Actualizar diapositivaActual DESPUÉS de la llamada
            diapositivaActual = siguienteIndex;
            console.log(`📊 diapositivaActual actualizado a: ${diapositivaActual}`);
        } else {
            // Si llegamos al final, mostrar mensaje final
            console.log(`🏁 LLEGAMOS AL FINAL - Mostrando mensaje final`);
            mostrarFinal();
        }
    });


    // Efectos adicionales de interacción para las imágenes del cubo
    [imagenMostradaFrente, imagenMostradaDetras].forEach(imagen => {
        if (imagen) {
            imagen.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: "power2.out"
                });
            });

            imagen.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        }
    });

    // Animación de las flores decorativas
    gsap.to(".flor-esquina", {
        duration: 2,
        rotation: 360,
        ease: "none",
        repeat: -1,
        stagger: 0.5
    });

    // Efecto de parallax sutil en las flores decorativas
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        gsap.to(".flor-esquina", {
            duration: 0.5,
            x: x * 20,
            y: y * 20,
            ease: "power2.out"
        });
    });

    // Inicializar la experiencia
    setTimeout(() => {
        animarEntradaFlor();
    }, 1000);

    // Efecto de carga inicial (solo para la pantalla de inicio)
    gsap.from("#inicio-screen", {
        duration: 1,
        opacity: 0,
        ease: "power2.out"
    });
});