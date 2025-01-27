/* -- 

Elevador 

--  */
const elevador = document.querySelector("#elevador");
const elevatorHeight = 187;
const portaEsquerda = document.querySelector(".porta-esquerda");
const portaDireita = document.querySelector(".porta-direita");
const tamanhoPortaDireita = "54px";
const tamanhoPortaEsquerda = tamanhoPortaDireita;
/* -- --  */

/* 

Andar 

*/
const andaresSelecionados = [];
const andaresSelecionadosPosicaoY = [];
const andaresPosicaoY = [];
/* -- -- */

const buttons = document.querySelectorAll("button");
const kirby = document.querySelector(".kirby");
const sino = document.querySelector("audio");
//
const displayAndar = document.querySelector("#display-andar");
const arrowUp = document.querySelector("#arrow-up");
const arrowDown = document.querySelector("#arrow-down");
/*-- --  */

let movimentoEmProgresso = false;
let temporizadorRetornoTerreo = null;
let ultimaPosY = elevador.getBoundingClientRect().y;

/* -- -*/

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		const andarId = button.id.slice(8);
		const andarElement = document.querySelector(`#${andarId}`);
		const andarPos = andarElement.getBoundingClientRect().top;

		clearTimeout(temporizadorRetornoTerreo);

		if (!andaresSelecionados.includes(andarId)) {
			andaresSelecionados.push(andarId);
			andaresSelecionadosPosicaoY.push(andarPos);
			console.log(andaresSelecionadosPosicaoY);

			button.classList.add("button-active");

			if (!movimentoEmProgresso) {
				processarProximoAndar();
			}
		}
	});
});

async function processarProximoAndar() {
	if (andaresSelecionados.length === 0) {
		movimentoEmProgresso = false;

		const elevadorNoTerreo = elevador.style.top === "0px";
		if (elevadorNoTerreo) {
			return;
		}

		temporizadorRetornoTerreo = setTimeout(async () => {
			if (andaresSelecionados.length === 0) {
				kirby.style.filter = "brightness(0.2)";

				await fecharPortas();
				await moverElevador("andar-0");
				await abrirPortas();
			}
		}, 5000);
		return;
	}

	movimentoEmProgresso = true;
	const destinoId = andaresSelecionados.shift();
	const destinoPosY = andaresSelecionadosPosicaoY.shift();
	const botaoAtual = document.querySelector(`#button__${destinoId}`);

	await fecharPortas();
	await moverElevador(destinoId);
	await abrirPortas();

	setTimeout(() => {
		botaoAtual.classList.remove("button-active");
		processarProximoAndar();
	}, 200);
}

function moverElevador(destinoId) {
	return new Promise((resolve) => {
		const destino =
			destinoId === "andar-pit" ? -1 : Number(destinoId.split("-")[1]);
		const andarDestinoTop = destino * -elevatorHeight;

		elevador.style.top = `${andarDestinoTop}px`;
		kirby.style.filter = "brightness(1)";

		setTimeout(() => {
			resolve();
			tocarAudio();
		}, 3000);
	});
}

/*

Animacao das portas

*/

function abrirPortas() {
	return new Promise((resolve) => {
		portaEsquerda.style.width = "0px";
		portaDireita.style.width = "0px";
		setTimeout(resolve, 1000);
	});
}

function fecharPortas() {
	return new Promise((resolve) => {
		portaEsquerda.style.width = tamanhoPortaEsquerda;
		portaDireita.style.width = tamanhoPortaDireita;
		setTimeout(resolve, 1000);
	});
}

function tocarAudio() {
	sino.volume = 0.08;
	sino.play();
}

setInterval(() => {
	//
	const elevadorPosY = elevador.getBoundingClientRect().y;
	let andarAtual = 0;

	/*

	Se posicao elevador ser extamente a posicao do andar em relaccao a janela do browser

	 */
	if (elevadorPosY <= andaresPosicaoY[0]) {
		andarAtual = 4;
	} else if (elevadorPosY <= andaresPosicaoY[1]) {
		andarAtual = 3;
	} else if (elevadorPosY <= andaresPosicaoY[2]) {
		andarAtual = 2;
	} else if (elevadorPosY <= andaresPosicaoY[3]) {
		andarAtual = 1;
	}

	displayAndar.innerHTML = andarAtual;
}, 100);

/* Armazena Pos Y dos andares, !!! Corrigir ainda para caso janela seja redimensionadaa */

(function posicaoAndares() {
	for (let i = 0; i < 4; i++) {
		andaresPosicaoY.push(
			document.querySelectorAll(".andar")[i].getBoundingClientRect().y
		);
	}
	console.log(andaresPosicaoY);
})();

setInterval(() => {
	const elevadorPosY = elevador.getBoundingClientRect().y;

	if (elevadorPosY < ultimaPosY) {
		arrowUp.style.filter = "brightness(1)";
		arrowDown.style.filter = "brightness(0.3)";
	} else if (elevadorPosY > ultimaPosY) {
		arrowDown.style.filter = "brightness(1)";
		arrowUp.style.filter = "brightness(0.3)";
	}

	ultimaPosY = elevadorPosY;
}, 100);
