/* ==========================================================
   GEOBINARIO
   PANTALLA DE INGRESO DE NÚMEROS
========================================================== */

const numbersInput =
    document.getElementById(
        "numbersInput"
    );

const buildButton =
    document.getElementById(
        "buildButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const previewBox =
    document.getElementById(
        "previewBox"
    );

const inputError =
    document.getElementById(
        "inputError"
    );


/* ==========================================================
   OBTENER NÚMEROS
========================================================== */

function getNumbers() {

    const value =
        numbersInput.value.trim();


    if (!value) {

        return [];

    }


    const parts =
        value.split("-");


    const numbers = [];


    for (const part of parts) {

        const clean =
            part.trim();


        if (clean === "") {

            return null;

        }


        /*
           Solamente permitimos
           números enteros.
        */

        if (!/^-?\d+$/.test(clean)) {

            return null;

        }


        numbers.push(
            Number(clean)
        );

    }


    return numbers;

}


/* ==========================================================
   VALIDAR DATOS
========================================================== */

function validateInput() {

    const numbers =
        getNumbers();


    inputError.textContent = "";


    if (
        numbers === null
    ) {

        buildButton.disabled = true;

        inputError.textContent =
            "Escribe solamente números separados por guiones.";

        renderPreview([]);

        return false;

    }


    if (
        numbers.length < 3
    ) {

        buildButton.disabled = true;

        inputError.textContent =
            "Ingresa como mínimo 3 números.";

        renderPreview(numbers);

        return false;

    }


    if (
        numbers.length > 15
    ) {

        buildButton.disabled = true;

        inputError.textContent =
            "Puedes ingresar como máximo 15 números.";

        renderPreview(numbers);

        return false;

    }


    /*
       Verificar números repetidos.
    */

    const uniqueNumbers =
        new Set(numbers);


    if (
        uniqueNumbers.size !==
        numbers.length
    ) {

        buildButton.disabled = true;

        inputError.textContent =
            "No puedes repetir números.";

        renderPreview(numbers);

        return false;

    }


    /*
       Todo correcto.
    */

    buildButton.disabled = false;

    renderPreview(numbers);

    return true;

}


/* ==========================================================
   PREVISUALIZACIÓN
========================================================== */

function renderPreview(numbers) {

    previewBox.innerHTML = "";


    if (
        !numbers ||
        numbers.length === 0
    ) {

        return;

    }


    numbers.forEach(
        number => {

            const element =
                document.createElement(
                    "span"
                );


            element.className =
                "preview-number";


            element.textContent =
                number;


            previewBox.appendChild(
                element
            );

        }
    );

}


/* ==========================================================
   ESCRITURA
========================================================== */

numbersInput.addEventListener(
    "input",
    () => {

        validateInput();

    }
);


/* ==========================================================
   CONSTRUIR ÁRBOL
========================================================== */

buildButton.addEventListener(
    "click",
    () => {

        if (
            !validateInput()
        ) {

            return;

        }


        const numbers =
            getNumbers();


        /*
           Guardamos los números
           para la siguiente pantalla.
        */

        localStorage.setItem(
            "geoBinarioNumbers",
            JSON.stringify(numbers)
        );


        /*
           Pasamos a la pantalla
           donde se construirá el árbol.
        */

        window.location.href =
            "arbol.html";

    }
);


/* ==========================================================
   VOLVER
========================================================== */

backButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);


/* ==========================================================
   ENTER
========================================================== */

numbersInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !buildButton.disabled
        ) {

            buildButton.click();

        }

    }
);


/* ==========================================================
   INICIO
========================================================== */

validateInput();