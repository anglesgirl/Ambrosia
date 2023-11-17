
/*:
 * @target MZ
 * @plugindesc v1.14 Allows one to have a straight forward Roguelike LoS System
 * for their game.
 * @Author Knight of the Celestial Developer Team.
 *
 *
 * @command KoTCRoguelikeVisionOverride
 * @desc Overrides current vision distance if higher than
 * current map vision distance. Works on maps not on rule list.
 * @text Override Vision Distance
 *
 * @arg View Distance
 * @desc Distance to see if higher than maps default
 * view distance.
 * @text View Distance
 * @default 1
 * @type number
 *
 *
 *
 * @command KoTCRoguelikeVisionAddMap
 * @desc Allows a map to make use of the roguelike LoS.
 * @text Add Map to Vision Rules
 *
 * @arg MapID
 * @desc The ID of the map.
 * @text Map ID
 * @default 1
 * @type number
 *
 * @arg Vision
 * @desc Default vision range on the map.
 * @text Vision Range
 * @default 5
 * @min 1
 * @max 10
 * @type number
 *
 *
 *
 * @command KoTCRoguelikeVisionRemoveMap
 * @desc Removes a maps LoS rules allowing it to have
 * normal vision.
 * @text Remove Map from Vision Rules
 *
 * @arg MapID
 * @desc The ID of the map.
 * @text Map ID
 * @default 1
 * @type number
 *
 *
 *
 *
 * @help
 * Line of sight is based on the tops of the A4 wall tiles.
 *
 * Plugin Command: KoTCRoguelikeVisionOverride
 * Script Call: KoTCRoguelikeVisionOverride(range); 10 max. 0 for disabled.
 *
 * Usually for when one wants an item such as a torch or lantern to light
 * a dark area, override stays active until canceled, allows roguelike line
 * of sight on maps that aren't on the map rules list.
 *
 * Plugin Command: KoTCRoguelikeVisionAddMap
 * Script Call: KoTCRoguelikeVisionAddMap(mapid, visionrange);
 *
 * Adds map to have vision rules or modifies existing map rules.
 *
 * Plugin Command: KoTCRoguelikeVisionRemoveMap
 * Script Call: KoTCRoguelikeVisionRemoveMap(mapid, visionrange);
 *
 * Removes map from vision rules.
 *
 *
 *
 * @param Map Settings
 *
 * @param Map Config
 * @desc Configure what maps have what view distance.
 * @parent Map Settings
 * @default []
 * @type struct<KoTCMapSettings>[]
 *
 *
 * @param View Type
 * @desc Circle is slightly more cpu intensive than Square.
 * @type select
 * @option Square
 * @value Square
 * @option Circle
 * @value Circle
 * @default Square
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
/*~struct~KoTCMapSettings:
 * @param Map ID
 * @type number
 *
 * @param Default View Distance
 * @Description 10 is max range for performance purposes.
 * @type number
 * @min 1
 * @max 10
 * @default 10
 *
 */

