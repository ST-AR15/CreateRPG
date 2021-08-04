// 全局设置
let mapW = 120;
let gameW = 1000;
let gameH = 800;

let mapNow = 'test';
// 地图信息
let mapModel = {
    normalFloor: {
        file: "CreateRPG/model/map/floor.png", // 模型图片名
        fileX: 1,          // 使用的那块是横向第几个
        fileY: 1.5,          // 使用的那块是纵向第几个
        fileLength: 8,     // 宽度上有多少个方块，通过这个来计算截取
    },
    flower: {
        file: "CreateRPG/model/map/map-object2.png",
        fileX: 2,
        fileY: 2,
        fileLength: 12,
        sizeX: 2,
        sizeY: 2,
    }
}
// 角色信息
let playerModel = {
    main: {
        file: "CreateRPG/model/character/main.png",
    }
};
let mapInfo = {};

// 可以使用的方法
// 初始化游戏，一般是创建地图之类
function gameInit() {
    createMap('test', 10, 10, mapModel.normalFloor);
    createObject('test', 3, 3, mapModel.flower);
    createObject('test', 4, 4, mapModel.flower);
    createPlayer('test', 1, 1, playerModel.main);
    window.onkeydown = function(e) {
        if(e.keyCode == 37) {
            playerMove('left', 300);
        }
        if(e.keyCode == 38) {
            playerMove('up', 300);
        }
        if(e.keyCode == 39) {
            playerMove('right', 300);
        }
        if(e.keyCode == 40) {
            playerMove('down', 300);
        }
    }
}
/**
 * 创建地图
 * @param {String} name 地图名字
 * @param {Number} width 地图宽度（格子数量）
 * @param {Number} height 地图高度（格子数量）
 * @param {Object} model 地图每一格的材质
 */
function createMap(name, width, height, model) {
    // 数据正确性判断
    if(arguments.length != 4) {
        throw '请传入正确数量的参数！';
    }
    if(mapInfo[name]) {
        throw '请不要创建一个已经存在的地图！如果需要修改该地图信息，请调用updateMap()'
    }
    if(!(typeof (model) == 'object' && Object.prototype.toString.call(model).toLowerCase() == "[object object]")) {
        throw '请传入Object的model属性，它应该有file、fileX、fileY、fileLength四个值。您可以通过createModel方法来创建属性，然后在this.data.model里找到它。'
    }
    // 创建地图
    let map = [];
    for(let i = 0; i < width*height; i++) {
        map.push({
            placeX: (i % width) + 1,
            placeY: Math.floor(i / width) + 1,
            model: model,
            isMove: true,
        })
    }
    // this.map[name] = map;
    let info = {
        detail: map,
        info: {
            x: width,
            y: height
        }
    }
    mapInfo[name] = info;
}

/**
 * 为地图添加object
 * @param {String} name 地图名字
 * @param {Object} model 放上来的东西
 * @param {Number} x 横向第几块
 * @param {Number} y 纵向第几块
 */
// TODO 数据检测
function createObject(name, x, y, model) {
    // 如果存在，就是push
    if(!mapInfo[name].obj) {
        mapInfo[name].obj = [];
    }
    mapInfo[name].obj.push({
        placeX: x,
        placeY: y,
        model: model,
    })
}

function createPlayer(name, x, y, model) {
    // 数据检测
    mapInfo[name].player = {
        placeX: x,
        placeY: y,
        model: model,
        playerStatus: 1,
        playerAniStatus: 2,
        time: 0,
        isMove: true,
    };
}
/**
 * 控制角色移动
 * @param {String} direction 角色的移动方向，有left，right，up，down四个选项
 * @param {Number} time 完成本次移动的时间（单位毫秒）
 */
