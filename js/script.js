"use strict";

import UI from "./classes/UI.js";
import Player from "./classes/Player.js";
import Game from "./classes/Game.js";
import _worldObjects from "./_worldObjects.js";
import _items from "./_items.js";
import SaveManager from "./classes/SaveManager.js";

const saveManager = new SaveManager();

const ui = new UI();

const initialPlayer = new Player({ name: "SpongeBob" });

const player = saveManager.checkExistingPlayer(initialPlayer);

const game = new Game({
	player,
	ui,
	saveManager,
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
