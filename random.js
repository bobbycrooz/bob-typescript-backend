function generateRandomCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    code += randomDigit;
  }
  return code;
}


console.log(generateRandomCode(6));