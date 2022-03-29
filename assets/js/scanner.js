if ("serial" in navigator) {
    console.log('Api supported');
  }

$(document).ready(async () =>{
    $("#ScannerSelectBtn").click(async () =>{
        const port = await navigator.serial.requestPort();
        
    });
    const ports = await navigator.serial.getPorts();
    console.log(ports[0]);
    await ports[0].open({ baudRate: 9600});
    const reader = ports[0].readable.getReader();
    while(true){
        await reader.read()
        .then(({value,done})=>{
            const string = new TextDecoder().decode(value);
            console.log(value);
            console.log(string);
            $("#testingID").html(string);
        }); 
    }   
    
});

