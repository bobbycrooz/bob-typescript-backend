

// response handler
export const clientResponse = (res: any, status: number, message: string | object) =>
{
 
  
   function isSuccess(code: string) {
     if (code.startsWith('2')) {
       return true
     } else {
       return false
     }
   }
  

  return res
    .status(status)
    .send(
      typeof message === 'string'
        ? { success: isSuccess(String(status)), message: message }
        : { success: isSuccess(String(status)), ...message }
    )
    .end()
}

