if ("serial" in navigator) {
    console.log('Api supported');
  }

$(document).ready(async () =>{
    start();
    
});

async function start(){
    $("#ScannerSelectBtn").click(async () =>{
        var port = await navigator.serial.requestPort();
        
    });
    const ports = await navigator.serial.getPorts();
    console.log(ports[0]);
    var port = ports[0];
    await port.open({ baudRate: 9600, bufferSize: 1024, flowControl:"hardware"});
    while (port.readable) {
        const reader = port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read({ baudRate: 9600, bufferSize: 1024, flowControl:"hardware"});
            if (done) {
              // |reader| has been canceled.
              console.log('reader has been canceled')
              //break;
            }
            // Do something with |value|...
            const string = new TextDecoder().decode(value);
            console.log(value);
            console.log(string);
            $("#testingID").html(string);
          }
        } catch (error) {
          // Handle |error|...
        } finally {
          reader.releaseLock();
        }
      }
}



