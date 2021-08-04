// 全局设置
let mapW = 120;
let gameW = 1000;
let gameH = 800;
// 地图信息
let mapModel = {
    normalFloor: {
        file: "CreateRPG/model/map/floor.png", // 模型图片名
        fileX: 1,          // 使用的那块是横向第几个
        fileY: 1,          // 使用的那块是纵向第几个
        fileLength: 8,     // 宽度上有多少个方块，通过这个来计算截取
    }
}
let mapInfo = {
    // test: {
    //     info: {
    //         x: 10,
    //         y: 10,
    //     },
    //     detail: [
    //         {
    //             placeX: 1,
    //             placeY: 1,
    //             model: mapModel.normalFloor,
    //             isMove: true,
    //         },
    //         {
    //             placeX: 2,
    //             placeY: 1,
    //             model: mapModel.normalFloor,
    //             isMove: true,
    //         },
    //     ]
    // }
};

// 可以使用的方法
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
        <div className="crpg-map">
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
    createMap('test', 10, 10, mapModel.normalFloor);
    return (
        <div className="crpg-game">
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