import Phaser from "phaser";
import { EventEmitter } from "events";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2.5];
    this.fontSize = 40;
    this.lineHeight = 80;
    this.defaultTopBtnHeight = innerHeight / 20;
    this.bgMusic;
    this.quote =
      "Come and Join us to build the greatest Graphlands !!! \n http://graphlands.herokuapp.com/";
    this.completedLevel = [];
  }

  create() {
    this.creatingAllButtonsAndBG();
  }

  createBGWithIslands() {
    const backGround = this.add
      .image(this.config.width / 2, this.config.height / 2, "blueSky")
      .setOrigin(0.5, 0.5)
      .setScale(1.8);
    backGround.x = backGround.displayWidth * 0.2;
    this.createFloatingIslands(18);
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach(menuItem => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY
      ];
      menuItem.textGO = this.add
        .text(
          ...menuPosition,
          menuItem.text,
          this.game.config.defaultFontOptions
        )
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });
  }

  createBackButton() {
    const backButton = this.add
      .image(innerWidth / 20, innerHeight / 20, "arrow")
      .setInteractive()
      .setOrigin(0, 0);
    this.scaleObject(backButton, 25);

    backButton.on("pointerup", () => {
      this.playButtonSound();
      this.scene.start("MenuScene");
    });

    this.buttonEffect(backButton);
  }

  displaySoundButton() {
    this.bgMusic = this.sound.add("music", { volume: 0.4, loop: true });

    if (
      this.game.config.bgMusicPlaying === true &&
      this.game.config.gameStarted === false
    ) {
      this.bgMusic.play();
      this.game.config.gameStarted = true;
    }
    this.soundMenu = this.sound.add("soundMenu", { volume: 0.5 });
    const musicOn = this.add
      .image(innerWidth * 0.85, this.defaultTopBtnHeight, "musicOn")
      .setOrigin(1, 0)
      .setInteractive();
    musicOn.visible = this.game.config.bgMusicPlaying;
    this.scaleObject(musicOn, 30);

    const musicOff = this.add
      .image(innerWidth * 0.85, this.defaultTopBtnHeight, "musicOff")
      .setOrigin(1, 0)
      .setInteractive();
    musicOff.visible = !this.game.config.bgMusicPlaying;
    this.scaleObject(musicOff, 30);

    const soundOn = this.add
      .image(innerWidth * 0.9, this.defaultTopBtnHeight, "soundOn")
      .setOrigin(1, 0)
      .setInteractive();
    soundOn.visible = this.game.config.soundPlaying;
    this.scaleObject(soundOn, 30);

    const soundOff = this.add
      .image(innerWidth * 0.9, this.defaultTopBtnHeight, "soundOff")
      .setOrigin(1, 0)
      .setInteractive();
    soundOff.visible = !this.game.config.soundPlaying;
    this.scaleObject(soundOff, 30);

    soundOn.on("pointerdown", () => {
      this.game.config.soundPlaying = false;
      soundOn.visible = this.game.config.soundPlaying;
      soundOff.visible = !this.game.config.soundPlaying;
    });

    soundOff.on("pointerdown", () => {
      this.game.config.soundPlaying = true;
      soundOn.visible = this.game.config.soundPlaying;
      soundOff.visible = !this.game.config.soundPlaying;
    });

    musicOn.on("pointerdown", () => {
      this.game.config.bgMusicPlaying = false;
      musicOff.visible = !this.game.config.bgMusicPlaying;
      musicOn.visible = this.game.config.bgMusicPlaying;
      this.game.sound.stopAll();
    });

    musicOff.on("pointerdown", () => {
      this.game.config.bgMusicPlaying = true;
      musicOff.visible = !this.game.config.bgMusicPlaying;
      musicOn.visible = this.game.config.bgMusicPlaying;
      this.bgMusic.play();
    });

    this.buttonEffect(musicOn);
    this.buttonEffect(musicOff);
    this.buttonEffect(soundOn);
    this.buttonEffect(soundOff);
  }

  createDevelopersTxt() {
    const xPos = this.config.width / 2;
    const yPos = this.config.height * 0.9;
    // ---------------------------------------------------------
    const footerText = this.add.text(
      0,
      0,
      "International Media and Computing \n HTW-Berlin",
      {
        fontSize: "15px",
        fontFamily: "Montserrat-Regular",
        fill: "#000",
        align: "center"
      }
    );
    footerText.setOrigin(0.5);
    // ---------------------------------------------------------
    let twitterBtn = this.add.image(-75, 50, "twitterLogo").setInteractive();
    this.scaleObject(twitterBtn, 45);

    twitterBtn.on("pointerup", () => {
      this.openExternalLink(
        "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(this.quote)
      );
    });
    // ---------------------------------------------------------
    let impressum = this.add
      .image(twitterBtn.x + 45, 50, "impressum")
      .setInteractive();
    this.scaleObject(impressum, 40);

    impressum.on("pointerup", () => {
      this.scene.start("ImpressumScene");
    });
    // ---------------------------------------------------------
    let githubBtn = this.add
      .image(impressum.x + 50, 50, "githubLogo")
      .setInteractive();
    this.scaleObject(githubBtn, 45);

    githubBtn.on("pointerup", () => {
      this.openExternalLink("https://github.com/IMI-DollarGame/DollarGame");
    });
    // ---------------------------------------------------------
    let facebookBtn = this.add
      .image(githubBtn.x + 50, 50, "facebookLogo")
      .setInteractive();
    this.scaleObject(facebookBtn, 45);

    facebookBtn.on("pointerup", () => {
      this.openExternalLink(
        "https://www.facebook.com/sharer/sharer.php?u=graphlands.herokuapp.com&quote=" +
          encodeURIComponent(this.quote)
      );
    });
    // ---------------------------------------------------------
    const container = this.add.container(xPos, yPos, [
      twitterBtn,
      facebookBtn,
      impressum,
      githubBtn,
      footerText
    ]);
  }

  openExternalLink(url) {
    var s = window.open(url, "_blank");
    if (s && s.focus) {
      s.focus();
    } else if (!s) {
      window.location.href = url;
    }
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
      this.playButtonSound();
    });
  }
  creditsBtn() {
    let copyright = this.add
      .image(this.config.width * 0.95, this.defaultTopBtnHeight, "copyright")
      .setInteractive()
      .setOrigin(1, 0);
    this.scaleObject(copyright, 30);

    copyright.on("pointerup", () => {
      this.scene.start("CreditsScene");
    });
  }
  createRightsReservedText() {
    const xPos = this.config.width / 2;
    const yPos = this.config.height * 0.95;
    let gameUrl = this.make
      .text({
        x: xPos,
        y: yPos,
        text: `© 2021  https://graphlands.herokuapp.com - All Rights Reserved.`,
        origin: { x: 0.5, y: 0.5 },
        style: { ...this.fontOptions, fill: "#000000" }
      })
      .setInteractive();
    gameUrl.on("pointerover", () => {
      gameUrl.setStyle({ fill: "#EEE" });
    });

    gameUrl.on("pointerout", () => {
      gameUrl.setStyle({ fill: "#000" });
    });

    gameUrl.on("pointerup", () => {
      this.openExternalLink("https://graphlands.herokuapp.com");
    });
  }

  creatingAllButtonsAndBG() {
    //Creating BG with Islands
    //ORDER MATTERS
    if (this.config.bGWithIslands) {
      this.createBGWithIslands();
    }
    if (this.config.hasCredits) {
      this.creditsBtn();
    }
    if (this.config.canGoBack) {
      this.createBackButton();
    }
    if (this.config.addDevelopers) {
      this.createDevelopersTxt();
    }
    if (this.config.hasSoundButton) {
      this.displaySoundButton();
    }
    if (this.config.allRightsReserved) {
      this.createRightsReservedText();
    }
  }

  playButtonSound() {
    if (this.game.config.soundPlaying === true) {
      this.soundMenu.play();
    }
  }

  createFloatingIslands(per) {
    this.NegIsland7 = this.add.image(
      this.config.width * 0.3,
      this.config.height * 0.2,
      "node-7"
    );
    this.NegIsland5 = this.add.image(
      this.config.width * 0.2,
      this.config.height * 0.9,
      "node-5"
    );
    this.NegIsland2 = this.add.image(
      this.config.width * 0.5,
      this.config.height * 0.2,
      "node-2"
    );
    this.NegIsland1 = this.add.image(
      this.config.width * 0.8,
      this.config.height * 0.3,
      "node-1"
    );
    this.island1 = this.add.image(
      this.config.width * 0.1,
      this.config.height * 0.1,
      "node0"
    );
    this.island2 = this.add.image(
      this.config.width * 0.1,
      this.config.height * 0.55,
      "node1"
    );
    this.island3 = this.add.image(
      this.config.width * 0.4,
      this.config.height * 0.55,
      "node2"
    );
    this.island4 = this.add.image(
      this.config.width * 0.5,
      this.config.height * 0.9,
      "node3"
    );

    this.island5 = this.add.image(
      this.config.width * 0.6,
      this.config.height * 0.5,
      "node5"
    );

    this.island7 = this.add.image(
      this.config.width * 0.8,
      this.config.height * 0.7,
      "node7"
    );
    this.scaleObject(this.NegIsland7, per);
    this.scaleObject(this.NegIsland5, per);
    this.scaleObject(this.NegIsland2, per);
    this.scaleObject(this.NegIsland1, per);
    this.scaleObject(this.island1, per);
    this.scaleObject(this.island2, per);
    this.scaleObject(this.island3, per);
    this.scaleObject(this.island4, per);
    this.scaleObject(this.island5, per);
    this.scaleObject(this.island7, per);
  }

  scaleObject(obj, wPer) {
    obj.displayWidth = this.game.config.width / wPer;
    let hPer = (innerHeight / innerWidth) * wPer;
    obj.displayHeight = this.game.config.height / hPer;
  }

  buttonEffect(btn) {
    /*
    btn.on("pointerover", () => {
      btn.setTintFill(0xffffff);
    });
    */

    btn.on("pointerout", () => {
      btn.clearTint();
    });

    btn.on("pointerup", () => {
      btn.clearTint();
    });

    btn.on("pointerdown", () => {
      btn.setTintFill(0xffff00);
    });
  }
}
export default BaseScene;