// TODO 解决react视图更新问题
function playerMove(direction, time) {
    let player = mapInfo[mapNow].player;
    // 只有在可移动的情况下才能移动
    if(player.isMove) {
        player.time = time;
        player.isMove = false;
        if(direction == 'left') {
            player.playerStatus = 2;
            player.placeX--;
            console.log('开始往左走');
        }
        else if(direction == 'right') {
            player.playerStatus = 3;
            player.placeX++;
            console.log('开始往右走');
        }
        else if(direction == 'up') {
            player.playerStatus = 4;
            player.placeY--;
            console.log('开始往上走');
        }
        else if(direction == 'down') {
            player.playerStatus = 1;
            player.placeY++;
            console.log('开始往下走');
        }
        // console.log(player);
        // mapInfo[mapNow].player = {};
        // mapInfo[mapNow].player = player;
        // else {
        //     throw '请输入正确的方向！正确的输入应该为left, right, up和down四个中的一个'
        // }
        // 角色动作
        let that = player;
        setTimeout(() => {
            that.playerAniStatus = 1;
        }, time/4);
        setTimeout(() => {
            that.playerAniStatus = 2;
        }, time*2/4);
        setTimeout(() => {
            that.playerAniStatus = 3;
        }, time*3/4);
        setTimeout(() => {
            that.playerAniStatus = 2;
            that.isMove = true;
            console.log('走完了')
        }, time);
    }
}

// 页面
// 游戏菜单（进入页面）
function Menu() {
    return (
        <div className="crpg-menu">
            <ul>
                <li>{ m.New_Game }</li>
                <li>{ m.Load_Game }</li>
                <li>{ m.Setting }</li>
            </ul>
        </div>
    )
}

// 游戏地图
function GameMap(props) {
    return (
        <div className="crpg-map" style={{
            width: (mapInfo[props.name].info.x * mapW) + 'px',
            height: (mapInfo[props.name].info.y * mapW) + 'px',
        }}>
            {/* 地图的地面 */}
            { mapInfo[props.name].detail.map(({placeX, placeY, model, isMove}) => {
                return (
                    <div className="map-blank" key={ placeX + '-' + placeY } style={{
                        width: mapW + 'px',
                        height: mapW + 'px',
                        left: (placeX-1) * mapW + 'px',
                        top: (placeY-1) * mapW + 'px',
                        backgroundImage: 'url(' + model.file + ')',
                        backgroundPosition: (model.fileX-1)*(-mapW) + 'px' + ' ' + (model.fileY-1)*(-mapW) + 'px',
                        backgroundSize: (model.fileLength*100) + '%'
                    }}></div>
                )
            })}
            {/* 地图的可交互物品 */}
            { mapInfo[props.name].obj.map(({placeX, placeY, model}) => {
                return (
                    <div className="map-blank" key={ placeX + '-' + placeY } style={{
                        width: mapW + 'px',
                        height: mapW + 'px',
                        left: (placeX-1) * mapW + 'px',
                        top: (placeY-1) * mapW + 'px',
                        backgroundImage: 'url(' + model.file + ')',
                        backgroundPosition: (model.fileX-1)*(-mapW) + 'px' + ' ' + (model.fileY-1)*(-mapW) + 'px',
                        backgroundSize: (model.fileLength*100) + '%',
                        transformOrigin: "left top",
                        transform: `scaleX(${ model.sizeX }) scaleY(${ model.sizeY })`
                    }}></div>
                )
            })}
            {/* 主角 */}
            <div className="map-blank" style={{
                width: mapW + 'px',
                height: mapW + 'px',
                left: (mapInfo[props.name].player.placeX-1) * mapW + 'px',
                top: (mapInfo[props.name].player.placeY-1) * mapW + 'px',
                backgroundPosition: (mapInfo[props.name].player.playerAniStatus-1)*(-mapW) + 'px' + ' ' + (mapInfo[props.name].player.playerStatus-1)*(-mapW) + 'px',
                backgroundImage: 'url(' + mapInfo[props.name].player.model.file + ')',
                transitionDuration: mapInfo[props.name].player.time + 'ms',
                backgroundSize: '300%'
            }}></div>
        </div>
    )
}

// 交互区域
function Interactive() {
    return (
        <div className="crpg-interactive">
            int
        </div>
    )
}

function Game() {
    gameInit();
    return (
        <div className="crpg" style={{
            width: gameW + 'px',
            height: gameH + 'px',
        }}>
            <Menu />
            <GameMap name="test" />
            <Interactive />
        </div>
    )
}

ReactDOM.render(
    <Game />,
    document.getElementById('game')
);