// CONFIGURACIÓN - IMPORTANTE: Reemplaza con tu URL de implementación de Google
const URL_GOOGLE = "https://script.google.com/macros/s/AKfycbzoakIRy8AXz1b3gVm0zrRQXJWl0F2oXwhM6qdMYBJm7Ms3vJsIaeTXMcqmlMOSXF_dCA/exec"; 
const CLAVE_ADMIN = "123425767.Ctes@26"; 

let numElegido = null;

document.addEventListener('DOMContentLoaded', () => {
    const grilla = document.getElementById('grilla');
    for (let i = 1; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        div.id = `num-${i}`;
        div.textContent = i.toString().padStart(2, '0');
        div.onclick = () => abrirRegistro(i);
        grilla.appendChild(div);
    }
    iniciarNieve();
    animarSanta();
    cargarVendidos(); // Consulta a Google al abrir la página
});

// Función para consultar a Google Sheets qué números ya están ocupados
async function cargarVendidos() {
    try {
        const res = await fetch(URL_GOOGLE);
        const ocupados = await res.json();
        
        ocupados.forEach(n => {
            marcarComoVendido(n);
        });
        
        actualizarContador(ocupados.length);
    } catch(e) { 
        console.error("Error cargando vendidos:", e);
        document.getElementById('contador-ventas').innerText = "Disponibilidad: 100 Números"; 
    }
}

// Función auxiliar para tachar el número
function marcarComoVendido(n) {
    const el = document.getElementById(`num-${n}`);
    if(el) {
        el.classList.add('vendido');
        el.onclick = null; // Deshabilita el clic
    }
}

function actualizarContador(cantidad) {
    document.getElementById('contador-ventas').innerText = `${cantidad}/100 Números vendidos`;
}

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

function mostrarTextoTerminos() {
    alert(
`Términos y Condiciones: Rifa Notebook Banghó Best Pro T5\n
1. OBJETO: Notebook Banghó i7 15" + Auriculares BT de Regalo.
2. VALOR: $15.000 por número.
3. VENTA TOTAL: El sorteo se realiza al vender los 100 números.
4. ENTREGA: Corrientes Capital o envío a cargo del organizador.`
    );
}

// ESTA ES LA FUNCIÓN QUE AHORA TACHA EL NÚMERO DE FORMA INMEDIATA
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

    if(!datos.Nombre || !datos.DNI || !datos.Celular) {
        return alert("Por favor, completa Nombre, DNI y Celular.");
    }

    // Bloqueamos el botón para evitar múltiples clics
    btn.disabled = true;
    btn.innerText = "PROCESANDO...";

    try {
        // 1. Enviamos a Google (con modo 'no-cors' para evitar errores de bloqueo)
        await fetch(URL_GOOGLE, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(datos) 
        });

        // 2. TACHADO INSTANTÁNEO LOCAL (Feedback para el usuario)
        marcarComoVendido(numElegido);
        
        alert(`¡Reserva exitosa del número ${numElegido}! Recuerda enviar el comprobante de pago por WhatsApp.`);
        
        cerrarModal();
        
        // 3. Recargamos después de 2 segundos para asegurar que Google registró todo
        setTimeout(() => {
            location.reload();
        }, 2000);

    } catch(e) { 
        alert("Hubo un error al conectar con el servidor. Intenta de nuevo."); 
        btn.disabled = false;
        btn.innerText = "RESERVAR AHORA";
    }
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    // Limpiamos el formulario
    document.getElementById('nombre').value = "";
    document.getElementById('dni').value = "";
    document.getElementById('celular').value = "";
    document.getElementById('direccion').value = "";
    document.getElementById('acepto-terminos').checked = false;
}

// Animaciones (Papá Noel y Nieve)
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
        f.innerHTML = "❄"; f.style.position = "absolute"; f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw"; f.style.top = "-20px";
        container.appendChild(f);
        f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100vh)' }], { duration: 5000 });
        setTimeout(() => f.remove(), 5000);
    }, 300);
}

function accesoAdmin() {
    if(prompt("Clave:") === CLAVE_ADMIN) alert("Acceso correcto. Los datos están en tu Google Sheet.");
}