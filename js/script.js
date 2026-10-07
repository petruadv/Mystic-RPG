"use strict";

import UI from "./classes/UI.js";
import Player from "./classes/Player.js";
import Game from "./classes/Game.js";
import _worldObjects from "./_worldObjects.js";
import _items from "./_items.js";

const ui = new UI();

const player = new Player({
	name: "SpongeBob",
});

const game = new Game({
	player,
	ui,
});

game.init();

ui.updateCurrentArea("Whispering Homestead");

ui.updateCurrentLand("Homestead");

ui.updateWorldInfoTime("07:30");

ui.updateWorldInfoDay(1);

ui.updateFarmStatus({
	icon: "☀",
	status: "Warm Morning",
	color: "#a99b039b",
});

ui.updateLandDescription(
	"Adună resurse din jurul tău și dezvoltă-ți așezarea. Copaci, roci și obiecte mistice pot apărea în această zonă.",
);

ui.sendNarratorMessage(
	"Ceața dimineții se așterne peste noua ta gospodărie. Pădurea din apropiere este bogată în lemn, iar la marginea terenului se găsesc numeroase formațiuni de rocă.",
);

ui.sendSystemMessage(
	"Selectează un obiect din Homestead pentru a vedea acțiunile disponibile.",
);

game.addWorldObject(_worldObjects.ancientPine);
game.addWorldObject(_worldObjects.stoneDeposit);
game.addTool(_items.woodenAxe);
// game.addTool(_items.stoneAxe);
game.addTool(_items.woodenPickaxe);
// BUG: cand obtin axe de stone, suprapune wooden axe, amount va fi 2. se updateaza precum ca as avea acel item deja si adauga amount, actualizand nume(stone axe)
// totodata atunci cand se reproduce situatia de sus, in equipped map ramane wooden axe dar in UI repet, este stone axe