(function () {
    $KoTCRogueLikeLoSSystem = {};
    $KoTCRogueLikeLoSSystem.Parameters = PluginManager.parameters('KoTC Basic Optimized Roguelike Line of Sight');
    switch ($KoTCRogueLikeLoSSystem.Parameters['View Type']) {
    case "Square":
        $KoTCRogueLikeLoSSystem.ViewType = 0;

        break;

    case "Circle":
        $KoTCRogueLikeLoSSystem.ViewType = 1;

        break;
    default:

    }
    $KoTCRogueLikeLoSSystem.MapArray = JSON.parse($KoTCRogueLikeLoSSystem.Parameters['Map Config']);
    $KoTCRogueLikeLoSSystem.ArrayofActiveMaps = [];
    $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange = [];
    $KoTCRogueLikeLoSSystem.OverrideRange = 0;
    var g = 0;
    var length = $KoTCRogueLikeLoSSystem.MapArray.length;
    for (; g < length; g++) {
        $KoTCRogueLikeLoSSystem.MapArray[g] = JSON.parse($KoTCRogueLikeLoSSystem.MapArray[g]);
    }
    var k = 0;
    var maparraylength = $KoTCRogueLikeLoSSystem.MapArray.length;
    for (; k < maparraylength; k++) {
        $KoTCRogueLikeLoSSystem.ArrayofActiveMaps[Number($KoTCRogueLikeLoSSystem.MapArray[k]["Map ID"])] = 1;
        $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[Number($KoTCRogueLikeLoSSystem.MapArray[k]["Map ID"])] = Number($KoTCRogueLikeLoSSystem.MapArray[k]["Default View Distance"]);

    }
    if (Utils.RPGMAKER_NAME == "MZ") {
        PluginManager.registerCommand('KoTC Basic Optimized Roguelike Line of Sight', "KoTCRoguelikeVisionOverride", data => {
            KoTCOverrideVisionRange(data.Vision)
        });
        PluginManager.registerCommand('KoTC Basic Optimized Roguelike Line of Sight', "KoTCRoguelikeVisionAddMap", data => {
                    KoTCRoguelikeVisionAddMap(Number(data.MapID), Number(data.Vision));
        });
        PluginManager.registerCommand('KoTC Basic Optimized Roguelike Line of Sight', "KoTCRoguelikeVisionRemoveMap", data => {
                    KoTCRoguelikeVisionRemoveMap(Number(data.MapID), Number(data.Vision));
        });

    } else {
        var kotcmapplugin = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            kotcmapplugin.call(this, command, args);
            if (command.includes("KoTCRoguelikeVision")) {
                switch (command) {
                case 'KoTCRoguelikeVisionOverride':
                    KoTCOverrideVisionRange(args[0])
                    break;

                case 'KoTCRoguelikeVisionAddMap':
                    KoTCRoguelikeVisionAddMap(Number(args[0]), Number(args[1]))
                    break;

                case 'KoTCRoguelikeVisionRemoveMap':
                    KoTCRoguelikeVisionRemoveMap(Number(args[0]))

                    break;

                default:

                };
            }
        };

    };
}
    ())

function KoTCOverrideVisionRange(range) {
    if (range > 10) {
        range = 10
    };
    $KoTCRogueLikeLoSSystem.OverrideRange = range;
    $KoTCRogueLikeLoSSystem.CurrentViewDistance = range;

    if (typeof $KoTCRoguelikeMainSprite !== 'undefined' && SceneManager._scene.children.includes($KoTCRoguelikeMainSprite)) {
        SceneManager._scene.removeChild($KoTCRoguelikeMainSprite);
        $KoTCRoguelikeLoSMap = undefined;
    }
    if ($KoTCRogueLikeLoSSystem.ArrayofActiveMaps[$gameMap._mapId] !== undefined) {
        KoTCRogueLikeSpriteRefresh()

    } else if ($KoTCRogueLikeLoSSystem.CurrentViewDistance > 0) {
        KoTCRogueLikeSpriteRefresh()
            KoTCRogueLikeLoSBuildVisionMap()

    }

}

function KoTCRoguelikeVisionAddMap(mapid, visionrange) {
    $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[mapid] = visionrange;
    $KoTCRogueLikeLoSSystem.ArrayofActiveMaps[mapid] = 1;
if (mapid == $gameMap._mapId) {
    if (typeof $KoTCRoguelikeMainSprite !== 'undefined' && SceneManager._scene.children.includes($KoTCRoguelikeMainSprite)) {
        SceneManager._scene.removeChild($KoTCRoguelikeMainSprite);
        $KoTCRoguelikeLoSMap = undefined;
    }
        KoTCRogueLikeSpriteRefresh()
        KoTCRogueLikeLoSBuildVisionMap()

    }
}

