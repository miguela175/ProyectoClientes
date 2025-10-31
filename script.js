function generarMatrices() {
  const n = parseInt(document.getElementById("tamano-matriz").value);
  crearMatriz("matriz-A", n);
  crearMatriz("matriz-B", n);
}

function crearMatriz(contenedorId, tamano) {
  const container = document.getElementById(contenedorId);
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${tamano}, 50px)`;
  container.classList.add('matriz-cuadro');

  for (let i = 0; i < tamano * tamano; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.className = "celda-matriz";
    container.appendChild(input);
  }
}

function obtenerMatriz(id) {
  const inputs = document.querySelectorAll(`#${id} input`);
  const size = Math.sqrt(inputs.length);
  const matriz = [];
  for (let i = 0; i < size; i++) {
    const fila = [];
    for (let j = 0; j < size; j++) {
      const value = parseFloat(inputs[i * size + j].value);
      if (isNaN(value)) return null;
      fila.push(value);
    }
    matriz.push(fila);
  }
  return matriz;
}

function establecerMatriz(id, matrix) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  const size = matrix.length;
  container.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  matrix.flat().forEach(val => {
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.className = "celda-matriz";
    input.value = val.toFixed(2);
    container.appendChild(input);
  });
}

function limpiarMatrices() {
  document.querySelectorAll(".celda-matriz").forEach(cell => cell.value = "");
  const res = document.getElementById("resultado");
  if (res) res.innerHTML = "";
}

function aleatorizarMatrices() {
  document.querySelectorAll("#matriz-A input, #matriz-B input").forEach(cell => {
    cell.value = Math.floor(Math.random() * 21) - 10;
  });
}

function mostrarResultado(text) {
  const out = document.getElementById("resultado");
  if (out) out.innerText = text;
}

function matrizToString(matriz) {
  return matriz.map(fila => fila.map(val => val.toFixed(2)).join("\t")).join("\n");
}

function sumarMatrices() {
  const A = obtenerMatriz("matriz-A");
  const B = obtenerMatriz("matriz-B");
  if (!A || !B || A.length !== B.length) return mostrarResultado("Error: dimensiones incompatibles.");
  const resultado = A.map((fila, i) => fila.map((val, j) => val + B[i][j]));
  mostrarResultado(matrizToString(resultado));
}

function restarMatrices() {
  const A = obtenerMatriz("matriz-A");
  const B = obtenerMatriz("matriz-B");
  if (!A || !B || A.length !== B.length) return mostrarResultado("Error: dimensiones incompatibles.");
  const resultado = A.map((fila, i) => fila.map((val, j) => val - B[i][j]));
  mostrarResultado(matrizToString(resultado));
}

function multiplicarMatrices() {
  const A = obtenerMatriz("matriz-A");
  const B = obtenerMatriz("matriz-B");
  if (!A || !B || A[0].length !== B.length) return mostrarResultado("Error: columnas de A ≠ filas de B.");
  const resultado = multiplicarMatricesInterna(A, B);
  mostrarResultado(matrizToString(resultado));
}

function multiplicarPorEscalar() {
  const A = obtenerMatriz("matriz-A");
  const k = parseFloat(prompt("Ingrese el escalar k:"));
  if (!A || isNaN(k)) return mostrarResultado("Error: entrada inválida.");
  const resultado = A.map(fila => fila.map(val => val * k));
  mostrarResultado(matrizToString(resultado));
}

function transportarMatriz() {
  const A = obtenerMatriz("matriz-A");
  if (!A) return mostrarResultado("Error: matriz inválida.");
  const T = A[0].map((_, j) => A.map(fila => fila[j]));
  mostrarResultado("Original:\n" + matrizToString(A) + "\nTranspuesta:\n" + matrizToString(T));
}

function calcularDeterminante() {
  const A = obtenerMatriz("matriz-A");
  if (!A) return mostrarResultado("Error: matriz inválida.");
  const det = determinante(A);
  mostrarResultado("Det(A) = " + det.toFixed(4));
}

function invertirMatriz() {
  const A = obtenerMatriz("matriz-A");
  if (!A) return mostrarResultado("Error: matriz inválida.");
  const n = A.length;
  const I = matrizIdentidad(n);
  let AI = A.map((fila, i) => fila.concat(I[i]));

  for (let i = 0; i < n; i++) {
    let pivot = AI[i][i];
    if (pivot === 0) {
      let swapRow = AI.findIndex((fila, r) => r > i && fila[i] !== 0);
      if (swapRow === -1) return mostrarResultado("La matriz no es invertible (det(A) = 0).");
      [AI[i], AI[swapRow]] = [AI[swapRow], AI[i]];
      pivot = AI[i][i];
    }

    for (let j = 0; j < 2 * n; j++) {
      AI[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = AI[k][i];
        for (let j = 0; j < 2 * n; j++) {
          AI[k][j] -= factor * AI[i][j];
        }
      }
    }
  }

  const inversa = AI.map(fila => fila.slice(n));
  const producto = multiplicarMatricesInterna(A, inversa);
  mostrarResultado("A⁻¹:\n" + matrizToString(inversa) + "\nVerificación A × A⁻¹ ≈ I:\n" + matrizToString(producto));
}

function matrizIdentidad(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

function multiplicarMatricesInterna(A, B) {
  const n = A.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        result[i][j] += A[i][k] * B[k][j];
  return result;
}

function generarIdentidad() {
  const n = parseInt(document.getElementById("tamano-matriz").value);
  if (isNaN(n) || n < 1) return mostrarResultado("Error: tamaño inválido.");
  const I = matrizIdentidad(n);
  mostrarResultado("Identidad In:\n" + matrizToString(I));
}

function determinante(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
  let det = 0;
  for (let i = 0; i < n; i++) {
    const menor = m.slice(1).map(fila => fila.filter((_, j) => j !== i));
    det += ((i % 2 === 0 ? 1 : -1) * m[0][i] * determinante(menor));
  }
  return det;
}