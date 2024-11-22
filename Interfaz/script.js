document.getElementById('addTruck').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const totalmacenaje = parseFloat(document.getElementById('totalmacenaje').value);
    const placas = document.getElementById('placas').value;
    const marca = document.getElementById('marca').value;

    if (!nombre || !totalmacenaje || !placas || !marca) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newTruck = { nombre, totalmacenaje, placas, marca };

    try {
        const response = await fetch('http://localhost:3000/api/camiones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTruck),
        });

        if (response.ok) {
            alert('Camión agregado correctamente.');
            loadTrucks();
        } else {
            throw new Error('Error al agregar el camión.');
        }
    } catch (err) {
        alert(err.message);
    }
});

async function loadTrucks() {
    const response = await fetch('http://localhost:3000/api/camiones');
    const trucks = await response.json();

    const table = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Totalmacenaje</th>
                    <th>Placas</th>
                    <th>Marca</th>
                </tr>
            </thead>
            <tbody>
                ${trucks
                    .map(
                        (truck) => `
                    <tr>
                        <td>${truck.Nombre}</td>
                        <td>${truck.Totalmacenaje}</td>
                        <td>${truck.Placas}</td>
                        <td>${truck.Marca}</td>
                    </tr>`
                    )
                    .join('')}
            </tbody>
        </table>
    `;

    document.getElementById('truckTable').innerHTML = table;
}

loadTrucks();
