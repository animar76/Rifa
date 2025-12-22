// 1. CONFIGURACIÓN (Verifica que estos datos sean exactos)
const SUPABASE_URL = "https://ssqgqkvttrwipvhltvxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcWdxa3Z0dHJ3aXB2aGx0dnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNTE0OTAsImV4cCI6MjA4MTkyNzQ5MH0.IdpquKkTIWf-4eTcskCKVCWQdpgPImJmJhcG8ZXDwro";
const CLAVE_ADMIN = "25767.Ctes@26"

let numElegido = null;

// 2. INICIO: Generar la grilla siempre, pase lo que pase con la base de datos
document.addEventListener('DOMContentLoaded', () => {
    const grilla = document.getElementById('grilla');
    
    // Limpiamos la grilla por seguridad antes de generar
    grilla.innerHTML = "";

    for (let i = 1; i <= 100; i++) {
        const div = document.createElement('div');
        div.className = 'numero';
        // IMPORTANTE: El ID será solo el número (ej: num-1) para coincidir con la BD
        div.id = `num-${i}`; 
        div.textContent = i.toString().padStart(2, '0'); // Visualmente se ve 01, 02...
        div.onclick = () => abrirRegistro(i);
        grilla.appendChild(div);
    }

    // Iniciamos efectos secundarios
    iniciarNieve();
    animarSanta();
    
    // Intentamos cargar los vendidos
    cargarVendidos();
});

// 3. LEER VENDIDOS (Con manejo de errores para que no bloquee la grilla)
async function cargarVendidos() {
    const statusText = document.getElementById('contador-ventas');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rifa?select=numero`, {
            method: 'GET',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error en respuesta");

        const datos = await response.json();
        
        datos.forEach(item => {
            // Buscamos el ID num-1, num-2, etc.
            const el = document.getElementById(`num-${item.numero}`);
            if (el) {
                el.classList.add('vendido');
                el.onclick = null; // Desactiva el click
            }
        });

        statusText.innerText = `${datos.length}/100 Números vendidos`;
    } catch (e) {
        console.error("Error al cargar disponibilidad:", e);
        statusText.innerText = "Disponibilidad: 100 Números";
    }
}

// 4. GUARDAR COMPRA
async function confirmarCompra() {
    const btn = document.getElementById('btn-confirmar-final');
    const datos = {
        numero: parseInt(numElegido), // Enviamos como número entero
        nombre: document.getElementById('nombre').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };

    if (!datos.nombre || !datos.dni || !datos.celular) {
        alert("Completa los campos obligatorios.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "RESERVANDO...";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rifa`, {
            method: 'POST',
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert(`¡Número ${numElegido} reservado con éxito!`);
            location.reload();
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
            btn.disabled = false;
        }
    } catch (e) {
        alert("Error de conexión.");
        btn.disabled = false;
    }
}

// 5. PANEL ADMIN
async function accesoAdmin() {
    const pass = prompt("Clave:");
    if(pass !== CLAVE_ADMIN) return;

    const num = prompt("Número a liberar (1-100):");
    if(!num) return;

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rifa?numero=eq.${parseInt(num)}`, {
            method: 'DELETE',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}` 
            }
        });
        if(res.ok) {
            alert("Liberado.");
            location.reload();
        }
    } catch(e) { alert("Error."); }
}

// --- FUNCIONES VISUALES ---
function abrirRegistro(n) {
    const s = document.getElementById('sonido-campana');
    if(s) { s.currentTime = 0; s.play(); }
    numElegido = n;
    document.getElementById('txtNumeroSeleccionado').innerText = `NÚMERO ELEGIDO: ${n}`;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function validarCheck() {
    document.getElementById('btn-confirmar-final').disabled = !document.getElementById('acepto-terminos').checked;
}

function animarSanta() {
    const santa = document.getElementById('papa-noel');
    if(!santa) return;
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
    if(!container) return;
    setInterval(() => {
        const f = document.createElement('div');
        f.innerHTML = "❄";
        f.style.position = "absolute";
        f.style.color = "white";
        f.style.left = Math.random() * 100 + "vw";
        f.style.top = "-20px";
        f.style.opacity = Math.random();
        f.style.pointerEvents = "none";
        container.appendChild(f);
        f.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100vh)' }], { duration: 5000 });
        setTimeout(() => f.remove(), 5000);
    }, 400);
}

function mostrarTextoTerminos() {
    alert(
"Términos y Condiciones: Rifa Notebook Banghó Best Pro T5
i7 8gb RAM 480GB SSD

1. OBJETO: Sorteo de Notebook Banghó i7 + Auriculares BT.
2. VALOR: $15.000 por número.
3. CONDICIÓN: El sorteo se realiza al vender los 100 números.
4. SORTEO: Vivo por App Sorteos (se avisará 48hs antes).
5. ENTREGA: Corrientes Capital (interior envío a cargo de organizador)."
    );
}