//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.EventPoint = new egret.Point();
        this.IdlePictures = [
            this.createBitmapByName("0008_png"), this.createBitmapByName("0009_png"), this.createBitmapByName("0010_png"),
            this.createBitmapByName("0011_png"), this.createBitmapByName("0012_png"), this.createBitmapByName("0013_png"),
            this.createBitmapByName("0014_png"), this.createBitmapByName("0015_png"), this.createBitmapByName("0016_png"),
            this.createBitmapByName("0017_png"), this.createBitmapByName("0018_png"), this.createBitmapByName("0019_png")];
        this.WalkingRightPictures = [
            this.createBitmapByName("0024_png"), this.createBitmapByName("0025_png"), this.createBitmapByName("0026_png"),
            this.createBitmapByName("0027_png"), this.createBitmapByName("0028_png"), this.createBitmapByName("0029_png"),
            this.createBitmapByName("0030_png"), this.createBitmapByName("0031_png"), this.createBitmapByName("0032_png"),
            this.createBitmapByName("0033_png"), this.createBitmapByName("0034_png")];
        this.WalkingLeftPictures = [
            this.createBitmapByName("0024_2_png"), this.createBitmapByName("0025_2_png"), this.createBitmapByName("0026_2_png"),
            this.createBitmapByName("0027_2_png"), this.createBitmapByName("0028_2_png"), this.createBitmapByName("0029_2_png"),
            this.createBitmapByName("0030_2_png"), this.createBitmapByName("0031_2_png"), this.createBitmapByName("0032_2_png"),
            this.createBitmapByName("0033_2_png"), this.createBitmapByName("0034_2_png")];
        this.GoalPoint = new egret.Point();
        this.DistancePoint = new egret.Point();
        this.MoveTime = 0;
        this.tileSize = 64;
        this.ifFindAWay = false;
        this.currentPath = 0;
        this.movingTime = 32;
        this.ifOnGoal = false;
        this.ifStartMove = false;
        this.Npc01Dialogue = ["你好我是NPC01"];
        this.Npc01AcceptDialogue = ["你好我这里有个很简单的对话任务，完成以后就能拿到传说装备yo~,考虑一下吧"];
        this.Npc02Dialogue = ["你好我是NPC02"];
        this.Npc02AcceptDialogue = ["你好我这里有个很简单的杀怪任务，完成以后也能拿到传说装备yo~,考虑一下吧"];
        this.Npc02SubmitDialogue = ["你变强了！！！\n点击完成任务后，奖励道具已经自动为您装备，请打开任务面板检查"];
        this.npcList = [];
        this.monsterIdList = ["slime01", "slime02"];
        this.disx = 0;
        this.disy = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    //private equipmentInformationPanel : EquipmentInformationPanel;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var _this = this;
        // this.Stage01Background = this.createBitmapByName("BackGround_jpg");
        // this.addChild(this.Stage01Background);
        // this.Stage01Background.width = stageH * 3.1;
        // this.Stage01Background.height = stageH;
        // this.Stage01Background.x = -stageH * 3.1 / 2;
        // this.Stage01Background.y = 0;
        this.commandList = new CommandList();
        this.canMove = true;
        this.userPanelIsOn = false;
        this.ifFight = false;
        this.Player = new Person();
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.map01 = new TileMap();
        this.addChild(this.map01);
        TaskService.getInstance();
        //TaskService.getInstance().init();
        this.task01 = creatTask("task_00");
        this.task01.setMain(this);
        TaskService.getInstance().addTask(this.task01);
        this.task02 = creatTask("task_01");
        this.task02.setMain(this);
        TaskService.getInstance().addTask(this.task02);
        this.taskPanel = new TaskPanel();
        TaskService.getInstance().addObserver(this.taskPanel);
        this.addChild(this.taskPanel);
        this.taskPanel.x = this.stage.width - this.taskPanel.width;
        this.taskPanel.y = 0;
        this.NPC01 = new NPC("npc_0", "NPC_Man_01_png", this.Npc01Dialogue);
        this.NPC01.setTaskAcceptDialogue(this.Npc01AcceptDialogue);
        this.npcList.push(this.NPC01);
        this.NPC02 = new NPC("npc_1", "NPC_Man_02_png", this.Npc02Dialogue);
        this.NPC02.setTaskAcceptDialogue(this.Npc02AcceptDialogue);
        this.NPC02.setTaskSubmitDialogue(this.Npc02SubmitDialogue);
        this.npcList.push(this.NPC02);
        TaskService.getInstance().addObserver(this.NPC01);
        TaskService.getInstance().addObserver(this.NPC02);
        this.screenService = new ScreenService();
        //this.slime = new Monster("Slime01","slime","Slime_png",100);
        for (var _i = 0, _a = this.monsterIdList; _i < _a.length; _i++) {
            var id = _a[_i];
            var temp = creatMonster(id);
            this.addChild(temp);
            temp.x = temp.posX;
            temp.y = temp.posY;
            MonsterService.getInstance().addMonster(temp);
        }
        // this.addChild(this.slime);
        // this.slime.x = 64 * 5;
        // this.slime.y = 64 * 4;
        // this.slime.touchEnabled = true;
        // this.monsterList.push(this.slime);
        this.addChild(this.NPC01);
        this.NPC01.x = 128;
        this.NPC01.y = 128;
        this.addChild(this.NPC02);
        this.NPC02.x = 256;
        this.NPC02.y = 320;
        this.dialoguePanel = DialoguePanel.getInstance();
        this.dialoguePanel.SetMain(this);
        this.addChild(this.dialoguePanel);
        this.dialoguePanel.x = 200;
        this.dialoguePanel.y = 200;
        this.userPanelButton = this.createBitmapByName("userPanelButton_png");
        this.addChild(this.userPanelButton);
        this.userPanelButton.x = 10 * 64 - this.userPanelButton.width;
        this.userPanelButton.y = 0;
        this.addChild(this.Player.PersonBitmap);
        this.Player.PersonBitmap.x = 0;
        this.Player.PersonBitmap.y = 0;
        this.map01.startTile = this.map01.getTile(0, 0);
        this.map01.endTile = this.map01.getTile(0, 0);
        //this.map01.setEndTile(2,1);
        this.astar = new AStar();
        this.user = new User("Player01", 1);
        this.hero = new Hero("H001", "FemaleSaberHero01", Quality.ORAGE, 1, "FemaleSaberHero01_png", HeroType.SABER);
        this.sword = new Weapon("W001", "LeagendSword01", Quality.ORAGE, WeaponType.HANDSWORD, "OrangeSword01_png");
        this.lance = new Weapon("W002", "LeagendLance01", Quality.ORAGE, WeaponType.LANCE, "OrageLance01_png");
        this.helment = new Armor("A001", "Purplrhelment01", Quality.PURPLE, ArmorType.LIGHTARMOR, "PurpleHelmet01_png");
        this.corseler = new Armor("A002", "GreenCorseler01", Quality.GREEN, ArmorType.LIGHTARMOR, "GreenCorseler01_png");
        this.shoes = new Armor("A003", "BlueShoes01", Quality.BLUE, ArmorType.LIGHTARMOR, "BlueShoes01_png");
        this.weaponJewel = new Jewel("J001", "传说武器宝石", Quality.ORAGE);
        this.armorJewel = new Jewel("J002", "普通防具宝石", Quality.WHITE);
        this.sword.addJewl(this.weaponJewel);
        this.helment.addJewl(this.armorJewel);
        this.corseler.addJewl(this.armorJewel);
        this.shoes.addJewl(this.armorJewel);
        //this.hero.addWeapon(this.sword);
        this.hero.addHelment(this.helment);
        this.hero.addCorseler(this.corseler);
        this.hero.addShoes(this.shoes);
        this.user.addHeroInTeam(this.hero);
        this.user.addHeros(this.hero);
        EquipmentServer.getInstance();
        EquipmentServer.getInstance().addWeapon(this.sword);
        EquipmentServer.getInstance().addWeapon(this.lance);
        EquipmentServer.getInstance().addArmor(this.helment);
        EquipmentServer.getInstance().addArmor(this.corseler);
        EquipmentServer.getInstance().addArmor(this.shoes);
        //EquipmentServer.getInstance().addWeapon(new Weapon("W002","LeagendLance01",Quality.ORAGE,WeaponType.LANCE,"OrageLance01_png"));
        //  console.log(this.user.getFightPower());
        //  console.log(this.hero.getAttack());
        //  console.log(this.hero.getDefence());
        //  console.log(this.hero.getAglie());
        //  console.log(this.hero.getMaxHP());
        //  console.log("weaponJewel fightpower :" + this.weaponJewel.getFightPower().toFixed(0));
        //  console.log("armorJewel fightpower :" + this.armorJewel.getFightPower().toFixed(0));
        //  console.log("sword fightpower :" + this.sword.getFightPower().toFixed(0));
        //  console.log("helment fightpower :" + this.helment.getFightPower().toFixed(0));
        //  console.log("helment defence :" + this.helment.getDefence().toFixed(0));
        //  console.log("helment aglie :" + this.helment.getAglie().toFixed(0));
        //  console.log("hero fightpower :" + this.hero.getFightPower().toFixed(0));
        this.userPanel = new UserPanel();
        //this.addChild(this.userPanel);
        this.userPanel.showHeroInformation(this.hero);
        this.userPanel.x = (this.stage.width - this.userPanel.width) / 2;
        this.userPanel.y = (this.stage.height - this.userPanel.height) / 2;
        //this.userPanel.equipmentInformationPanel.showEquipmentInformation(this.sword);
        this.userPanelButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            _this.addChild(_this.userPanel);
            _this.userPanel.showHeroInformation(_this.hero);
            //console.log("upbdown");
        }, this);
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //RES.getResAsync("description_json", this.startAnimation, this)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            //egret.Tween.removeTweens(this.Player.PersonBitmap);
            //this.ifStartMove = true;
            //var tempTile : Tile;
            NPC.npcIsChoose = null;
            _this.ifFight = false;
            if (_this.userPanelIsOn && (e.stageX < _this.userPanel.x || e.stageX > _this.userPanel.x + _this.userPanel.width || e.stageY < _this.userPanel.y || e.stageY > _this.userPanel.y + _this.userPanel.height)) {
                _this.removeChild(_this.userPanel);
                _this.userPanelIsOn = false;
            }
            _this.playerx = Math.floor(_this.Player.PersonBitmap.x / _this.tileSize);
            _this.playery = Math.floor(_this.Player.PersonBitmap.y / _this.tileSize);
            _this.playerBitX = _this.Player.PersonBitmap.x;
            _this.playerBitY = _this.Player.PersonBitmap.y;
            //console.log(this.playerx + "," + this.playery);
            _this.map01.startTile = _this.map01.getTile(_this.playerx, _this.playery);
            _this.Player.PersonBitmap.x = _this.playerx * 64;
            _this.Player.PersonBitmap.y = _this.playery * 64;
            _this.currentPath = 0;
            //console.log(playerx + " And " + playery);
            _this.EventPoint.x = e.stageX;
            _this.EventPoint.y = e.stageY;
            _this.tileX = Math.floor(_this.EventPoint.x / _this.tileSize);
            _this.tileY = Math.floor(_this.EventPoint.y / _this.tileSize);
            for (var _i = 0, _a = _this.npcList; _i < _a.length; _i++) {
                var npc = _a[_i];
                if (npc.x / 64 == _this.tileX && npc.y / 64 == _this.tileY)
                    NPC.npcIsChoose = npc;
            }
            for (var _b = 0, _c = _this.monsterIdList; _b < _c.length; _b++) {
                var monsterId = _c[_b];
                var monster = MonsterService.getInstance().getMonster(monsterId);
                if (monster.x / 64 == _this.tileX && monster.y / 64 == _this.tileY) {
                    _this.ifFight = true;
                    _this.monsterAttacking = monster;
                }
            }
            // if(this.map01.getTile(this.tileX,this.tileY).tileData.walkable)
            // {
            //     
            // }
            //this.map01.setEndTile(this.tileX,this.tileY);
            _this.map01.endTile = _this.map01.getTile(_this.tileX, _this.tileY);
            _this.ifFindAWay = _this.astar.findPath(_this.map01);
            if (_this.ifFindAWay) {
                //this.Player.SetState(new WalkingState(),this);
                _this.currentPath = 0;
            }
            for (var i = 0; i < _this.astar.pathArray.length; i++) {
                console.log(_this.astar.pathArray[i].x + " And " + _this.astar.pathArray[i].y);
            }
            if (_this.astar.pathArray.length > 0) {
                _this.disx = Math.abs(_this.playerx * _this.tileSize - _this.Player.PersonBitmap.x);
                _this.disy = Math.abs(_this.playery * _this.tileSize - _this.Player.PersonBitmap.y);
            }
            // egret.Ticker.getInstance().register(()=>{
            // if(!this.IfOnGoal(this.map01.getTile(1,0))){
            //    this.Player.PersonBitmap.x++;
            // }
            // },this)
            //console.log(this.map01.endTile.x + " And " + this.map01.endTile.y);
            // while(this.Player.PersonBitmap.x != this.GoalPoint.x || this.Player.PersonBitmap.y != this.GoalPoint.y){
            //     egret.Ticker.getInstance().register(()=>{
            //        this.Player.PersonBitmap.x += 1;
            //         this.Player.PersonBitmap.y += 1;
            //     },this)
            // }
            // this.PictureMove(this.Stage01Background);
            if (_this.ifFindAWay)
                _this.map01.startTile = _this.map01.endTile;
            if (_this.EventPoint.x >= _this.userPanelButton.x && _this.EventPoint.y <= _this.userPanelButton.height) {
                _this.addChild(_this.userPanel);
                _this.userPanel.showHeroInformation(_this.hero);
                _this.userPanelIsOn = true;
            }
            if (_this.commandList._list.length > 0)
                _this.commandList.cancel();
            //this.commandList.addCommand(new FightCommand(this.Player,this));
            if (_this.canMove && !_this.userPanelIsOn)
                _this.commandList.addCommand(new WalkCommand(_this));
            //this.commandList.addCommand(new FightCommand(this.Player,this));
            if (NPC.npcIsChoose != null && !_this.userPanelIsOn)
                _this.commandList.addCommand(new TalkCommand(_this, NPC.npcIsChoose));
            if (_this.ifFight)
                _this.commandList.addCommand(new FightCommand(_this.Player, _this, _this.monsterAttacking, _this.hero.getAttack()));
            _this.commandList.execute();
        }, this);
        this.PlayerMove();
        this.PlayerAnimation();
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    // private startAnimation(result:Array<any>):void {
    //     var self:any = this;
    //     var parser = new egret.HtmlTextParser();
    //     var textflowArr:Array<Array<egret.ITextElement>> = [];
    //     for (var i:number = 0; i < result.length; i++) {
    //         textflowArr.push(parser.parser(result[i]));
    //     }
    //     var textfield = self.textfield;
    //     var count = -1;
    //     var change:Function = function () {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         var lineArr = textflowArr[count];
    //         self.changeDescription(textfield, lineArr);
    //         var tw = egret.Tween.get(textfield);
    //         tw.to({"alpha": 1}, 200);
    //         tw.wait(2000);
    //         tw.to({"alpha": 0}, 200);
    //         tw.call(change, self);
    //     };
    // }
    p.PlayerMove = function () {
        var _this = this;
        var self = this;
        var getDistance;
        egret.Ticker.getInstance().register(function () {
            if (_this.ifStartMove && self.ifFindAWay) {
                if (self.currentPath < self.astar.pathArray.length - 1) {
                    var distanceX = self.astar.pathArray[self.currentPath + 1].x - self.astar.pathArray[self.currentPath].x;
                    var distanceY = self.astar.pathArray[self.currentPath + 1].y - self.astar.pathArray[self.currentPath].y;
                    if (distanceX < 0)
                        distanceX = distanceX - _this.disx;
                    else
                        distanceX = distanceX + _this.disx;
                    if (distanceY < 0)
                        distanceY = distanceY - _this.disy;
                    else
                        distanceY = distanceY + _this.disy;
                    //console.log(this.disx + "And" + this.disy);
                    if (distanceX > 0) {
                        self.Player.SetRightOrLeftState(new GoRightState(), self);
                    }
                    if (distanceX <= 0) {
                        self.Player.SetRightOrLeftState(new GoLeftState(), self);
                    }
                    if (!self.IfOnGoal(self.astar.pathArray[self.currentPath + 1])) {
                        self.Player.PersonBitmap.x += distanceX / self.movingTime;
                        self.Player.PersonBitmap.y += distanceY / self.movingTime;
                    }
                    else {
                        self.currentPath += 1;
                    }
                }
                if (self.IfOnGoal(self.map01.endTile)) {
                    self.Player.SetState(new IdleState(), self);
                    _this.ifStartMove = false;
                    WalkCommand.canFinish = true;
                    console.log("PM");
                }
            }
            if (_this.ifStartMove && !self.ifFindAWay) {
                var distanceX = self.map01.startTile.x - self.playerBitX;
                var distanceY = self.map01.startTile.y - self.playerBitY;
                if (distanceX > 0) {
                    self.Player.SetRightOrLeftState(new GoRightState(), self);
                }
                if (distanceX <= 0) {
                    self.Player.SetRightOrLeftState(new GoLeftState(), self);
                }
                if (!self.IfOnGoal(self.map01.startTile)) {
                    self.Player.PersonBitmap.x += distanceX / self.movingTime;
                    self.Player.PersonBitmap.y += distanceY / self.movingTime;
                }
                else {
                    self.Player.SetState(new IdleState(), self);
                    _this.ifStartMove = false;
                    WalkCommand.canFinish = true;
                    console.log("PM");
                }
            }
        }, self);
        //    for( self.currentPath = 0 ; self.currentPath < self.astar.pathArray.length - 1; self.currentPath++){
        //         var distanceX = self.astar.pathArray[self.currentPath + 1].x - self.astar.pathArray[self.currentPath].x;
        //         var distanceY = self.astar.pathArray[self.currentPath + 1].y - self.astar.pathArray[self.currentPath].y;
        //         if(distanceX < 0){
        //         self.Player.SetRightOrLeftState(new GoRightState(),self);
        //         }
        //         if(distanceX >= 0){
        //         self.Player.SetRightOrLeftState(new GoLeftState(),self);
        //         }
        //         egret.Tween.get(self.Player.PersonBitmap).to({x : self.Player.PersonBitmap.x + distanceX,y : self.Player.PersonBitmap.y + distanceY} , Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3);
        //         self.MoveTime = Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3;
        //    }
    };
    p.PictureMove = function (pic) {
        var self = this;
        var MapMove = function () {
            egret.Tween.removeTweens(pic);
            var dis = self.Player.PersonBitmap.x - self.EventPoint.x;
            if (self.Player.GetIfGoRight() && pic.x >= -(pic.width - self.stage.stageWidth)) {
                egret.Tween.get(pic).to({ x: pic.x - Math.abs(dis) }, self.MoveTime);
            }
            if (self.Player.GetIfGoLeft() && pic.x <= 0) {
                egret.Tween.get(pic).to({ x: pic.x + Math.abs(dis) }, self.MoveTime);
            }
            //egret.Tween.get(pic).call(MapMove,self);
        };
        MapMove();
    };
    p.IfOnGoal = function (tile) {
        var self = this;
        if (self.Player.PersonBitmap.x == tile.x && self.Player.PersonBitmap.y == tile.y)
            this.ifOnGoal = true;
        else
            this.ifOnGoal = false;
        //console.log(Math.floor(self.Player.PersonBitmap.x - 42 / tile.x) + " And " + Math.floor(self.Player.PersonBitmap.y - 64 / tile.y));
        return this.ifOnGoal;
    };
    p.PlayerAnimation = function () {
        var self = this;
        var n = 0;
        var GOR = 0;
        var GOL = 0;
        var fight = 0;
        var zhen = 0;
        var zhen2 = 0;
        var zhen3 = 0;
        var standArr = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
        var walkRightArr = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34",];
        var fightArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
        var MoveAnimation = function () {
            //var playerBitmap = egret.Tween.get(self.Player.PersonBitmap);
            egret.Ticker.getInstance().register(function () {
                if (zhen % 4 == 0) {
                    if (self.Player.GetIfIdle() && !self.Player.GetIfWalk() && !self.Player.GetIfFight()) {
                        GOR = 0;
                        GOL = 0;
                        fight = 0;
                        var textureName = "00" + standArr[n] + "_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        n++;
                        if (n >= standArr.length) {
                            n = 0;
                        }
                    }
                    if (self.Player.GetIfWalk() && self.Player.GetIfGoRight() && !self.Player.GetIfIdle() && !self.Player.GetIfFight()) {
                        n = 0;
                        GOL = 0;
                        fight = 0;
                        var textureName = "00" + walkRightArr[GOR] + "_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        GOR++;
                        if (GOR >= walkRightArr.length) {
                            GOR = 0;
                        }
                    }
                    if (self.Player.GetIfWalk() && self.Player.GetIfGoLeft() && !self.Player.GetIfIdle() && !self.Player.GetIfFight()) {
                        n = 0;
                        GOR = 0;
                        fight = 0;
                        var textureName = "00" + walkRightArr[GOL] + "_2_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        GOL++;
                        if (GOL >= walkRightArr.length) {
                            GOL = 0;
                        }
                    }
                    if (self.Player.GetIfFight() && !self.Player.GetIfWalk() && !self.Player.GetIfIdle()) {
                        GOR = 0;
                        GOL = 0;
                        n = 0;
                        var textureName = "020" + fightArr[fight] + "_png";
                        var texture = RES.getRes(textureName);
                        self.Player.PersonBitmap.texture = texture;
                        fight++;
                        if (fight >= fightArr.length) {
                            fight = 0;
                        }
                    }
                }
                // if(self.IfOnGoal(self.map01.endTile)){
                //  self.Player.SetState(new IdleState(),self);
                //  WalkCommand.canFinish = false;
                //  //console.log("PA");
                // }
            }, self);
            // var texture : egret.Texture = self.IdlePictures[n];
            // self.PlayerPic.texture = texture;
            //        egret.Tween.get(self.PlayerPic).to(self.IdlePictures[n],0);
            //        egret.Tween.get(self.PlayerPic).wait(42);
            //        n++;
            //        if(n >= self.IdlePictures.length){
            //           n=0;
            //           }
            //egret.Tween.get(self.Player.PersonBitmap).call(IdleAnimation,self);
        };
        var FramePlus = function () {
            egret.Ticker.getInstance().register(function () {
                zhen++;
                if (zhen == 400)
                    zhen = 0;
            }, self);
        };
        MoveAnimation();
        FramePlus();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    // private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
    //     textfield.textFlow = textFlow;
    // }
    p.HeroEquipWeapon = function (weaponId) {
        var temp = this.hero.getEquipment(EquipementType.WEAPON);
        if (temp) {
            this.user.package.InPackage(temp);
        }
        this.hero.addWeapon(EquipmentServer.getInstance().getWeapon(weaponId));
        console.log(weaponId);
    };
    p.HeroEquipHelement = function (helmentId) {
        var temp = this.hero.getEquipment(EquipementType.HELMENT);
        if (temp) {
            this.user.package.InPackage(temp);
        }
        this.hero.addHelment(EquipmentServer.getInstance().getHelement(helmentId));
    };
    p.HeroEquipArmor = function (Id) {
        var temp = this.hero.getEquipment(EquipementType.CORSELER);
        if (temp) {
            this.user.package.InPackage(temp);
        }
        this.hero.addCorseler(EquipmentServer.getInstance().getArmor(Id));
    };
    p.HeroEquipShoes = function (Id) {
        var temp = this.hero.getEquipment(EquipementType.SHOES);
        if (temp) {
            this.user.package.InPackage(temp);
        }
        this.hero.addShoes(EquipmentServer.getInstance().getShoe(Id));
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
var Person = (function () {
    function Person() {
        this.GoRight = false;
        this.GoLeft = false;
        this.PersonBitmap = new egret.Bitmap();
        this.PersonBitmap.width = 49;
        this.PersonBitmap.height = 64;
        // this.PersonBitmap.anchorOffsetX = 2 * this.PersonBitmap.width / 3;
        // this.PersonBitmap.anchorOffsetY = this.PersonBitmap.height;
        this.IsIdle = true;
        this.IsWalking = false;
        this.IsFight = false;
        this.IdleOrWalkStateMachine = new StateMachine();
        this.LeftOrRightStateMachine = new StateMachine();
    }
    var d = __define,c=Person,p=c.prototype;
    p.SetPersonBitmap = function (picture) {
        this.PersonBitmap = picture;
    };
    p.SetIdle = function (set) {
        this.IsIdle = set;
    };
    p.GetIfIdle = function () {
        return this.IsIdle;
    };
    p.SetWalk = function (set) {
        this.IsWalking = set;
    };
    p.GetIfWalk = function () {
        return this.IsWalking;
    };
    p.SetFight = function (set) {
        this.IsFight = set;
    };
    p.GetIfFight = function () {
        return this.IsFight;
    };
    p.SetGoRight = function () {
        this.GoRight = true;
        this.GoLeft = false;
    };
    p.GetIfGoRight = function () {
        return this.GoRight;
    };
    p.SetGoLeft = function () {
        this.GoLeft = true;
        this.GoRight = false;
    };
    p.GetIfGoLeft = function () {
        return this.GoLeft;
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.SetState = function (e, _tmain) {
        this.IdleOrWalkStateMachine.setState(e, _tmain);
    };
    p.SetRightOrLeftState = function (e, _tmain) {
        this.LeftOrRightStateMachine.setState(e, _tmain);
    };
    return Person;
}());
egret.registerClass(Person,'Person');
var PeopleState = (function () {
    function PeopleState() {
    }
    var d = __define,c=PeopleState,p=c.prototype;
    p.OnState = function (_tmain) { };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return PeopleState;
}());
egret.registerClass(PeopleState,'PeopleState',["State"]);
var StateMachine = (function () {
    function StateMachine() {
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.setState = function (e, _tmain) {
        if (this.CurrentState != null) {
            this.CurrentState.ExitState(_tmain);
        }
        this.CurrentState = e;
        this.CurrentState.OnState(_tmain);
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
var IdleState = (function () {
    function IdleState() {
    }
    var d = __define,c=IdleState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetIdle(true);
        _tmain.Player.SetWalk(false);
        _tmain.Player.SetFight(false);
    };
    ;
    p.ExitState = function (_tmain) {
        _tmain.Player.SetIdle(false);
    };
    ;
    return IdleState;
}());
egret.registerClass(IdleState,'IdleState');
var WalkingState = (function () {
    function WalkingState() {
    }
    var d = __define,c=WalkingState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetIdle(false);
        _tmain.Player.SetWalk(true);
        _tmain.Player.SetFight(false);
    };
    ;
    p.ExitState = function (_tmain) {
        _tmain.Player.SetWalk(false);
    };
    ;
    return WalkingState;
}());
egret.registerClass(WalkingState,'WalkingState');
var FightState = (function () {
    function FightState() {
    }
    var d = __define,c=FightState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetFight(true);
        _tmain.Player.SetIdle(false);
        _tmain.Player.SetWalk(false);
    };
    p.ExitState = function (_tmain) {
        _tmain.Player.SetFight(false);
    };
    return FightState;
}());
egret.registerClass(FightState,'FightState');
var GoRightState = (function () {
    function GoRightState() {
    }
    var d = __define,c=GoRightState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetGoRight();
    };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return GoRightState;
}());
egret.registerClass(GoRightState,'GoRightState');
var GoLeftState = (function () {
    function GoLeftState() {
    }
    var d = __define,c=GoLeftState,p=c.prototype;
    p.OnState = function (_tmain) {
        _tmain.Player.SetGoLeft();
    };
    ;
    p.ExitState = function (_tmain) { };
    ;
    return GoLeftState;
}());
egret.registerClass(GoLeftState,'GoLeftState');
//# sourceMappingURL=Main.js.map