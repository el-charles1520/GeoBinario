/* ==========================================================
   GEOBINARIO - ANIMACIÓN REAL DEL ÁRBOL
========================================================== */

const examples = [
    {
        name: "Ejemplo 1",
        numbers: [50, 30, 70, 20, 40, 60, 80]
    },

    {
        name: "Ejemplo 2",
        numbers: [45, 25, 65, 15, 35, 55, 75]
    },

    {
        name: "Ejemplo 3",
        numbers: [60, 40, 80, 20, 50, 70, 90]
    },

    {
        name: "Ejemplo 4",
        numbers: [40, 20, 60, 10, 30, 50, 70]
    }
];


/* ==========================================================
   ELEMENTOS
========================================================== */

const svg = document.getElementById("treeSVG");
const connections = document.getElementById("treeConnections");
const nodesLayer = document.getElementById("treeNodes");
const numberBar = document.getElementById("numberBar");
const dots = document.getElementById("exampleDots");

const previousButton =
    document.getElementById("previousExample");

const nextButton =
    document.getElementById("nextExample");


/* ==========================================================
   VARIABLES
========================================================== */

let currentExample = 0;
let animationTimer = null;
let animationToken = 0;


/* ==========================================================
   NODO
========================================================== */

class TreeNode {

    constructor(value) {

        this.value = value;

        this.left = null;

        this.right = null;

        this.parent = null;

        this.depth = 0;

        this.x = 0;

        this.y = 0;

    }

}


/* ==========================================================
   INSERTAR NODO
========================================================== */

function insertNode(root, value) {

    if (root === null) {

        return new TreeNode(value);

    }


    if (value < root.value) {

        if (root.left === null) {

            root.left = new TreeNode(value);

            root.left.parent = root;

            root.left.depth =
                root.depth + 1;

        } else {

            insertNode(
                root.left,
                value
            );

        }

    }

    else if (value > root.value) {

        if (root.right === null) {

            root.right = new TreeNode(value);

            root.right.parent = root;

            root.right.depth =
                root.depth + 1;

        } else {

            insertNode(
                root.right,
                value
            );

        }

    }

    return root;

}


/* ==========================================================
   CONSTRUIR ÁRBOL
========================================================== */

function buildTree(numbers) {

    let root = null;


    for (const number of numbers) {

        root =
            insertNode(
                root,
                number
            );

    }


    return root;

}


/* ==========================================================
   RECORRIDO INORDEN
========================================================== */

function inorder(root, result = []) {

    if (!root) {

        return result;

    }


    inorder(
        root.left,
        result
    );


    result.push(root);


    inorder(
        root.right,
        result
    );


    return result;

}


/* ==========================================================
   CALCULAR POSICIONES
========================================================== */

function calculatePositions(root) {

    const orderedNodes =
        inorder(root);


    const spacing = 92;


    const totalWidth =
        (orderedNodes.length - 1) *
        spacing;


    const startX =
        380 -
        totalWidth / 2;


    orderedNodes.forEach(
        (node, index) => {

            node.x =
                startX +
                index * spacing;

        }
    );


    function assignVerticalPosition(
        node,
        depth
    ) {

        if (!node) return;


        node.depth = depth;

        node.y =
            35 +
            depth * 75;


        assignVerticalPosition(
            node.left,
            depth + 1
        );


        assignVerticalPosition(
            node.right,
            depth + 1
        );

    }


    assignVerticalPosition(
        root,
        0
    );

}


/* ==========================================================
   OBTENER TODOS LOS NODOS
========================================================== */

function getNodes(root, result = []) {

    if (!root) {

        return result;

    }


    result.push(root);


    getNodes(
        root.left,
        result
    );


    getNodes(
        root.right,
        result
    );


    return result;

}


/* ==========================================================
   BARRA DE NÚMEROS
========================================================== */

function renderNumbers(
    numbers,
    activeIndex = -1
) {

    numberBar.innerHTML = "";


    numbers.forEach(
        (number, index) => {

            const element =
                document.createElement(
                    "span"
                );


            element.className =
                "number-item";


            element.textContent =
                number;


            if (
                index === activeIndex
            ) {

                element.classList.add(
                    "active"
                );

            }


            numberBar.appendChild(
                element
            );

        }
    );

}


/* ==========================================================
   CREAR CÍRCULO
========================================================== */

function createNodeVisual(node) {

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    /*
       IMPORTANTE:
       El transform queda directamente
       en SVG y NO en CSS.
    */

    group.setAttribute(
        "transform",
        `translate(${node.x}, ${node.y})`
    );


    group.style.opacity = "0";


    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    circle.setAttribute(
        "cx",
        "0"
    );


    circle.setAttribute(
        "cy",
        "0"
    );


    circle.setAttribute(
        "r",
        "0"
    );


    circle.classList.add(
        "node-circle"
    );


    const text =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );


    text.textContent =
        node.value;


    text.setAttribute(
        "x",
        "0"
    );


    text.setAttribute(
        "y",
        "0"
    );


    text.classList.add(
        "node-text"
    );


    group.appendChild(circle);

    group.appendChild(text);

    nodesLayer.appendChild(group);


    /*
       Esperamos un frame para
       iniciar la animación.
    */

    requestAnimationFrame(() => {

        group.style.transition =
            "opacity 0.35s ease";


        group.style.opacity = "1";


        circle.style.transition =
            "r 0.45s cubic-bezier(.17,.67,.35,1.35)";


        circle.setAttribute(
            "r",
            "26"
        );

    });


    return group;

}


