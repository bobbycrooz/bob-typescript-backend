export * from './ErrorHandler/error-handler'
export * from './ErrorHandler/error-code'
export * from './ErrorHandler/error-exception'
// export * from './ErrorHandler/error-model'

// validate and format phone number

export function validateAndFormat(phoneNumber: any) {
  const regex = /^(09|234)?[0-9]{11}$/
  // const ngnNumber = /^(\+234|0)?(1|01)[0-9]{9}$/

  let formatedPhone

  const isValid = regex.test(String(phoneNumber))

  console.log(isValid)

  if (isValid)
  {
    
    if (phoneNumber.startsWith('0')) {
      formatedPhone = '+234' + phoneNumber.slice(1)
    }

    if (phoneNumber.startsWith('+234'))
    {
      formatedPhone = phoneNumber
    }


    
  } else {
    throw new Error('invalid phone number')
  }
  return formatedPhone
}



export function generateRandomCode(length: number) {
  let code = ''
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10)
    code += randomDigit
  }
  return code
}
