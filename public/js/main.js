window.onload = () => {

    const audio = new Audio();
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const loginBtn = document.getElementById("loginBtn");
    const button = document.getElementById("btn");
    let token = 'b710c85e0d34f2e86c3f17127317e19e';

    const url = 'http://localhost:8080/api/';

    button.addEventListener("click", async e => {
        const data = await $.get(`${url}song/${token}/20`);
        audio.src = `data:audio/mp3;base64,${data.data}`;
        audio.play().catch(e => console.log(e));
        setInterval(() => {
            console.log({ buf: audio.duration, ctime: audio.currentTime });
        }, 10000);
        button.style.backgroundColor = "#0f0";
    });

    loginBtn.addEventListener('click', async e => {
       let loginText = login.value;
       let passwordText = password.value;
       const rnd = Math.round(Math.random() * 10000);
       let p = md5(md5(loginText + passwordText) + rnd);
       const data = await $.get(`${url}user/login/${loginText}/${p}/${rnd}`);
       console.log(data);
        if (!data.error) {
            token = data.data.token;
        }
    });

};
