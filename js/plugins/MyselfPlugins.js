(function(){
// 催眠？？？
var _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList
Window_SkillList.prototype.makeItemList = function() {
    if($gameParty.members()[0].isStateAffected(150)){
    if (this._actor) {
		var arr = this._actor.skills(); 
		function randSort1(arr){ 
			for(var i = 0,len = arr.length;i < len; i++ ){ 
				var rand = parseInt(Math.random()*len); 
				var temp = arr[rand]; 
				arr[rand] = arr[i]; 
				arr[i] = temp; 
			}        
        return arr;
		}
	randSort1(arr);
        this._data = arr.filter(function(item) {
            return this.includes(item);
        }, this);
    } else {
        this._data = [];
    }}
	else {_Window_SkillList_makeItemList.call(this)}
};

var _Window_SkillList_updateHelp = Window_SkillList.prototype.updateHelp
Window_SkillList.prototype.updateHelp = function() {
	if($gameParty.members()[0].isStateAffected(150)){}
	else{_Window_SkillList_updateHelp.call(this)}
};

var _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem
Window_SkillList.prototype.drawItem = function(index) {
	if($gameParty.members()[0].isStateAffected(150)){
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawText("???", rect.x + iconBoxWidth, rect.y, rect.width - costWidth - iconBoxWidth);						
	}}
	else{_Window_SkillList_drawItem.call(this,index)}
};

var _Window_SkillList_selectLast = Window_SkillList.prototype.selectLast
Window_SkillList.prototype.selectLast = function() {
	if($gameParty.members()[0].isStateAffected(150)){
    var skill;
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);}
	else{_Window_SkillList_selectLast.call(this)}
};

var _Window_ActorCommand_selectLast = Window_ActorCommand.prototype.selectLast
Window_ActorCommand.prototype.selectLast = function() {
	if($gameParty.members()[0].isStateAffected(150)){
    this.select(0);}
	else{_Window_ActorCommand_selectLast.call(this)}
};

var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList
Window_ActorCommand.prototype.makeCommandList = function() {
	_Window_ActorCommand_makeCommandList.call(this)
	if (!$gameParty.members()[0].isStateAffected(125)){
		if($gameVariables._data[2085] >= 100 || $gameParty.members()[0].isStateAffected(142) || $gameParty.members()[0].isStateAffected(143) || $gameParty.members()[0].isStateAffected(144)) this.addCommand('自慰', 'onanii');
	}
	if ($gameParty.members()[0].isStateAffected(125) || $gameParty.members()[0].isStateAffected(149)){
		if($gameParty.members()[0].hp > $gameParty.members()[0].mhp / 20 + 50) this.addCommand('挣脱', 'struggle');
		this.addCommand('忍耐', 'hold');
		if ($gameVariables.value(121) >= 100){
		for (var i=0;i<$gameTroop.aliveMembers().length;i++){
			if($gameTroop.aliveMembers()[i].isStateAffected(139)){
				this.addCommand('侍奉', 'serve');
				return;
	}}}}
};
//拘束禁指令\发情改指令
var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand
Window_ActorCommand.prototype.addAttackCommand = function(){
	if ($gameParty.members()[0].isStateAffected(125) || $gameParty.members()[0].isStateAffected(149)) return;
	if($gameVariables._data[2085] >= 150){
		var a = $gameVariables._data[2085];
		var b = 140 + Math.floor(Math.random()*70);
		if(a > b){this.addCommand('屈服', 'surrender');return;}
	}
	if($gameVariables._data[2085] >= 100){
		var a = $gameVariables._data[2085];
		var b = 90 + Math.floor(Math.random()*60);
		if(a > b){this.addCommand('接受', 'accept');return;}
	}
	_Window_ActorCommand_addAttackCommand.call(this)	
};

