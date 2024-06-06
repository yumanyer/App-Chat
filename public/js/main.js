

console.log("Conectando...");

const socket = io();
// let socket;

const chatbox = document.getElementById("chatbox");

 let user;


 Swal.fire({
  title: "Bienvenido",
  text: "Escribe tu nombre de usuario",
  input: "text",
  inputValidator: (value) => {
   // validamos que el usario se ponga un nombre  
    return !value && "Necesitas escribir un nombre";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,
}).then((value) => {
    user = value.value;
    console.log("Usuario: " + user);
    socket.emit("inicio", user); // Emitir el evento de inicio con el nombre del usuario
  });
// se le pasan 2 parámetros: tecla que toca el usuario y un evento 
chatbox.addEventListener("keydown", (event) => {
  const message = chatbox.value.trim();
  
  if (event.key === "Enter" && message !== "") {
      socket.emit("message", {
          user,
          message: message
      });
      console.log(`${user} dice: ${message}`);
      
      // Reinicio el valor del input
      chatbox.value = "";
  } else if (event.key === "Enter" && message === "") {
      console.log("Mensaje vacío, no enviado");
  }
});
socket.on("connected", (data) => {
  if (user !== undefined) {
    Swal.fire({
      text: `Nuevo usuario conectado: ${data}`,
      toast: true,
      position: "top-right",
    });
  }
});

// mostramos los mensajes 
socket.on("messages", (data) => {
    const messages = document.getElementById("messages")

    let content = ""

    data.forEach((message)=>{
        content += `<p>${message.user} :  ${message.message}</p>`
    })
    messages.innerHTML = content;
})