function KoTCRoguelikeVisionRemoveMap(mapid) {
    $KoTCRogueLikeLoSSystem.ArrayofActiveMaps[mapid] = undefined;
    $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[mapid] = undefined;
    if (mapid == $gameMap._mapId && typeof $KoTCRoguelikeMainSprite !== 'undefined' && SceneManager._scene.children.includes($KoTCRoguelikeMainSprite)) {
        SceneManager._scene.removeChild($KoTCRoguelikeMainSprite);
        $KoTCRoguelikeLoSMap = undefined;
    }
}

function KoTCRogueLikeSpriteRefresh() {
    $KoTCRogueLikeLoSSystem.CurrentViewDistance = 0;
    if ($KoTCRogueLikeLoSSystem.OverrideRange > 0 || $KoTCRogueLikeLoSSystem.ArrayofActiveMaps[$gameMap._mapId] !== undefined) {
        if ($KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[$gameMap._mapId] !== undefined && $KoTCRogueLikeLoSSystem.OverrideRange < $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[$gameMap._mapId]) {
            $KoTCRogueLikeLoSSystem.CurrentViewDistance = $KoTCRogueLikeLoSSystem.ArrayofMapVisionRange[$gameMap._mapId];

        } else {
            $KoTCRogueLikeLoSSystem.CurrentViewDistance = $KoTCRogueLikeLoSSystem.OverrideRange;

        }
        $KoTCRoguelikeLoSBitmap = new Bitmap($dataMap.width, $dataMap.height);
        $KoTCRoguelikeLoSSprite = new Sprite($KoTCRoguelikeLoSBitmap);
        $KoTCRoguelikeLoSBitmap3 = new Bitmap($dataMap.width, $dataMap.height);
        $KoTCRoguelikeLoSSprite3 = new Sprite($KoTCRoguelikeLoSBitmap);
        $KoTCRoguelikeLoSSprite.scale.x = $gameMap.tileWidth();
        $KoTCRoguelikeLoSSprite.scale.y = $gameMap.tileHeight();
        $KoTCRoguelikeLoSSprite3.scale.x = $gameMap.tileWidth();
        $KoTCRoguelikeLoSSprite3.scale.y = $gameMap.tileHeight();
        $KoTCRoguelikeMainSprite = new Sprite();
        $KoTCRoguelikeLoSSprite3.alpha = 0.3;
        $KoTCRoguelikeMainSprite.addChild($KoTCRoguelikeLoSSprite);
        $KoTCRoguelikeMainSprite.addChild($KoTCRoguelikeLoSSprite3);
        SceneManager._scene.addChildAt($KoTCRoguelikeMainSprite, 1);

    }

}

var KOTCRogueLoSINITALIZATION = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
    KOTCRogueLoSINITALIZATION.call(this);
    KoTCRogueLikeSpriteRefresh()
    if ($KoTCRogueLikeLoSSystem.CurrentViewDistance > 0) {
        KoTCRogueLikeLoSBuildVisionMap()

    }
};

    var KOTCRogueLoSINITMAPLOAD = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
    KOTCRogueLoSINITMAPLOAD.call(this);
    KoTCRogueLikeSpriteRefresh()
    if ($KoTCRogueLikeLoSSystem.CurrentViewDistance > 0) {
        KoTCRogueLikeLoSBuildVisionMap()

    }
};

