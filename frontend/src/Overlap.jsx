export const OverLap = ({ status, setStatus }) => {
  return (
    <div
      onClick={() => setStatus(false)}
      className={status ? "fixed inset-0 bg-black/50" : "hidden"}
    ></div>
  )
}

// export const OverDiv = ({ status, setStatus }) =>{

//   return(
//     <div
//  className=  {`fixed left-[50%]  border rounded p-4 max-w-[330px]  bg-white 
// -translate-x-1/2 -translate-y-1/2 break-words transition-all duration-500 top-[-500px] ${status?"top-[50%]":""}`}>adfh;djkvvvvvv
//     dknfv,kdjfaa;idhnffdmnfvksdfkjhbvc,,,,,,xzchklzvzbnccnnnnnnnnnnnnnnnnndkjfhfadncvkdjhffakx ckdjhfnckjhfanvbjkdnjhlihljjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
//     jbjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj 
//     kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
//     kkkkkkkkkkkkkkkkkkkkkkkkk</div>
//   )
// }
export const OverDiv = ({ status }) => {
  return (
    <div
      className={`fixed left-[50%] top-[50%] border rounded p-4 max-w-[330px] bg-white 
      -translate-x-1/2 break-words transition-all duration-500
      ${status ? "-translate-y-1/2 opacity-100" : "-translate-y-[200%] opacity-0"}`}
    >
      adfh;djkvvvvvv dknfv,kdjfaa...kdfbalej.dlwjeanfjdkasfrh;iawoFJHGBDJSDBLW;oofjkdnjbflauiWHSFJBVDZHSRLEL.SKBVREALWIAO
      DJALWEOLFJKNJKSEILAEO;LDJFAIW;EOFNBJEALIWAIODKBSIELWEODKDJCBAI[POEOIYRURWFGBJFNAIOFGUHA]
    </div>
  )
}