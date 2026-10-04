/* ==========================================================
   GEOBINARIO
   ÁRBOL BINARIO DE BÚSQUEDA
   CONSTRUCCIÓN + RECORRIDO INORDEN
========================================================== */


/* ==========================================================
   ELEMENTOS HTML
========================================================== */

const treeContainer =
    document.getElementById(
        "treeContainer"
    );

const treeSvg =
    document.getElementById(
        "treeSvg"
    );

const treeNodes =
    document.getElementById(
        "treeNodes"
    );

const operationText =
    document.getElementById(
        "operationText"
    );

const operationIcon =
    document.getElementById(
        "operationIcon"
    );

const mascotText =
    document.getElementById(
        "mascotText"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const nextButton =
    document.getElementById(
        "nextButton"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );

const finishButton =
    document.getElementById(
        "finishButton"
    );

const traversalButton =
    document.getElementById(
        "traversalButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const traversalSequence =
    document.getElementById(
        "traversalSequence"
    );

const traversalExplanation =
    document.getElementById(
        "traversalExplanation"
    );


/* ==========================================================
   OBTENER NÚMEROS GUARDADOS
========================================================== */

let numbers = [];

try {

    numbers =
        JSON.parse(
            localStorage.getItem(
                "geoBinarioNumbers"
            )
        ) || [];

} catch {

    numbers = [];

}


/* ==========================================================
   ESTADO DEL PROGRAMA
========================================================== */

let root = null;

let currentIndex = 0;

let currentPath = [];

let traversalRunning = false;


/* ==========================================================
   CLASE NODO
========================================================== */

class TreeNode {

    constructor(value) {

        this.value = value;

        this.left = null;

        this.right = null;

        this.parent = null;

    }

}


/* ==========================================================
   INSERTAR NODO EN ABB
========================================================== */

function insertNode(value) {

    const newNode =
        new TreeNode(value);


    /*
       Si no existe raíz,
       este nodo será la raíz.
    */

    if (!root) {

        root = newNode;

        return {

            node: newNode,

            path: []

        };

    }


    let current = root;

    const path = [];


    while (true) {

        path.push(current);


        /*
           MENOR → IZQUIERDA
        */

        if (
            value <
            current.value
        ) {

            if (!current.left) {

                current.left =
                    newNode;

                newNode.parent =
                    current;

                return {

                    node: newNode,

                    path: path

                };

            }


            current =
                current.left;

        }


        /*
           MAYOR → DERECHA
        */

        else if (
            value >
            current.value
        ) {

            if (!current.right) {

                current.right =
                    newNode;

                newNode.parent =
                    current;

                return {

                    node: newNode,

                    path: path

                };

            }


            current =
                current.right;

        }


        /*
           IGUAL
        */

        else {

            return {

                node: null,

                path: path,

                duplicate: true

            };

        }

    }

}


/* ==========================================================
   OBTENER TODOS LOS NODOS
========================================================== */

function getNodes(
    node,
    result = []
) {

    if (!node) {

        return result;

    }


    result.push(node);

    getNodes(
        node.left,
        result
    );

    getNodes(
        node.right,
        result
    );


    return result;

}


/* ==========================================================
   ALTURA
========================================================== */

function getHeight(node) {

    if (!node) {

        return 0;

    }


    return Math.max(

        getHeight(
            node.left
        ),

        getHeight(
            node.right
        )

    ) + 1;

}


/* ==========================================================
   POSICIONES DE LOS NODOS
========================================================== */

function calculatePositions() {

    const positions =
        new Map();


    if (!root) {

        return positions;

    }


    const width =
        treeContainer.clientWidth;

    const height =
        treeContainer.clientHeight;


    const treeHeight =
        getHeight(root);


    /*
       Espacio vertical.
    */

    const verticalGap =
        Math.max(

            85,

            Math.min(

                115,

                (height - 100) /
                Math.max(
                    treeHeight,
                    1
                )

            )

        );


    /*
       Colocación recursiva.
    */

    function place(
        node,
        leftBound,
        rightBound,
        depth
    ) {

        if (!node) {

            return;

        }


        const x =
            (leftBound +
             rightBound) / 2;


        const y =
            60 +
            depth *
            verticalGap;


        positions.set(

            node,

            {
                x: x,
                y: y
            }

        );


        place(

            node.left,

            leftBound,

            x,

            depth + 1

        );


        place(

            node.right,

            x,

            rightBound,

            depth + 1

        );

    }


    place(

        root,

        70,

        width - 70,

        0

    );


    return positions;

}


/* ==========================================================
   DIBUJAR ÁRBOL
========================================================== */

function renderTree(
    activeNode = null
) {

    treeSvg.innerHTML = "";

    treeNodes.innerHTML = "";


    if (!root) {

        return;

    }


    const positions =
        calculatePositions();


    const allNodes =
        getNodes(root);


    /*
       DIBUJAR CONEXIONES
    */

    allNodes.forEach(
        node => {

            const start =
                positions.get(node);


            if (node.left) {

                drawLine(

                    start,

                    positions.get(
                        node.left
                    ),

                    currentPath.includes(
                        node
                    )

                );

            }


            if (node.right) {

                drawLine(

                    start,

                    positions.get(
                        node.right
                    ),

                    currentPath.includes(
                        node
                    )

                );

            }

        }
    );


    /*
       DIBUJAR NODOS
    */

    allNodes.forEach(
        node => {

            const position =
                positions.get(
                    node
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "tree-node";


            element.textContent =
                node.value;


            element.style.left =
                `${position.x}px`;


            element.style.top =
                `${position.y}px`;


            /*
               Nodo actualmente
               visitado.
            */

            if (
                node === activeNode
            ) {

                element.classList.add(
                    "active"
                );

            }


            treeNodes.appendChild(
                element
            );

        }
    );

}


/* ==========================================================
   DIBUJAR CONEXIÓN
========================================================== */

function drawLine(
    start,
    end,
    active
) {

    const line =
        document.createElementNS(

            "http://www.w3.org/2000/svg",

            "line"

        );


    line.setAttribute(
        "x1",
        start.x
    );

    line.setAttribute(
        "y1",
        start.y
    );

    line.setAttribute(
        "x2",
        end.x
    );

    line.setAttribute(
        "y2",
        end.y
    );


    line.classList.add(
        "tree-line"
    );


    if (active) {

        line.classList.add(
            "active"
        );

    }


    treeSvg.appendChild(
        line
    );

}


/* ==========================================================
   MENSAJES
========================================================== */

function setMessage(
    operation,
    mascot
) {

    operationText.textContent =
        operation;


    mascotText.textContent =
        mascot;

}


/* ==========================================================
   CONSTRUIR SIGUIENTE NÚMERO
========================================================== */

function buildNext() {

    if (
        currentIndex >=
        numbers.length
    ) {

        finishTree();

        return;

    }


    const value =
        numbers[currentIndex];


    currentPath = [];


    /*
       PRIMER NÚMERO
    */

    if (!root) {

        const result =
            insertNode(value);


        renderTree(
            result.node
        );


        setMessage(

            `${value} se convierte en la raíz.`,

            `¡Perfecto! El primer número siempre será la raíz.`

        );


        currentIndex++;

        updateProgress();

        return;

    }


    /*
       BUSCAR POSICIÓN
    */

    let current = root;

    const path = [];


    while (current) {

        path.push(current);


        /*
           MENOR
        */

        if (
            value <
            current.value
        ) {

            setMessage(

                `${value} < ${current.value} → izquierda.`,

                `El ${value} es menor que ${current.value}. Vamos hacia la izquierda.`

            );


            current =
                current.left;

        }


        /*
           MAYOR
        */

        else if (
            value >
            current.value
        ) {

            setMessage(

                `${value} > ${current.value} → derecha.`,

                `El ${value} es mayor que ${current.value}. Vamos hacia la derecha.`

            );


            current =
                current.right;

        }


        /*
           REPETIDO
        */

        else {

            currentPath =
                path;


            renderTree(
                current
            );


            setMessage(

                `${value} ya existe en el árbol.`,

                `Ese número ya está colocado. No agregaremos duplicados.`

            );


            currentIndex++;

            updateProgress();

            return;

        }

    }


    /*
       INSERTAR REALMENTE
    */

    const result =
        insertNode(value);


    currentPath =
        result.path;


    renderTree(
        result.node
    );


    /*
       MENSAJE FINAL
    */

    if (
        result.node &&
        result.node.parent
    ) {

        if (
            value <
            result.node.parent.value
        ) {

            setMessage(

                `${value} < ${result.node.parent.value} → colocado a la izquierda.`,

                `¡Encontramos su lugar! ${value} va a la izquierda de ${result.node.parent.value}.`

            );

        }

        else {

            setMessage(

                `${value} > ${result.node.parent.value} → colocado a la derecha.`,

                `¡Encontramos su lugar! ${value} va a la derecha de ${result.node.parent.value}.`

            );

        }

    }


    currentIndex++;

    updateProgress();

}


/* ==========================================================
   ACTUALIZAR PROGRESO
========================================================== */

function updateProgress() {

    progressText.textContent =

        `${currentIndex} / ${numbers.length}`;


    if (
        currentIndex >=
        numbers.length
    ) {

        nextButton.textContent =
            "ÁRBOL COMPLETO ✓";

        nextButton.disabled =
            true;

        setMessage(

            "Árbol listo para recorrer.",

            "¡Excelente! Ahora puedes observar el recorrido INORDEN."

        );

    }

}


/* ==========================================================
   COMPLETAR ÁRBOL
========================================================== */

function finishTree() {

    while (
        currentIndex <
        numbers.length
    ) {

        const value =
            numbers[currentIndex];


        insertNode(value);


        currentIndex++;

    }


    currentPath = [];


    renderTree();


    updateProgress();


    setMessage(

        "Árbol binario terminado.",

        "¡Excelente! Todos los números están colocados."

    );

}


/* ==========================================================
   RECORRIDO INORDEN
========================================================== */

function inorderTraversal(
    node,
    result = []
) {

    if (!node) {

        return result;

    }


    /*
       IZQUIERDA
    */

    inorderTraversal(
        node.left,
        result
    );


    /*
       RAÍZ
    */

    result.push(node);


    /*
       DERECHA
    */

    inorderTraversal(
        node.right,
        result
    );


    return result;

}


/* ==========================================================
   LIMPIAR RECORRIDO
========================================================== */

function clearTraversal() {

    traversalSequence.innerHTML = `

        <span class="empty-traversal">
            El recorrido aparecerá aquí.
        </span>

    `;


    traversalExplanation.innerHTML = `

        El recorrido se realiza:

        <strong>
            izquierda → raíz → derecha
        </strong>

    `;

}


/* ==========================================================
   AGREGAR NÚMERO AL RECORRIDO
========================================================== */

function addTraversalNumber(
    value,
    index
) {

    if (index > 0) {

        const arrow =
            document.createElement(
                "span"
            );


        arrow.className =
            "traversal-arrow";


        arrow.textContent =
            "→";


        traversalSequence.appendChild(
            arrow
        );

    }


    const number =
        document.createElement(
            "div"
        );


    number.className =
        "traversal-number";


    number.textContent =
        value;


    traversalSequence.appendChild(
        number
    );

}


/* ==========================================================
   ESPERAR
========================================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* ==========================================================
   RECORRIDO ANIMADO
========================================================== */

async function startInorderTraversal() {

    if (!root) {

        setMessage(

            "No existe ningún árbol.",

            "Primero construye el árbol."

        );

        return;

    }


    if (
        currentIndex <
        numbers.length
    ) {

        setMessage(

            "El árbol todavía no está completo.",

            "Primero termina de colocar todos los números."

        );

        return;

    }


    if (traversalRunning) {

        return;

    }


    traversalRunning = true;


    /*
       LIMPIAR RECORRIDO
    */

    clearTraversal();


    /*
       OBTENER ORDEN INORDEN
    */

    const traversal =
        inorderTraversal(root);


    /*
       BLOQUEAR BOTONES
    */

    nextButton.disabled = true;

    finishButton.disabled = true;

    restartButton.disabled = true;

    traversalButton.disabled = true;


    /*
       MENSAJE INICIAL
    */

    setMessage(

        "Iniciando recorrido INORDEN...",

        "Vamos a visitar izquierda → raíz → derecha."

    );


    await wait(900);


    /*
       RECORRER UNO POR UNO
    */

    for (
        let i = 0;
        i < traversal.length;
        i++
    ) {

        const node =
            traversal[i];


        /*
           RESALTAR NODO
        */

        currentPath =
            [];


        renderTree(
            node
        );


        /*
           MENSAJE
        */

        setMessage(

            `Visitando nodo: ${node.value}`,

            `Estoy visitando el número ${node.value}.`

        );


        /*
           AGREGAR AL RESULTADO
        */

        addTraversalNumber(

            node.value,

            i

        );


        /*
           ESPERAR
        */

        await wait(1100);

    }


    /*
       FINAL
    */

    currentPath = [];

    renderTree();


    const ordered =
        traversal
            .map(
                node =>
                    node.value
            )
            .join(" → ");


    traversalExplanation.innerHTML = `

        <strong>
            Números ordenados:
        </strong>

        ${ordered}

        <br><br>

        El recorrido
        <strong>INORDEN</strong>
        visita:

        <strong>
            izquierda → raíz → derecha
        </strong>

        y en un Árbol Binario de Búsqueda
        produce los valores de menor a mayor.

    `;


    setMessage(

        "Recorrido INORDEN terminado.",

        "¡Listo! Los números quedaron ordenados de menor a mayor."

    );


    /*
       DESBLOQUEAR
    */

    nextButton.disabled = false;

    finishButton.disabled = false;

    restartButton.disabled = false;

    traversalButton.disabled = false;


    traversalRunning = false;

}


/* ==========================================================
   REINICIAR
========================================================== */

function restartTree() {

    root = null;

    currentIndex = 0;

    currentPath = [];

    traversalRunning = false;


    nextButton.disabled = false;

    finishButton.disabled = false;

    restartButton.disabled = false;

    traversalButton.disabled = false;


    nextButton.textContent =
        "SIGUIENTE →";


    progressText.textContent =
        `0 / ${numbers.length}`;


    clearTraversal();


    setMessage(

        "Preparando el árbol...",

        "¡Vamos a construirlo paso a paso!"

    );


    renderTree();

}


/* ==========================================================
   BOTÓN SIGUIENTE
========================================================== */

nextButton.addEventListener(

    "click",

    () => {

        if (
            !traversalRunning
        ) {

            buildNext();

        }

    }

);


/* ==========================================================
   COMPLETAR
========================================================== */

finishButton.addEventListener(

    "click",

    () => {

        if (
            traversalRunning
        ) {

            return;

        }


        finishTree();

    }

);


/* ==========================================================
   RECORRIDO
========================================================== */

traversalButton.addEventListener(

    "click",

    () => {

        startInorderTraversal();

    }

);


/* ==========================================================
   REINICIAR
========================================================== */

restartButton.addEventListener(

    "click",

    () => {

        if (
            traversalRunning
        ) {

            return;

        }


        restartTree();

    }

);


/* ==========================================================
   VOLVER
========================================================== */

backButton.addEventListener(

    "click",

    () => {

        window.location.href =
            "ingreso.html";

    }

);


/* ==========================================================
   REDIMENSIONAR
========================================================== */

window.addEventListener(

    "resize",

    () => {

        if (!traversalRunning) {

            renderTree();

        }

    }

);


/* ==========================================================
   INICIO
========================================================== */

if (
    !Array.isArray(numbers) ||
    numbers.length === 0
) {

    setMessage(

        "No hay números para construir.",

        "Regresa a la pantalla anterior e ingresa tus números."

    );


    nextButton.disabled = true;

    finishButton.disabled = true;

    traversalButton.disabled = true;

}

else {

    restartTree();

}