function KoTCRogueLikeLoSBuildVisionMap() {
    $KoTCRoguelikeLoSMap = [];
    var width = $dataMap.width;
    var height = $dataMap.height;
    var j = 0;
    for (; j < width; j++) {
        $KoTCRoguelikeLoSMap[j] = [];
        var i = 0;
        for (; i < height; i++) {
            switch (true) {

            case $gameMap.tileId(j, i, 3) !== 0:
                $KoTCRoguelikeLoSMap[j][i] = 0
                    break;

            case $gameMap.tileId(j, i, 1) !== 0:
                if ($gameMap.checkPassage(j, i, 0x0F) !== false || $gameMap.tileId(j, i, 0) > 2047 && $gameMap.tileId(j, i, 0) < 4351 ) {
                    $KoTCRoguelikeLoSMap[j][i] = 0
                } else {
                    $KoTCRoguelikeLoSMap[j][i] = 1
                };

                break;

            case $gameMap.tileId(j, i, 0) !== 0:
                if ($gameMap.tileId(j, i, 0) > 2047 && $gameMap.tileId(j, i, 0) < 4351 || $gameMap.tileId(j, i, 0) > 4351 && $gameMap.tileId(j, i, 0) < 5839 || $gameMap.tileId(j, i, 0) > 6271 && $gameMap.tileId(j, i, 0) < 6608 || $gameMap.tileId(j, i, 0) > 7039 && $gameMap.tileId(j, i, 0) < 7424 || $gameMap.tileId(j, i, 0) > 7807 && $gameMap.tileId(j, i, 0) < 8192 || $gameMap.tileId(j, i, 0) > 1536 && $gameMap.tileId(j, i, 0) < 1664) {

                    $KoTCRoguelikeLoSMap[j][i] = 0
                } else {
                    $KoTCRoguelikeLoSMap[j][i] = 1
                };

                break;

            default:
                $KoTCRoguelikeLoSMap[j][i] = 0

            };
        };
    };

}
function KoTCRogueLikeLoSCheck() {
    if ($KoTCRoguelikeLoSMap !== undefined && $KoTCRogueLikeLoSSystem.CurrentViewDistance > 0) {
        var newbitmap = new Bitmap($dataMap.width, $dataMap.height);
        var newbitmap3 = new Bitmap($dataMap.width, $dataMap.height);
        newbitmap.fillAll("black");
        switch ($KoTCRogueLikeLoSSystem.ViewType) {
        case 0:
            var radialcoordinates = KoTCGetSquareRadialCoordinates($gamePlayer.x, $gamePlayer.y, $KoTCRogueLikeLoSSystem.CurrentViewDistance);

            break;

        case 1:
            var radialcoordinates = KoTCGetRadialCoordinates($gamePlayer.x, $gamePlayer.y, $KoTCRogueLikeLoSSystem.CurrentViewDistance);

            break;
        default:
        }
        var c = 0;
        var length = radialcoordinates.length;
        for (; c < length; c++) {
            var losarray = LineOfSightBetweenPoints($gamePlayer.x, $gamePlayer.y, radialcoordinates[c][0], radialcoordinates[c][1]);
            var length2 = losarray.length;
            var d = 0;
            for (; d < length2; d++) {
				var directionSwitch = false;
				var dx = losarray[d][0] - $gamePlayer.x;
				var dy = $gamePlayer.y - losarray[d][1];
				switch ($gamePlayer.direction()) {	
					case 2:
						if (dy <= dx && dy <= -dx) directionSwitch = true;
						break;
					case 4:
						if (dy <= -dx && dy >= dx) directionSwitch = true;
						break;
					case 6:
						if (dy <= dx && dy >= -dx) directionSwitch = true;
						break;	
					case 8:
						if (dy >= dx && dy >= -dx) directionSwitch = true;
						break;
				}
                switch (true) {
                case d > (length2 * 0.5 || !directionSwitch):
                    var bitmaptarget = newbitmap3;
                    var fill = "fillRect";
                    var fill2 = 1;
                    var color = "black";

                    break;
                default:
                    var bitmaptarget = newbitmap;
                    var fill = "clearRect";
                    var fill2 = undefined;
                    var color = "black";
                }
						

                if (fill2 !== undefined) {
                    newbitmap.clearRect(losarray[d][0], losarray[d][1], 1, 1, color);

                };
                if ($KoTCRoguelikeLoSMap[losarray[d][0]] !== undefined && $KoTCRoguelikeLoSMap[losarray[d][0]][losarray[d][1]] == 0) {
                    bitmaptarget[fill](losarray[d][0], losarray[d][1], 1, 1, color);
                } else {
                    bitmaptarget[fill](losarray[d][0], losarray[d][1], 1, 1, color);
                    d = length2;
                };
            };

        }
        $KoTCRoguelikeLoSSprite.bitmap = newbitmap;
        $KoTCRoguelikeLoSSprite3.bitmap = newbitmap3;
    };
}

