// 1. CONFIGURACIÓN INICIAL
// IMPORTANTE: Reemplaza esta URL con la de tu "Nueva Implementación" de Google
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbzoakIRy8AXz1b3gVm0zrRQXJWl0F2oXwhM6qdMYBJm7Ms3vJsIaeTXMcqmlMOSXF_dCA/execU_URL_DE_APPS_SCRIPT_AQUI"; 
const CLAVE_ADMIN = "25767.Ctes@26"; 

let numElegido = null;

// 2. INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    const grilla = document.getElementById('grilla');
    // Generamos los 100 números
    for (let i = 1; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        div.id = `num-${i}`;
        div.textContent = i.toString().padStart(2, '0');
        div.onclick = () => abrirRegistro(i);
        grilla.appendChild(div);
    }
    // Iniciamos efectos visuales
    iniciarNieve();
    animarSanta();
    // Consultamos a Google por los números ya vendidos
    cargarVendidos();
});

// 3. FUNCIÓN PARA LEER DATOS DE GOOGLE (doGet)
async function cargarVendidos() {
    try {
        const res = await fetch(URL_GOOGLE);
        const ocupados = await res.json();
        
        // Marcamos cada número ocupado en la grilla
        ocupados.forEach(n => {
            const el = document.getElementById(`num-${n}`);
            if(el) {
                el.classList.add('vendido');
                el.onclick = null; // Deshabilita el click en vendidos
            }
        });
        
        document.getElementById('contador-ventas').innerText = `${ocupados.length}/100 Números vendidos`;
    } catch(e) { 
        console.error("Error al cargar vendidos:", e);
        document.getElementById('contador-ventas').innerText = "Disponibilidad: 100 Números"; 
    }
}

// 4. LÓGICA DEL MODAL DE REGISTRO
function abrirRegistro(n) {
    const audio = document.getElementById('sonido-campana');
    audio.currentTime = 0; 
    audio.play();

    numElegido = n;
    document.getElementById('txtNumeroSeleccionado').innerText = `NÚMERO ELEGIDO: ${n}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function validarCheck() {
    const check = document.getElementById('acepto-terminos');
    document.getElementById('btn-confirmar-final').disabled = !check.checked;
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    // Limpiamos formulario
    document.querySelectorAll('#modal input').forEach(i => {
        if(i.type === 'checkbox') i.checked = false;
        else i.value = "";
    });
    document.getElementById('btn-confirmar-final').disabled = true;
}

// 5. FUNCIÓN CRÍTICA: ENVIAR DATOS A GOOGLE (doPost)
async function confirmarCompra() {
    const btn = document.getElementById('btn-confirmar-final');
    const datos = {
        Numero: numElegido,
        Nombre: document.getElementById('nombre').value,
        DNI: document.getElementById('dni').value,
        Celular: document.getElementById('celular').value,
        Direccion: document.getElementById('direccion').value,
        Fecha: new Date().toLocaleString()
    };

    // Validación simple
    if(!datos.Nombre || !datos.DNI || !datos.Celular) {
        alert("Por favor completa Nombre, DNI y Celular.");
        return;
    }

    // Feedback visual inmediato
    btn.disabled = true;
    btn.innerText = "PROCESANDO...";

    try {
        // Enviamos los datos usando 'no-cors' para evitar bloqueos de navegador
        await fetch(URL_GOOGLE, { 
            method: 'POST', 
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos) 
        });

        // TACHADO VISUAL INSTANTÁNEO (Para que el usuario vea que funcionó)
        const el = document.getElementById(`num-${numElegido}`);
        if(el) {
            el.classList.add('vendido');
            el.onclick = null;
        }

        alert(`¡Reserva exitosa del número ${numElegido}! Por favor, envía el comprobante de pago por WhatsApp.`);
        cerrarModal();

        // Recargamos en 2 segundos para sincronizar con la nube
        setTimeout(() => { location.reload(); }, 2000);

    } catch(e) { 
        console.error("Error en el envío:", e);
        alert("Hubo un problema de conexión, pero intentaremos registrar tu número. Si no ves el cambio, contáctanos.");
        cerrarModal();
        setTimeout(() => { location.reload(); }, 2000);
    }
}

// 6. ANIMACIONES Y EFECTOS
function animarSanta() {
    const santa = document.getElementById('papa-noel');
    let i = 0;
    setInterval(() => {
        const nums = document.querySelectorAll('.numero:not(.vendido)');
        if(nums.length > 0) {
            const target = nums[i % nums.length];
            const rect = target.getBoundingClientRect();
            const wrapper = document.querySelector('.grilla-wrapper').getBoundingClientRect();
            santa.style.left = (rect.left - wrapper.left) + "px";
            santa.style.top = (rect.top - wrapper.top - 25) + "px";
            i++;
        }
    }, 1200);
}

function iniciarNieve() {
    const container = document.getElementById('snow');
    setInterval(() => {
        const f = document.createElement('div');
        f.innerHTML = "❄";
        f.style.position = "absolute";
        f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-20px";
        f.style.fontSize = (Math.random() * 10 + 10) + "px";
        container.appendChild(f);
        f.animate([
            { transform: 'translateY(0) rotate(0deg)' }, 
            { transform: 'translateY(100vh) rotate(360deg)' }
        ], { duration: 5000 + Math.random() * 3000 });
        setTimeout(() => f.remove(), 8000);
    }, 300);
}

function mostrarTextoTerminos() {
    alert(
`Términos y Condiciones: Rifa Notebook Banghó Best Pro T5
i7 8gb RAM 480GB SSD

1. OBJETO: Sorteo de Notebook Banghó i7 + Auriculares BT.
2. VALOR: $15.000 por número.
3. CONDICIÓN: El sorteo se realiza al vender los 100 números.
4. SORTEO: Vivo por App Sorteos (se avisará 48hs antes).
5. ENTREGA: Corrientes Capital (interior envío a cargo de organizador).`
    );
}

function accesoAdmin() {
    if(prompt("Clave de Administrador:") === CLAVE_ADMIN) {
        alert("Acceso concedido. Revisa tu Google Sheet para gestionar los pagos.");
    }
}