var _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands
Window_ActorCommand.prototype.addSkillCommands = function() {
	if ($gameParty.members()[0].isStateAffected(125) || $gameParty.members()[0].isStateAffected(149)) return;
	if($gameVariables._data[2085] >= 150){
		var a = $gameVariables._data[2085];
		var b = 140 + Math.floor(Math.random()*70);
		if(a > b){this.addCommand('屈服', 'surrender');return;}
	}
	if($gameVariables._data[2085] >= 100){
		var a = $gameVariables._data[2085];
		var b = 90 + Math.floor(Math.random()*60);
		if(a > b){this.addCommand('接受', 'accept');return;}
	}
	_Window_ActorCommand_addSkillCommands.call(this)
};

var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand
Window_ActorCommand.prototype.addGuardCommand = function(){
	if ($gameParty.members()[0].isStateAffected(125) || $gameParty.members()[0].isStateAffected(149)) return;
	if($gameVariables._data[2085] >= 150){
		var a = $gameVariables._data[2085];
		var b = 140 + Math.floor(Math.random()*70);
		if(a > b){this.addCommand('屈服', 'surrender');return;}
	}
	if($gameVariables._data[2085] >= 100){
		var a = $gameVariables._data[2085];
		var b = 90 + Math.floor(Math.random()*60);
		if(a > b){this.addCommand('接受', 'accept');return;}
	}
	_Window_ActorCommand_addGuardCommand.call(this)	
};

var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand
Window_ActorCommand.prototype.addItemCommand = function(){
	if ($gameParty.members()[0].isStateAffected(125) || $gameParty.members()[0].isStateAffected(149)) return;
	if($gameVariables._data[2085] >= 150){
		var a = $gameVariables._data[2085];
		var b = 140 + Math.floor(Math.random()*70);
		if(a > b){this.addCommand('屈服', 'surrender');return;}
	}
	if($gameVariables._data[2085] >= 100){
		var a = $gameVariables._data[2085];
		var b = 90 + Math.floor(Math.random()*60);
		if(a > b){this.addCommand('接受', 'accept');return;}
	}
	_Window_ActorCommand_addItemCommand.call(this)	
};

//新指令
var _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow
Scene_Battle.prototype.createActorCommandWindow = function() {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('accept', this.commandAccept.bind(this));
    this._actorCommandWindow.setHandler('surrender', this.commandSurrender.bind(this));
	this._actorCommandWindow.setHandler('onanii', this.commandOnanii.bind(this));
	this._actorCommandWindow.setHandler('struggle', this.commandStruggle.bind(this));
	this._actorCommandWindow.setHandler('hold', this.commandHold.bind(this));
	this._actorCommandWindow.setHandler('serve', this.commandServe.bind(this));
    this.addWindow(this._actorCommandWindow);
};

Scene_Battle.prototype.commandAccept = function () {
    BattleManager.inputtingAction().setSkill(14);
    this.selectNextCommand();
};
Scene_Battle.prototype.commandSurrender = function () {
    BattleManager.inputtingAction().setSkill(697);
    this.selectNextCommand();
};
Scene_Battle.prototype.commandOnanii = function () {
    BattleManager.inputtingAction().setSkill(27);
    this.selectNextCommand();
};
Scene_Battle.prototype.commandStruggle = function () {
    BattleManager.inputtingAction().setSkill(10);
    this.selectNextCommand();
};
Scene_Battle.prototype.commandHold = function () {
    BattleManager.inputtingAction().setSkill(13);
    this.selectNextCommand();
};
Scene_Battle.prototype.commandServe = function () {
    BattleManager.inputtingAction().setSkill(165);
    this.selectNextCommand();
};
//团队属性
Game_Unit.prototype.attackPower = function() {
    var members = this.members();
    if (members.length === 0) {
        return 1;
    }
    var sum = members.reduce(function(r, member) {
        return r + member.atk;
    }, 0);
    return sum / members.length;
};
Game_Unit.prototype.magicPower = function() {
    var members = this.members();
    if (members.length === 0) {
        return 1;
    }
    var sum = members.reduce(function(r, member) {
        return r + member.mat;
    }, 0);
    return sum / members.length;
};
})();