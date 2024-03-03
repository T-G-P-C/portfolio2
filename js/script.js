//四川省
//麻雀牌を使用
//難易度
/*
easy:筒子(p)と索子(s)*4 の72牌 9(縦)*8(横)
normal:筒子(p)索子(s)萬子(m)字牌(z)*4 の 136牌 17(縦)*8(横)
hard:筒子(p)索子(s)萬子(m)字牌(7つ)(z)花(8つ)(f)*4 の 168牌 14(縦)*12(横)
*/


//* 命名規則
// class                            ...     アッパーキャメルケース ex) ExamClass
// function(メソッド)               ...     ローワーキャメルケース ex) examFunc
// 変数                             ...     ローワーキャメルケース ex) examNum
// ローカルストレージ(key, value)   ...     今回は未使用



//* 変数
let activeScreen1 = true;            //現在アクティブな画面のレイヤーならTrue
let activeScreen2 = false;            //現在アクティブな画面のレイヤーならTrue
let activeScreen3 = false;            //現在アクティブな画面のレイヤーならTrue
//1:screen1(Clear画面、難易度選択画面など) screen2(Help画面) screen3(Restart確認画面、ToHome確認画面など)
let choiceHamburgerMenu = null;     //ハンバーガーメニューの選択状態を保持する変数 1:Restart 2:ToHome
let beforeHamburgerMenuElem = null;  //Restart確認orToHome確認以前のページ保持用変数
let onclickScreen1ForHamburgerMenuFlg = false;       //screen1にonclickイベントが付与されているかどうかのフラグ
let activeScreen1ForHamburgerMenuFlg = false;        //screen1がActiveクラスを持っているかどうかのフラグ
let beforeHelpElem = null;  //Help以前のページ保持用変数
let activeScreen1ForHelpFlg = false;        //screen1がActiveクラスを持っているかどうかのフラグ
let choiceDifficulty = 0;           //難易度選択用変数 1:easy 2:normal 3:hard
let existVar = false;               //Varクラスの存在確認用
let fromN = 0;
let fromM = 0;                      //選択タイル1つ目のID（行,列:N,M）の場合 N-M
let toN = 0;
let toM = 0;                        //選択タイル2つ目のID（行,列:N,M）の場合 N-M
let selectedCount = 0;              //選択済みタイルの数　0:未選択　1:1つ選択　2:2つ選択
let fieldArray = null;              //盤面の2次元配列用配列。外周や削除済みのところは-1
let movePattern = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
];                                  //移動パターンの配列
let notSelectedTile = null;         //置く予定の牌に対応する数値を格納
let tileLen = null;                 //notSelectedTileの配列数
let startTime = null;               //開始時間を格納する変数
let clearTime = null;               //クリアタイムを格納する変数
let altImgMap = new Map([
    ['img/1p.png', '　一筒'], ['img/2p.png', '　二筒'], ['img/3p.png', '　三筒'],
    ['img/4p.png', '　四筒'], ['img/5p.png', '　五筒'], ['img/6p.png', '　六筒'],
    ['img/7p.png', '　七筒'], ['img/8p.png', '　八筒'], ['img/9p.png', '　九筒'],
    ['img/1s.png', '　一索'], ['img/2s.png', '　二索'], ['img/3s.png', '　三索'],
    ['img/4s.png', '　四索'], ['img/5s.png', '　五索'], ['img/6s.png', '　六索'],
    ['img/7s.png', '　七索'], ['img/8s.png', '　八索'], ['img/9s.png', '　九索'],
    ['img/1m.png', '　一萬'], ['img/2m.png', '　二萬'], ['img/3m.png', '　三萬'],
    ['img/4m.png', '　四萬'], ['img/5m.png', '　五萬'], ['img/6m.png', '　六萬'],
    ['img/7m.png', '　七萬'], ['img/8m.png', '　八萬'], ['img/9m.png', '　九萬'],
    ['img/1z.png', '　東'], ['img/2z.png', '　南'], ['img/3z.png', '　西'],
    ['img/4z.png', '　北'], ['img/5z.png', '　白'], ['img/6z.png', '　發'],
    ['img/7z.png', '　中'], ['img/1f.png', '　春'], ['img/2f.png', '　夏'],
    ['img/3f.png', '　秋'], ['img/4f.png', '　冬'], ['img/5f.png', '　梅'],
    ['img/6f.png', '　蘭'], ['img/7f.png', '　竹'], ['img/8f.png', '　菊']
]);                                 //画像のalt属性を格納するMap
let imgArray = ['img/1p.png', 'img/2p.png', 'img/3p.png', 'img/4p.png', 'img/5p.png', 'img/6p.png', 'img/7p.png', 'img/8p.png', 'img/9p.png',
    'img/1s.png', 'img/2s.png', 'img/3s.png', 'img/4s.png', 'img/5s.png', 'img/6s.png', 'img/7s.png', 'img/8s.png', 'img/9s.png',
    'img/1m.png', 'img/2m.png', 'img/3m.png', 'img/4m.png', 'img/5m.png', 'img/6m.png', 'img/7m.png', 'img/8m.png', 'img/9m.png',
    'img/1z.png', 'img/2z.png', 'img/3z.png', 'img/4z.png', 'img/5z.png', 'img/6z.png', 'img/7z.png',
    'img/1f.png', 'img/2f.png', 'img/3f.png', 'img/4f.png', 'img/5f.png', 'img/6f.png', 'img/7f.png', 'img/8f.png'];
