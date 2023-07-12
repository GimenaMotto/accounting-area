let lastNumber = 0;

document.getElementById('submitButton').addEventListener('click', () => {
  const input = document.getElementById('lastNumberInput');
  const newLastNumber = parseInt(input.value);

  if (!isNaN(newLastNumber)) {
    lastNumber = newLastNumber;
    console.log('Nuevo valor de lastNumber:', lastNumber);
  } else {
    console.log('Valor inválido. Por favor, ingrese un número válido.');
  }
});
