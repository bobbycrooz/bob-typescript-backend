export * from './ErrorHandler/error-handler'
export * from './ErrorHandler/error-code'
export * from './ErrorHandler/error-exception'
// export * from './ErrorHandler/error-model'

// validate and format phone number

export function validateAndFormat(phoneNumber: any) {
      const regex = /^(09|234)?[0-9]{11}$/
      
  let formatedPhone

      const isValid = regex.test(String(phoneNumber)  )
      

  if (isValid) {
    if (phoneNumber.startsWith('0')) {
      formatedPhone = '+234' + phoneNumber.slice(1)
    }
  } else {
    throw new Error('invalid phone number')
  }
  return formatedPhone
}
