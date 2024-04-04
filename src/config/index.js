let config = {}
const ENV = 'dev'

if (ENV === 'dev') {
   config = {
      serverUrl: "http://localhost:8000",
      frontUrl: "http://localhost:5173"
   }
}
else {
   config = {
      serverUrl: "https://magical-galileo.212-227-211-20.plesk.page/",
      frontUrl: "https://cs.allhcorp.com/"
   }
}

export default config