/* ==========================================================
   CREAR CONEXIÓN
========================================================== */

function createConnectionVisual(
    parent,
    child
) {

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        parent.x
    );


    line.setAttribute(
        "y1",
        parent.y
    );


    line.setAttribute(
        "x2",
        child.x
    );


    line.setAttribute(
        "y2",
        child.y
    );


    line.classList.add(
        "tree-line"
    );


    /*
       Inicialmente invisible.
    */

    line.style.strokeDasharray =
        "1000";


    line.style.strokeDashoffset =
        "1000";


    connections.appendChild(
        line
    );


    /*
       Forzamos al navegador
       a registrar el estado inicial.
    */

    line.getBoundingClientRect();


    requestAnimationFrame(() => {

        line.style.transition =
            "stroke-dashoffset 0.55s ease";


        line.style.strokeDashoffset =
            "0";

    });


    return line;

}


/* ==========================================================
   BUSCAR NODO POR VALOR
========================================================== */

function findNode(
    root,
    value
) {

    if (!root) {

        return null;

    }


    if (
        root.value === value
    ) {

        return root;

    }


    if (
        value < root.value
    ) {

        return findNode(
            root.left,
            value
        );

    }


    return findNode(
        root.right,
        value
    );

}


/* ==========================================================
   LIMPIAR ÁRBOL
========================================================== */

function clearTree() {

    connections.innerHTML = "";

    nodesLayer.innerHTML = "";

}


/* ==========================================================
   ANIMAR ÁRBOL
========================================================== */

function animateTree() {

    /*
       Cancelamos animación anterior.
    */

    clearTimeout(
        animationTimer
    );


    animationToken++;


    const myToken =
        animationToken;


    const numbers =
        examples[
            currentExample
        ].numbers;


    /*
       Árbol COMPLETO solamente
       para conocer las posiciones.
    */

    const completeTree =
        buildTree(numbers);


    calculatePositions(
        completeTree
    );


    const allNodes =
        getNodes(
            completeTree
        );


    /*
       Empezamos vacío.
    */

    clearTree();


    renderNumbers(
        numbers,
        0
    );


    /*
       Función que agrega
       un nodo cada cierto tiempo.
    */

    let step = 0;


    function addNextNode() {

        /*
           Si cambió de ejemplo,
           detenemos esta animación.
        */

        if (
            myToken !==
            animationToken
        ) {

            return;

        }


        if (
            step >=
            numbers.length
        ) {

            /*
               Árbol terminado.
            */

            renderNumbers(
                numbers,
                -1
            );


            /*
               Después de 4 segundos
               comienza el siguiente.
            */

            animationTimer =
                setTimeout(
                    () => {

                        if (
                            myToken ===
                            animationToken
                        ) {

                            currentExample =
                                (
                                    currentExample +
                                    1
                                )
                                %
                                examples.length;


                            updateDots();


                            animateTree();

                        }

                    },
                    4000
                );


            return;

        }


        const value =
            numbers[step];


        renderNumbers(
            numbers,
            step
        );


        /*
           Buscamos el nodo
           que corresponde al
           número actual.
        */

        const node =
            findNode(
                completeTree,
                value
            );


        if (!node) {

            step++;

            addNextNode();

            return;

        }


        /*
           Si tiene padre,
           primero dibujamos
           la conexión.
        */

        if (node.parent) {

            createConnectionVisual(
                node.parent,
                node
            );

        }


        /*
           Después aparece
           el nodo.
        */

        createNodeVisual(
            node
        );


        step++;


        animationTimer =
            setTimeout(
                addNextNode,
                1000
            );

    }


    addNextNode();

}


/* ==========================================================
   PUNTOS DE EJEMPLO
========================================================== */

function updateDots() {

    dots.innerHTML = "";


    examples.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "example-dot";


            if (
                index ===
                currentExample
            ) {

                dot.classList.add(
                    "active"
                );

            }


            dot.addEventListener(
                "click",
                () => {

                    currentExample =
                        index;

                    updateDots();

                    animateTree();

                }
            );


            dots.appendChild(
                dot
            );

        }
    );

}


/* ==========================================================
   SIGUIENTE EJEMPLO
========================================================== */

function nextExample() {

    currentExample =
        (
            currentExample +
            1
        )
        %
        examples.length;


    updateDots();

    animateTree();

}


/* ==========================================================
   EJEMPLO ANTERIOR
========================================================== */

function previousExample() {

    currentExample =
        (
            currentExample -
            1 +
            examples.length
        )
        %
        examples.length;


    updateDots();

    animateTree();

}


/* ==========================================================
   EVENTOS
========================================================== */

nextButton.addEventListener(
    "click",
    () => {

        animationToken++;

        nextExample();

    }
);


previousButton.addEventListener(
    "click",
    () => {

        animationToken++;

        previousExample();

    }
);


/* ==========================================================
   BOTONES PRINCIPALES
========================================================== */

document
    .getElementById("btnStart")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "ingreso.html";

        }
    );


document
    .getElementById("btnTree")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "arbol.html";

        }
    );


document
    .getElementById("btnTraversal")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "recorrido.html";

        }
    );


/* ==========================================================
   INICIO
========================================================== */

updateDots();

animateTree();
/* ==========================================
   BOTÓN VER RECORRIDO
========================================== */

document
    .getElementById("btnTraversal")
    .addEventListener(
        "click",
        () => {

            window.location.href = "arbol.html";

        }
    );