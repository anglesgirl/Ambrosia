(function(){
// 催眠？？？
var _Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList
Window_SkillList.prototype.makeItemList = function() {
    if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
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
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){}
	else{_Window_SkillList_updateHelp.call(this)}
};

var _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem
Window_SkillList.prototype.drawItem = function(index) {
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
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
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
    var skill;
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);}
	else{_Window_SkillList_selectLast.call(this)}
};

var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand
Window_ActorCommand.prototype.addAttackCommand = function() {
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
	this.addCommand("？？？", 'attack', this._actor.canAttack());}
	else{_Window_ActorCommand_addAttackCommand.call(this)}
};

var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand
Window_ActorCommand.prototype.addGuardCommand = function() {
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
    this.addCommand("？？？", 'guard', this._actor.canGuard());}
	else{_Window_ActorCommand_addGuardCommand.call(this)}	
};

var _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList
Window_ActorCommand.prototype.makeCommandList = function() {
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
    if (this._actor) {
		var k = Math.round(Math.random()); 
		if (k === 0){
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();}
		else{
		this.addGuardCommand();
        this.addSkillCommands();
        this.addAttackCommand();}
		this.addItemCommand();
    }}
	else{_Window_ActorCommand_makeCommandList.call(this)}
};

var _Window_ActorCommand_selectLast = Window_ActorCommand.prototype.selectLast
Window_ActorCommand.prototype.selectLast = function() {
	if($gameVariables.value(2069)<=0||$gameVariables.value(2011)>0){
    this.select(0);}
	else{_Window_ActorCommand_selectLast.call(this)}
};
//拘束禁物品
var _Window_ActorCommand_addItemCommand = Window_ActorCommand.prototype.addItemCommand
Window_ActorCommand.prototype.addItemCommand = function(){
if($gameParty.members()[0].isStateAffected(125)){}
else{_Window_ActorCommand_addItemCommand.call(this)}		
};
})();