//画像のpassを格納しておく変数 添え字と対応させる



//* function
//ハンバーガーメニューの位置制御
let startY = 0;
document.getElementById('hamburger').addEventListener('touchstart', function (event) {
    const touch = event.touches[0];
    startY = touch.clientY;
});

document.getElementById('hamburger').addEventListener('touchend', function (event) {
    const touch = event.changedTouches[0];
    const endY = touch.clientY;

    const deltaY = endY - startY;
    if (deltaY > 200 && !document.getElementById('hamburgerMenu').classList.contains('Reverse')) {
        // 要素の位置を指の位置に合わせて更新
        document.getElementById('hamburgerMenu').classList.add('Reverse');
    } else if (deltaY < -200 && document.getElementById('hamburgerMenu').classList.contains('Reverse')) {
        // 要素の位置を指の位置に合わせて更新
        document.getElementById('hamburgerMenu').classList.remove('Reverse');
    }
});


//時間の値を受け取り、分と秒に変換するfunction
function toTime(milliSeconds) {
    let seconds, minutes, time;
    seconds = Math.floor(milliSeconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    time = minutes + ":" + seconds;
    return time;
}


//一番上のレイヤーを表示する
function higherPage() {

    if (document.getElementById('screen1').classList.contains('Active')) {
        document.getElementById('screen1').classList.remove('Active');
    } else if (document.getElementById('screen2').classList.contains('Active')) {
        document.getElementById('screen2').classList.remove('Active');
    } else if (document.getElementById('screen3').classList.contains('Active')) {
        document.getElementById('screen3').classList.remove('Active');
    }

    if (activeScreen3 == true) {
        document.getElementById('screen3').classList.add('Active');
    } else if (activeScreen2 == true) {
        document.getElementById('screen2').classList.add('Active');
    } else if (activeScreen1 == true) {
        document.getElementById('screen1').classList.add('Active');
    }
}

//ページ作成
//難易度選難画面
function createDifficultyPage() {
    $('#screen1').empty();

    let difficultyElem = document.createElement('p');
    difficultyElem.classList.add('Title');
    difficultyElem.innerHTML = '四川省';
    document.getElementById('screen1').appendChild(difficultyElem);

    difficultyElem = document.createElement('div');
    difficultyElem.classList.add('UI');
    difficultyElem.classList.add('Level');
    difficultyElem.id = 'selectLevel';
    document.getElementById('screen1').appendChild(difficultyElem);

    difficultyElem = document.createElement('div');
    difficultyElem.id = 'easy';
    difficultyElem.classList.add('Choice');
    difficultyElem.setAttribute('onclick', "selectEasy(this)");
    document.getElementById('selectLevel').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.innerHTML = 'easy';
    document.getElementById('easy').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.classList.add('Supplement');
    difficultyElem.innerHTML = '使用牌：筒子、索子';
    document.getElementById('easy').appendChild(difficultyElem);

    difficultyElem = document.createElement('div');
    difficultyElem.id = 'normal';
    difficultyElem.classList.add('Choice');
    difficultyElem.setAttribute('onclick', "selectNormal(this)");
    document.getElementById('selectLevel').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.innerHTML = 'normal';
    document.getElementById('normal').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.classList.add('Supplement');
    difficultyElem.innerHTML = '使用牌：筒子、索子、萬子、字牌';
    document.getElementById('normal').appendChild(difficultyElem);

    difficultyElem = document.createElement('div');
    difficultyElem.id = 'hard';
    difficultyElem.classList.add('Choice');
    difficultyElem.setAttribute('onclick', "selectHard(this)");
    document.getElementById('selectLevel').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.innerHTML = 'hard';
    document.getElementById('hard').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.classList.add('Supplement');
    difficultyElem.innerHTML = '使用牌：筒子、索子、萬子、字牌、花牌';
    document.getElementById('hard').appendChild(difficultyElem);

    difficultyElem = document.createElement('div');
    difficultyElem.id = 'start';
    difficultyElem.classList.add('UI');
    difficultyElem.setAttribute('onclick', "clickStart()");
    document.getElementById('screen1').appendChild(difficultyElem);

    difficultyElem = document.createElement('p');
    difficultyElem.innerHTML = 'Start';
    document.getElementById('start').appendChild(difficultyElem);

    //前回選択した難易度にActiveクラスを付ける
    if (choiceDifficulty == 1) {
        document.getElementById('easy').classList.add('Active');
        makeArrangedEasy();
    } else if (choiceDifficulty == 2) {
        document.getElementById('normal').classList.add('Active');
        makeArrangedNormal();
    } else if (choiceDifficulty == 3) {
        document.getElementById('hard').classList.add('Active');
        makeArrangedHard();
    } else {
        makeArrangedHard();
    }

    /*const screen1Element = document.getElementById('screen1');
    if (!screen1Element.classList.contains('Active')) {
        screen1Element.classList.add('Active');
        activeScreen1 = true;
        if (document.getElementById('screen2').classList.contains('Active')) {
            document.getElementById('screen2').classList.remove('Active');
            activeScreen2 = false;
        } else if (document.getElementById('screen3').classList.contains('Active')) {
            document.getElementById('screen3').classList.remove('Active');
            activeScreen3 = false;
        }
    }*/
    activeScreen1 = true;
    higherPage();
}

//clear画面
function createClearPage() {
    $('#screen1').empty();

    let clearElem = document.createElement('p');
    clearElem.classList.add('Title');
    clearElem.classList.add('ZoomOut1');
    clearElem.innerHTML = 'Congratulations!';
    document.getElementById('screen1').appendChild(clearElem);

    clearElem = document.createElement('p');
    clearElem.classList.add('ZoomOut2');
    clearElem.innerHTML = 'Clear time:' + toTime(clearTime);
    document.getElementById('screen1').appendChild(clearElem);

    clearElem = document.createElement('div');
    clearElem.id = 'start';
    clearElem.classList.add('UI');
    clearElem.setAttribute('onclick', "restart()");
    document.getElementById('screen1').appendChild(clearElem);

    clearElem = document.createElement('p');
    clearElem.innerHTML = 'Restart';
    document.getElementById('start').appendChild(clearElem);

    /*const screen1Element = document.getElementById('screen1');
    if (!screen1Element.classList.contains('Active')) {
        screen1Element.classList.add('Active');
        activeScreen1 = true;
        if (document.getElementById('screen2').classList.contains('Active')) {
            document.getElementById('screen2').classList.remove('Active');
            activeScreen2 = false;
        } else if (document.getElementById('screen3').classList.contains('Active')) {
            document.getElementById('screen3').classList.remove('Active');
            activeScreen3 = false;
        }
    }*/
    activeScreen1 = true;
    higherPage();
}

//規則正しい麻雀牌の配置
//easy
function makeArrangedEasy() {
    $('#gameArea').empty();

    document.getElementById('gameArea').style.setProperty('--group-count', 8);
    document.getElementById('gameArea').style.setProperty('--line-count', 9);

    for (let i = 1; i <= 8; i++) {
        //新しいgroupの作成
        let divElem = document.createElement('div');
        divElem.id = 'group' + i;
        document.getElementById('gameArea').appendChild(divElem);

        for (let j = 1; j <= 9; j++) {
            //新しいTileの作成
            let imgElem = document.createElement('img');
            imgElem.id = i + '-' + j;
            imgElem.src = imgArray[Math.floor((i - 1) / 4) * 9 + j - 1];
            imgElem.alt = altImgMap.get(imgArray[Math.floor((i - 1) / 4) * 9 + j - 1]);
            imgElem.setAttribute('onerror', "this.classList.add('NoImage');");

            document.getElementById('group' + i).appendChild(imgElem);
        }
    }
}

//normal
function makeArrangedNormal() {
    $('#gameArea').empty();

    document.getElementById('gameArea').style.setProperty('--group-count', 8);
    document.getElementById('gameArea').style.setProperty('--line-count', 17);

    for (let i = 1; i <= 8; i++) {
        //新しいgroupの作成
        let divElem = document.createElement('div');
        divElem.id = 'group' + i;
        document.getElementById('gameArea').appendChild(divElem);

        for (let j = 1; j <= 17; j++) {
            //新しいTileの作成
            let imgElem = document.createElement('img');
            imgElem.id = i + '-' + j;
            imgElem.src = imgArray[Math.floor((i - 1) / 4) * 17 + j - 1];
            imgElem.alt = altImgMap.get(imgArray[Math.floor((i - 1) / 4) * 17 + j - 1]);
            imgElem.setAttribute('onerror', "this.classList.add('NoImage');");

            document.getElementById('group' + i).appendChild(imgElem);
        }
    }
}

//hard
function makeArrangedHard() {
    $('#gameArea').empty();

    document.getElementById('gameArea').style.setProperty('--group-count', 12);
    document.getElementById('gameArea').style.setProperty('--line-count', 14);

    for (let i = 1; i <= 12; i++) {
        //新しいgroupの作成
        let divElem = document.createElement('div');
        divElem.id = 'group' + i;
        document.getElementById('gameArea').appendChild(divElem);

        for (let j = 1; j <= 14; j++) {
            //新しいTileの作成
            let imgElem = document.createElement('img');
            imgElem.id = i + '-' + j;
            imgElem.src = imgArray[Math.floor((i - 1) / 4) * 14 + j - 1];
            imgElem.alt = altImgMap.get(imgArray[Math.floor((i - 1) / 4) * 14 + j - 1]);
            imgElem.setAttribute('onerror', "this.classList.add('NoImage');");

            document.getElementById('group' + i).appendChild(imgElem);
        }
    }
}

//初回実行
makeArrangedHard();

//TODO Restart確認のページ作成
function createCheckPage() {
    $('#screen3').empty();

    let checkElem = document.createElement('p');
    checkElem.style.fontSize = 'calc(var(--base-size) * 6)';
    checkElem.innerHTML = '本当に' + ((choiceHamburgerMenu == 1) ? 'リスタートしますか？' : 'ホームに戻りますか？');
    document.getElementById('screen3').appendChild(checkElem);

    checkElem = document.createElement('br');
    document.getElementById('screen3').appendChild(checkElem);

    checkElem = document.createElement('div');
    checkElem.classList.add('UI');
    checkElem.id = 'check';
    document.getElementById('screen3').appendChild(checkElem);

    checkElem = document.createElement('div');
    checkElem.classList.add('Choice');
    checkElem.setAttribute('onclick', ((choiceHamburgerMenu == 1) ? "restart()" : "toHome()"));
    checkElem.innerHTML = '<p>はい</p>';
    document.getElementById('check').appendChild(checkElem);

    checkElem = document.createElement('div');
    checkElem.classList.add('Choice');
    checkElem.setAttribute('onclick', ((choiceHamburgerMenu == 1) ? "notRestart()" : "notToHome()"));
    checkElem.innerHTML = '<p>いいえ</p>';
    document.getElementById('check').appendChild(checkElem);


    /*document.getElementById('screen3').classList.add('Active');
    activeScreen3 = true;
    if (document.getElementById('screen2').classList.contains('Active')) {
        document.getElementById('screen2').classList.remove('Active');
    } else if (document.getElementById('screen1').classList.contains('Active')) {
        document.getElementById('screen1').classList.remove('Active');
    }*/
    activeScreen3 = true;
    higherPage();
}

//! とりあえず
//TODO （screen2にonclick='backFromHelp()'付与したら消去）
document.getElementById('screen2').setAttribute('onclick', 'backFromHelp()');

//TODO helpページ作成
function createHelpPage() {
    $('#screen2').empty();

    document.getElementById('screen2').innerHTML = `
    <div class="UI">
            <p>
                四川省について
            </p>
            <p>
                四川省は他の牌を跨がずに、直線を二度以内まで曲げた線で結べる牌同士を消していき、全ての牌を消すゲームです。
            </p>
        </div>
        <br>
        <div class="UI">
            <p>
                ハンバーガーメニューについて
            </p>
            <p>
                ハンバーガーメニューは、上下にスワイプすることにより移動することができます。
            </p>
        </div>
    `;

    //console.log(document.getElementById('screen2').innerHTML);

    /*let helpElem = document.createElement('div');
    helpElem.classList.add('UI');
    helpElem.id = 'help1';
    document.getElementById('screen2').appendChild(helpElem);

    helpElem = document.createElement('p');
    helpElem.innerHTML = 'ハンバーガーメニューは、上下にスワイプすることにより移動することができます。';
    document.getElementById('help1').appendChild(helpElem);

    helpElem = document.createElement('br');
    document.getElementById('screen2').appendChild(helpElem);

    helpElem = document.createElement('div');
    helpElem.classList.add('UI');
    helpElem.id = 'help2';
    document.getElementById('screen2').appendChild(helpElem);

    helpElem = document.createElement('p');
    helpElem.innerHTML = '四川省は他の牌を跨がずに、直線を二度以内まで曲げた線で結べる牌同士を消していき、全ての牌を消すゲームです。';
    document.getElementById('help2').appendChild(helpElem);*/

    /*document.getElementById('screen2').classList.add('Active');
    activeScreen2 = true;
    if (document.getElementById('screen3').classList.contains('Active')) {
        document.getElementById('screen3').classList.remove('Active');
        activeScreen3 = false;
    } else if (document.getElementById('screen1').classList.contains('Active')) {
        document.getElementById('screen1').classList.remove('Active');
    }*/
    activeScreen2 = true;
    activeScreen3 = false;
    higherPage();
}

//縦横比監視つつ、クラスの付け替え
function updateAspectRatioClass() {
    let elem = document.getElementById('gameArea');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 縦横比が1より大きい場合は"Ver"クラスを追加
    if (existVar == false) {
        if (height > width) {
            elem.classList.add('Ver');
            existVar = true;
        }
    } else {
        if (height <= width) {
            elem.classList.remove('Ver');
            existVar = false;
        }
    }
}

// 初回実行
updateAspectRatioClass();

// ウィンドウのリサイズ時に縦横比を更新
window.addEventListener('resize', updateAspectRatioClass);


//引数と対応した麻雀のタイルを作り、それぞれのIDの場所に挿入するfunction
function makeTile(i, j, value) {
    let imgElem = document.createElement('img');
    imgElem.id = i + '-' + j;
    imgElem.src = imgArray[value];
    imgElem.alt = altImgMap.get(imgArray[value]);
    imgElem.setAttribute('onerror', "this.classList.add('NoImage');");
    imgElem.setAttribute('onclick', "clickTile(this)");

    let x = Math.floor(Math.random() * 20);
    imgElem.style.setProperty('--drop-range', (Math.floor(x / 2) + 1) / 10 * (x % 2 == 0 ? 1 : -1));
    document.getElementById('group' + i).appendChild(imgElem);
}


//盤面の変数fieldArray[][]を引数にタイル群を作るfunction
function makeField(fieldArray) {
    //gameArea内の全要素削除
    $('#gameArea').empty();
    //新しいgroupとTileの作成
    for (let i = 1; i < fieldArray.length - 1; i++) {
        //新しいgroupの作成
        let divElem = document.createElement('div');
        divElem.id = 'group' + i;
        document.getElementById('gameArea').appendChild(divElem);

        for (let j = 1; j < fieldArray[i].length - 1; j++) {
            //新しいTileの作成
            makeTile(i, j, fieldArray[i][j]);
        }
    }
}


//各牌の残量と照らし合わせランダムで置く牌を決定する
function choiceTile(fieldArray, notSelectedTile, tileLen) {
    //盤面の配列に挿入[][]
    for (let i = 1; i < fieldArray.length - 1; i++) {
        for (let j = 1; j < fieldArray[i].length - 1; j++) {
            //盤面配列fieldArray[][]に入る数値の決定
            let num = Math.floor(Math.random() * tileLen);      //0 ~ tileLen - 1の間ランダム
            fieldArray[i][j] = notSelectedTile[num];            //盤面配列fieldArray[][]に入る数値の決定
            notSelectedTile.splice(num, 1);                     //notSelectedTileから選ばれた数値を削除
            tileLen--;                                          //notSelectedTileの配列数を減らす
        }
    }
}


//タイル群の雛形作成
function createTileNum(value) {
    let tileRange = 0;
    if (value == 1) {
        tileRange = 18;
    } else if (value == 2) {
        tileRange = 34;
    } else if (value == 3) {
        tileRange = 42;
    }
    let allTiles = [];                                              /* 同じ牌を4つづつ置いた配列 */
    let allIndex = 0;                                               /* allTilesの添え字 */
    let index = 0;                                                  /* 4回繰り返すやつ */
    for (let tileIndex = 0; tileIndex < tileRange; tileIndex++) {   /* 同じ牌を4つづつ配列に格納 */
        for (index = 0; index < 4; index++) {
            allTiles[allIndex++] = tileIndex;
        }
    }
    return allTiles;
}


//盤面の決定
function createField(value) {                                               //value:難易度  1:easy 2:normal 3:hard
    //変数の初期化
    selectedCount = 0;
    fieldArray = [];                                                        //盤面の2次元配列用配列。外周や削除済みのところは-1
    //置ける牌の数調整（毎回初期化）
    notSelectedTile = createTileNum(value);
    tileLen = notSelectedTile.length;                                       //notSelectedTileの配列数
    //fieldArrayの初期化
    if (value == 1) {                                                       //難易度 easy:筒子(p)と索子(s)*4 の72牌 9(縦)*8(横)
        //fieldArrayの二次元配列化。とりあえず全てに-1を挿入(外枠含めて11(縦)*10(横))
        for (let i = 0; i < 10; i++) {
            fieldArray[i] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        }
        //gameAreaのCSS変数--group-count, --line-countの調整
        document.getElementById('gameArea').style.setProperty('--group-count', 8);
        document.getElementById('gameArea').style.setProperty('--line-count', 9);

    } else if (value == 2) {                                                //難易度 normal:筒子(p)索子(s)萬子(m)字牌(z)*4 の 136牌 17(縦)*8(横)
        //fieldArrayの二次元配列化。とりあえず全てに-1を挿入(外枠含めて19(縦)*10(横))
        for (let i = 0; i < 10; i++) {
            fieldArray[i] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        }
        //gameAreaのCSS変数--group-count, --line-countの調整
        document.getElementById('gameArea').style.setProperty('--group-count', 8);
        document.getElementById('gameArea').style.setProperty('--line-count', 17);

    } else if (value == 3) {                                                //難易度 hard:筒子(p)索子(s)萬子(m)字牌(7つ)(z)花(8つ)(f)*4 の 168牌 14(縦)*12(横)
        //fieldArrayの二次元配列化。とりあえず全てに-1を挿入(外枠含めて16(縦)*14(横))
        for (let i = 0; i < 14; i++) {
            fieldArray[i] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        }
        //gameAreaのCSS変数--group-count, --line-countの調整
        document.getElementById('gameArea').style.setProperty('--group-count', 12);
        document.getElementById('gameArea').style.setProperty('--line-count', 14);

    }
    //fieldArrayの中身のランダム生成
    choiceTile(fieldArray, notSelectedTile, tileLen);
    //空白Tile作成し、fieldArray[][]の数字に当てはまる画像を挿入する
    makeField(fieldArray);

    startTime = new Date();                                                 //開始時間を取得
}



//* class
//判定用クラス。外周や削除済みのところは-1
class BasicField {
    //隣り合っているかどうか
    static isNext(fromN, fromM, toN, toM) {
        for (let i = 0; i < 4; i++) {
            if (fromN + movePattern[i][0] == toN && fromM + movePattern[i][1] == toM) {
                return true;
            }
        }
        return false;
    }

    //一回も曲がらずに行けるかどうか
    static isSameLine(fromN, fromM, toN, toM) {
        if (fromN != toN && fromM != toM) {
            return false;
        }
        if (fromN == toN) {
            if (fromM < toM) {
                for (let i = fromM + 1; i < toM; i++) {
                    if (fieldArray[fromN][i] != -1) {
                        return false;
                    }
                }
            } else if (fromM > toM) {
                for (let i = fromM - 1; i > toM; i--) {
                    if (fieldArray[fromN][i] != -1) {
                        return false;
                    }
                }
            }
        } else if (fromM == toM) {
            if (fromN < toN) {
                for (let i = fromN + 1; i < toN; i++) {
                    if (fieldArray[i][fromM] != -1) {
                        return false;
                    }
                }
            } else if (fromN > toN) {
                for (let i = fromN - 1; i > toN; i--) {
                    if (fieldArray[i][fromM] != -1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //一回曲がって行けるかどうか
    static isOneTurn(fromN, fromM, toN, toM) {
        if (fromN == toN || fromM == toM) {
            return false;
        }
        let i;
        if (fromN < toN) {
            for (i = fromN + 1; i < toN; i++) {
                if (fieldArray[i][fromM] != -1) {
                    break;
                }
            }
            if (i == toN && fieldArray[i][fromM] == -1) {
                if (fromM < toM) {
                    for (i = fromM + 1; i < toM; i++) {
                        if (fieldArray[toN][i] != -1) {
                            break;
                        }
                    }
                } else if (fromM > toM) {
                    for (i = fromM - 1; i > toM; i--) {
                        if (fieldArray[toN][i] != -1) {
                            break;
                        }
                    }
                }
                if (i == toM) {
                    return true;
                }
            }
        } else if (fromN > toN) {
            for (i = fromN - 1; i > toN; i--) {
                if (fieldArray[i][fromM] != -1) {
                    break;
                }
            }
            if (i == toN && fieldArray[i][fromM] == -1) {
                if (fromM < toM) {
                    for (i = fromM + 1; i < toM; i++) {
                        if (fieldArray[toN][i] != -1) {
                            break;
                        }
                    }
                } else if (fromM > toM) {
                    for (i = fromM - 1; i > toM; i--) {
                        if (fieldArray[toN][i] != -1) {
                            break;
                        }
                    }
                }
                if (i == toM) {
                    return true;
                }
            }
        }

        if (fromM < toM) {
            for (i = fromM + 1; i < toM; i++) {
                if (fieldArray[fromN][i] != -1) {
                    break;
                }
            }
            if (i == toM && fieldArray[fromN][i] == -1) {
                if (fromN < toN) {
                    for (i = fromN + 1; i < toN; i++) {
                        if (fieldArray[i][toM] != -1) {
                            break;
                        }
                    }
                } else if (fromN > toN) {
                    for (i = fromN - 1; i > toN; i--) {
                        if (fieldArray[i][toM] != -1) {
                            break;
                        }
                    }
                }
                if (i == toN) {
                    return true;
                }
            }
        } else if (fromM > toM) {
            for (i = fromM - 1; i > toM; i--) {
                if (fieldArray[fromN][i] != -1) {
                    break;
                }
            }
            if (i == toM && fieldArray[fromN][i] == -1) {
                if (fromN < toN) {
                    for (i = fromN + 1; i < toN; i++) {
                        if (fieldArray[i][toM] != -1) {
                            break;
                        }
                    }
                } else if (fromN > toN) {
                    for (i = fromN - 1; i > toN; i--) {
                        if (fieldArray[i][toM] != -1) {
                            break;
                        }
                    }
                }
                if (i == toN) {
                    return true;
                }
            }
        }

        return false;
    }

    //二回曲がって行けるかどうか
    static isTwoTurn(fromN, fromM, toN, toM) {
        let canMoveRow = [];        //移動できる行があるか
        let canMoveCol = [];        //移動できる列があるか
        let canMoveFromN = [];      //fromNから縦に移動できるか
        let canMoveFromM = [];      //fromMから横に移動できるか
        let canMoveToN = [];        //toNから縦に移動できるか
        let canMoveToM = [];        //toMから横に移動できるか
        let flg = false;


        canMoveRow[0] = true;
        for (let i = 1; i < fieldArray.length - 1; i++) {
            if (fromN == i || toN == i) {
                canMoveRow[i] = false;
                continue;
            }
            for (let j = (fromM < toM ? fromM : toM); j < (fromM < toM ? toM : fromM); j++) {
                if (fieldArray[i][j] != -1) {
                    canMoveRow[i] = false;
                    break;
                }
            }
            if (canMoveRow[i] == undefined && fieldArray[i][(fromM < toM ? toM : fromM)] == -1) {
                canMoveRow[i] = true;
            } else if (canMoveRow[i] == undefined) {
                canMoveRow[i] = false;
            }
        }
        canMoveRow[fieldArray.length - 1] = true;

        canMoveFromN[fromN] = true;
        flg = true;
        for (let i = fromN + 1; i < canMoveRow.length; i++) {
            if (fieldArray[i][fromM] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveFromN[i] = true;
            } else {
                canMoveFromN[i] = false;
            }
        }
        flg = true;
        for (let i = fromN - 1; i >= 0; i--) {
            if (fieldArray[i][fromM] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveFromN[i] = true;
            } else {
                canMoveFromN[i] = false;
            }
        }

        canMoveToN[toN] = true;
        flg = true;
        for (let i = toN + 1; i < canMoveRow.length; i++) {
            if (fieldArray[i][toM] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveToN[i] = true;
            } else {
                canMoveToN[i] = false;
            }
        }
        flg = true;
        for (let i = toN - 1; i >= 0; i--) {
            if (fieldArray[i][toM] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveToN[i] = true;
            } else {
                canMoveToN[i] = false;
            }
        }

        for (let i = 0; i < canMoveRow.length; i++) {
            if (canMoveRow[i]) {
                if (canMoveFromN[i] && canMoveToN[i]) {
                    return true;
                }
            }
        }



        canMoveCol[0] = true;
        for (let i = 1; i < fieldArray[0].length - 1; i++) {
            if (fromM == i || toM == i) {
                canMoveCol[i] = false;
                continue;
            }
            for (let j = (fromN < toN ? fromN : toN); j < (fromN < toN ? toN : fromN); j++) {
                if (fieldArray[j][i] != -1) {
                    canMoveCol[i] = false;
                    break;
                }
            }
            if (canMoveCol[i] == undefined && fieldArray[(fromN < toN ? toN : fromN)][i] == -1) {
                canMoveCol[i] = true;
            } else if (canMoveCol[i] == undefined) {
                canMoveCol[i] = false;
            }
        }
        canMoveCol[fieldArray[0].length - 1] = true;


        canMoveFromM[fromM] = true;
        flg = true;
        for (let i = fromM + 1; i < canMoveCol.length; i++) {
            if (fieldArray[fromN][i] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveFromM[i] = true;
            } else {
                canMoveFromM[i] = false;
            }
        }
        flg = true;
        for (let i = fromM - 1; i >= 0; i--) {
            if (fieldArray[fromN][i] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveFromM[i] = true;
            } else {
                canMoveFromM[i] = false;
            }
        }

        canMoveToM[toM] = true;
        flg = true;
        for (let i = toM + 1; i < canMoveCol.length; i++) {
            if (fieldArray[toN][i] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveToM[i] = true;
            } else {
                canMoveToM[i] = false;
            }
        }
        flg = true;
        for (let i = toM - 1; i >= 0; i--) {
            if (fieldArray[toN][i] != -1) {
                flg = false;
            }
            if (flg) {
                canMoveToM[i] = true;
            } else {
                canMoveToM[i] = false;
            }
        }

        for (let i = 0; i < canMoveCol.length; i++) {
            if (canMoveCol[i]) {
                if (canMoveFromM[i] && canMoveToM[i]) {
                    return true;
                }
            }
        }

        return false;
    }


    //牌が消せるかどうかの判定
    static isMatch(fromN, fromM, toN, toM) {
        //牌が同じかどうか
        if (fieldArray[fromN][fromM] == fieldArray[toN][toM]) {
            //隣り合っているかどうか
            if (this.isNext(fromN, fromM, toN, toM)) {
                //消せるならtrueを返す
                return true;
            }

            //一回も曲がらずに行けるかどうか
            if (this.isSameLine(fromN, fromM, toN, toM)) {
                //消せるならtrueを返す
                return true;
            }

            //一回曲がって行けるかどうか
            if (this.isOneTurn(fromN, fromM, toN, toM)) {
                //消せるならtrueを返す
                return true;
            }

            //二回曲がって行けるかどうか
            if (this.isTwoTurn(fromN, fromM, toN, toM)) {
                //消せるならtrueを返す
                return true;
            }
        }

        //消せないならfalseを返す
        return false;
    }

    //牌を消す
    static deleteTile(fromN, fromM, toN, toM) {
        fieldArray[fromN][fromM] = -1;
        fieldArray[toN][toM] = -1;
        document.getElementById(fromN + '-' + fromM).alt = " ";
        document.getElementById(fromN + '-' + fromM).classList.add("DropTile");
        document.getElementById(toN + '-' + toM).alt = " ";
        document.getElementById(toN + '-' + toM).classList.add("DropTile");
    }

    //全ての牌が消えたかどうかの判定
    static isClear() {
        for (let i = 1; i < fieldArray.length - 1; i++) {
            for (let j = 1; j < fieldArray[i].length - 1; j++) {
                if (fieldArray[i][j] != -1) {
                    return false;
                }
            }
        }
        return true;
    }
}


//* onclick用の function(){ }; または addEventListener('click', function(){ });
//難易度選択してないとStartボタンが押せないようにしておく
document.getElementById('start').disabled = true;               //ボタン無効化

//難易度 easy:筒子(p)と索子(s)*4 の72牌 9(縦)*8(横)
function selectEasy(thisElem) {
    if (choiceDifficulty == 0) {
        document.getElementById('start').disabled = false;      //ボタン有効化
        choiceDifficulty = 1;
        thisElem.classList.add('Active');
        makeArrangedEasy();
    } else if (choiceDifficulty != 1) {
        document.getElementById((choiceDifficulty == 2) ? 'normal' : 'hard').classList.remove('Active');
        choiceDifficulty = 1;
        thisElem.classList.add('Active');
        makeArrangedEasy();
    }
}

//難易度 normal:筒子(p)索子(s)萬子(m)字牌(z)*4 の 136牌 17(縦)*8(横)
function selectNormal(thisElem) {
    if (choiceDifficulty == 0) {
        document.getElementById('start').disabled = false;      //ボタン有効化
        choiceDifficulty = 2;
        thisElem.classList.add('Active');
        makeArrangedNormal();
    } else if (choiceDifficulty != 2) {
        document.getElementById((choiceDifficulty == 1) ? 'easy' : 'hard').classList.remove('Active');
        choiceDifficulty = 2;
        thisElem.classList.add('Active');
        makeArrangedNormal();
    }
}

//難易度 hard:筒子(p)索子(s)萬子(m)字牌(7つ)(z)花(8つ)(f)*4 の 168牌 14(縦)*12(横)
function selectHard(thisElem) {
    if (choiceDifficulty == 0) {
        document.getElementById('start').disabled = false;      //ボタン有効化
        choiceDifficulty = 3;
        thisElem.classList.add('Active');
        makeArrangedHard();
    } else if (choiceDifficulty != 3) {
        document.getElementById((choiceDifficulty == 1) ? 'easy' : 'normal').classList.remove('Active');
        choiceDifficulty = 3;
        thisElem.classList.add('Active');
        makeArrangedHard();
    }
}

function clickStart() {
    if (choiceDifficulty != 0) {
        createField(choiceDifficulty);
        document.getElementById('screen1').classList.remove('Active');
        activeScreen1 = false;
    }
}

//TODO Restart確認へのonclick遷移用
function clickHamburgerMenu(value) {

    document.getElementById('hamburger').classList.remove('Active');
    choiceHamburgerMenu = value;

    //onclickが付いているか確認
    /*if (document.getElementById('screen1').getAttribute('onclick') == 'backFromHelp()') {
        //onclickを外す
        document.getElementById('screen1').removeAttribute('onclick');
        onclickScreen1ForHamburgerMenuFlg = true;
    } else {
        onclickScreen1ForHamburgerMenuFlg = false;
    }

    //screen1にActiveクラスを付与
    if (!document.getElementById('screen1').classList.contains('Active')) {
        document.getElementById('screen1').classList.add('Active');
        activeScreen1ForHamburgerMenuFlg = false;
    } else {
        activeScreen1ForHamburgerMenuFlg = true;
        beforeHamburgerMenuElem = document.getElementById('screen1').children;
    }*/

    //TODO Restart確認ページ作成
    createCheckPage();
}

//TODO Restart確認からのYesのonclick
function restart() {
    activeScreen3 = false;
    activeScreen2 = false;
    createDifficultyPage();
}

//TODO Restart確認からのNoのonclick
function notRestart() {
    //onclickを付与
    /*if (onclickScreen1ForHamburgerMenuFlg) {
        document.getElementById('screen2').setAttribute('onclick', 'backFromHelp()');
        //screen2には常に'onclick', 'backFromHelp()'を付与する
    }

    //screen1からActiveクラスを削除
    if (activeScreen1ForHamburgerMenuFlg) {
        console.log(beforeHamburgerMenuElem);
        document.getElementById('screen2').appendChild(beforeHamburgerMenuElem);
    } else {
        document.getElementById('screen2').classList.remove('Active');
    }*/
    activeScreen3 = false;
    higherPage();
}

//TODO ToHome確認からのYesのonclick
function toHome() {
    //Home画面に戻る
}

//TODO ToHome確認からのNoのonclick
function notToHome() {

    //onclickを付与
    /*if (onclickScreen2ForHamburgerMenuFlg) {//?
        document.getElementById('screen2').setAttribute('onclick', 'backFromHelp()');
        //TODO screen2には常に'onclick', 'backFromHelp()'を付与する
    }

    //screen1からActiveクラスを削除
    if (activeScreen1ForHamburgerMenuFlg) {
        //TODO 外す
        document.getElementById('screen1').appendChild(beforeHamburgerMenuElem);
    } else {
        document.getElementById('screen1').classList.remove('Active');
    }*/
    activeScreen3 = false;
    higherPage();
}

//TODO helpページクリック時のonclick
function clickHelp() {
    document.getElementById('hamburger').classList.remove('Active');
    //let activeScreen1ForHelpFlg = false;        //screen1がActiveクラスを持っているかどうかのフラグ
    //let beforeHelpElem = null;  //Help以前のページ保持用変数
    /*if (!document.getElementById('screen2').classList.contains('Active')) {
        document.getElementById('screen2').classList.add('Active');
        activeScreen1ForHelpFlg = false;
    } else {
        activeScreen1ForHelpFlg = true;
        beforeHelpElem = document.getElementById('screen1').children;
        //TODO getElementById('screen1').childrenのやり直し　三層構造にする

        //TODO ココ

        //TODO ココ
    }

    //TODO helpページ作成
    createHelpPage();

    // screen1 に　onclick を付与
    document.getElementById('screen2').setAttribute('onclick', 'backFromHelp()');*/
    if (activeScreen2 == true && activeScreen3 == false) {
        backFromHelp();
    } else {
        //TODO helpページ作成
        createHelpPage();
    }
}

//TODO helpページからどこかを押した時の処理（helpページから戻る）
function backFromHelp() {
    //document.getElementById('screen1').removeAttribute('onclick');
    /*if (activeScreen1ForHelpFlg) {
        //document.getElementById('screen1').appendChild(beforeHelpElem);
    } else {
        document.getElementById('screen2').classList.remove('Active');
    }*/
    activeScreen2 = false;
    higherPage();
}

//TODO helpページからRestart確認へ遷移した後の選択によってhelpメニューに戻るかRestartする場合はonclick外す

//img（牌）を押した時の処理
function clickTile(thisElem) {
    let idParts = thisElem.id.split('-');                       // idを'-'で分割
    if (selectedCount == 0) {
        fromN = parseInt(idParts[0]);
        fromM = parseInt(idParts[1]);
        document.getElementById(fromN + '-' + fromM).classList.add("Select");
        selectedCount++;
    } else if (selectedCount == 1) {
        toN = parseInt(idParts[0]);
        toM = parseInt(idParts[1]);
        selectedCount++;
        if (fromN == toN && fromM == toM) {
            selectedCount = 0;
            document.getElementById(fromN + '-' + fromM).classList.remove("Select");
        }
    }
    if (selectedCount == 2) {
        if (fromN == toN && fromM == toM) {
            selectedCount = 0;
        } else {
            selectedCount = 0;
            document.getElementById(fromN + '-' + fromM).classList.remove("Select");
            //牌が消せるかどうかの判定
            if (BasicField.isMatch(fromN, fromM, toN, toM)) {
                //消せるなら消す
                BasicField.deleteTile(fromN, fromM, toN, toM);
                //全ての牌が消えたかどうかの判定
                if (BasicField.isClear()) {
                    //全ての牌が消えたらクリア
                    clearTime = new Date() - startTime;         //クリア時間を取得
                    createClearPage();
                }
            }
        }
    }
}


