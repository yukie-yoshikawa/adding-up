'use strict';
console.log("---- start -----");
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();  // key:都道府県 value:集計データのオブジェクト
rl.on('line', (lineString) => {
    // console.log(lineString);
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecuture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecuture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 += popu;
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecuture, value);
    }
});
rl.resume();
rl.on('close', () => {
    // すべての行を読み終わった際に呼び出される
    // console.log("---- 都道府県ごとの集計 -----");
    // console.log(map);
    // データの集計
    console.log("---- 都道府県ごとの変化率 -----");
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    // console.log(map);
    // データの並び替え
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStaring = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率' + pair[1].change;
    });
    console.log("---- 2010年から2015年にかけて15～19歳の人口が増えた割合のと都道府県のランキング -----");
    console.log(rankingStaring);
    console.log("---- end -----");
});
