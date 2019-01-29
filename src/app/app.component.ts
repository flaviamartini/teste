import { Component } from '@angular/core';
import * as express from "express";
import * as bodyParser from "body-parser";
import * as five from "johnny-five";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  public app: express.Application;
  private bodyParser;
  public board: any;
  public led: any;
  public status: boolean = true;

  constructor(
    
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {

    this.app = express();
    this.middleware();
    this.routes();
    this.managerLed();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }



  middleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  managerLed() {
    this.board = new five.Board();
    this.board.on("ready", function() {
      this.led = new five.Led(13);
    });
  }

  routes() {
    this.app.route("/led").get((req, res) => {
      let _model = req.query.turn;

      if (this.board.isReady) {
        if (_model == "on") {
          this.board.led.on();
        } else {
          this.board.led.off();
        }
      }
      res.send({ result: _model });
    });

    this.app.route("/").get((req, res) => {
      res.send({ result: this.status });
    });
  }
}
