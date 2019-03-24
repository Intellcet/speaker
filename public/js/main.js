window.onload = () => {

    const audio = new Audio();
    const button = document.getElementById("btn");

    button.addEventListener("click", async e => {
        const data = await $.get('http://localhost:8080/test');
        audio.src = `data:audio/mp3;base64,${data.data}`;
        audio.play().catch(e => console.log(e));
        button.style.backgroundColor = "#0f0";
    });

};
