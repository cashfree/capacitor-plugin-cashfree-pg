import { CFPaymentGateway } from 'capacitor-plugin-cashfree-pg';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    CFPaymentGateway.echo({ value: inputValue })
}