var moveinputalias = Game_Player.prototype.moveByInput

    Game_Player.prototype.moveByInput = function () {
    if ($KoTCRogueLikeLoSSystem.CurrentViewDistance > 0) {
        KoTCRogueLikeLoSCheck();
        $KoTCRoguelikeLoSSprite.x = 0 - $gameMap._displayX * $gameMap.tileWidth();
        $KoTCRoguelikeLoSSprite.y = 0 - $gameMap._displayY * $gameMap.tileHeight();
        $KoTCRoguelikeLoSSprite3.x = 0 - $gameMap._displayX * $gameMap.tileWidth();
        $KoTCRoguelikeLoSSprite3.y = 0 - $gameMap._displayY * $gameMap.tileHeight();
    };
    moveinputalias.call(this);

}

function LineOfSightBetweenPoints(x0, y0, x1, y1) {
    if (x1 < 0) {
        x1 = 0
    } else if (x1 > $dataMap.width - 1) {
        x1 = $dataMap.width - 1
    };
    if (y1 < 0) {
        y1 = 0
    } else if (y1 > $dataMap.height - 1) {
        y1 = $dataMap.height - 1
    };
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    var array = [];
    while (true) {
        array.push([x0, y0]);

        if ((x0 === x1) && (y0 === y1)) {
            break
        };
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return array;
}

function squaremirrorpoints(x0, y0, x, y, storagearray) {
    storagearray.push([x0 + x, y0 + y])
    storagearray.push([x0 - x, y0 + y])
    storagearray.push([x0 + x, y0 - y])
    storagearray.push([x0 - x, y0 - y])

    return storagearray;
}

function mirrorpoints(x0, y0, x, y, storagearray) {
    storagearray.push([x0 + x, y0 + y])
    storagearray.push([x0 - x, y0 + y])
    storagearray.push([x0 + x, y0 - y])
    storagearray.push([x0 - x, y0 - y])
    storagearray.push([x0 + x - 1, y0 + y])
    storagearray.push([x0 - x + 1, y0 + y])
    storagearray.push([x0 + x, y0 - y + 1])
    storagearray.push([x0 - x, y0 - y + 1])

    return storagearray;
}

function KoTCGetSquareRadialCoordinates(x0, y0, r) {
    var storagearray = [];
    var x = 0;
    var y = r;
    while (x <= y) {
        squaremirrorpoints(x0, y0, x, y, storagearray);
        squaremirrorpoints(x0, y0, y, x, storagearray);

        x += 1;

    }
    return storagearray
}

function KoTCGetRadialCoordinates(x0, y0, r) {
    var storagearray = [];
    var d = 5 - 4 * r;

    var x = 0;
    var y = r;

    var deltaA = (-2 * r + 5) * 4;
    var deltaB = 3 * 4;
    while (x <= y) {
        mirrorpoints(x0, y0, x, y, storagearray);
        mirrorpoints(x0, y0, y, x, storagearray);

        if (d > 0) {
            d += deltaA;

            y -= 1;
            x += 1

            deltaA += 4 * 4;
            deltaB += 2 * 2;
        } else {
            d += deltaB;

            x += 1;

            deltaA += 2 * 4;
            deltaB += 2 * 4;
        }
    }
    return storagearray
}

function DrawCircleRect(array, bitmap, color) {
    var a = 0;
    var length = array.length;
    for (; a < length; a++) {
        (function (a) {
            setTimeout(() => {
                bitmap.fillRect(array[a][0], array[a][1], 1, 1, color);

            }, 15 * a);

        }
            (a))

    }
}
