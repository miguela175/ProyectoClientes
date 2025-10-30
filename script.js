function generarMatrices() {
  const size = parseInt(document.getElementById("matrix-tamano").value);
  crearMatrix("matrix-A", size);
  crearMatrix("matrix-B", size);
}

function crearMatrix(contenedorId, tamano) {
  const container = document.getElementById(contenedorId);
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${tamano}, 50px)`;

  for (let i = 0; i < size * size; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.className = "matrix-cell";
    container.appendChild(input);
  }
}
