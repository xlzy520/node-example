/**
 * 方法一、简易版
 */
function PYSort(source) {
  if (!String.prototype.localeCompare) return null;
  
  const letters = "*abcdefghjklmnopqrstwxyz".split(''),
    zh_cn = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split(''),
    totalList = [];
  
  for (let i = 0; i < letters.length; i++) {
    const item = {
      name: letters[i],
      list:[]
    };
    
    for (let val of source) {
      if ((!zh_cn[i-1] || zh_cn[i-1].localeCompare(val) <= 0) && val.localeCompare(zh_cn[i]) == -1) {
        item.list.push(val);
      }
    }
    
    if ( item.list.length) {
      item.list.sort(function(a,b) {
        return a.localeCompare(b);
      });
      totalList.push(item);
    }
  }
  return totalList;
}

const data =  ["汪桂英", "贺洋", "顾刚", "仇磊", "傅静", "于平", "萧娜", "陆秀英", "马涛", "韩敏", "杨杰",
  "顾秀兰", "彭勇", "吴明", "熊洋", "方刚", "任勇", "姜刚", "戴涛", "尹强", "金涛", "袁磊", "方艳", "文艳",
  "丁敏", "秦刚", "郑秀兰", "彭明", "陈敏", "杜敏", "阎明", "张娟", "吕平", "吴艳", "苏强", "周明", "毛娟",
  "龚平", "傅秀兰", "尹军", "易艳", "何磊", "侯桂英", "袁霞", "史杰", "杨明", "谭芳", "史超", "卢霞", "贺平",
  "雷杰", "金秀英", "谢芳", "顾磊", "郭勇", "沈洋", "徐刚", "侯芳", "尹杰", "范艳"]
// console.log(PYSort(data));

/**
 * 处理部分多音字
 * @type {(function(*=, *, *=): *)|*}
 */
var Sort = require('sort')
var Array =[
  {Sn: 12,Nick:"B-DB-401(张总办公室)"},
  {Sn: 12,Nick:"B-DB-301(大会议室)"},
  {Sn: 12,Nick:"C-DB-103(II集电表)"},
  {Sn: 12,Nick:"C-DB-101(II集电表)"},
  {Sn: 12,Nick:"C-DB-102(II集电表)"},
  {Sn: 12,Nick:"D-DB-205"},
  {Sn: 15,Nick:"小会议室测试"},
  {Sn: 16,Nick:"空调LQ"},
  {Sn: 12,Nick:"空调A07"},
  {Sn: 12,Nick:"空调A07B"},
  {Sn: 12,Nick:"互感器"},];

var Result = Sort(Array,'Nick',{
  EnglishBeforeChinese:true,
  EnglishUp:false,
});



var array =[
  "B-DB-401","B-DB-301","C-DB-103","2",
  "C-DB-101","C-DB-102","D-DB-205","20",
  "小会议室","空调LQ","空调A07","520",
  "空调A07B","互感器","沈从文","阿哎呀","汪桂英", "贺洋", "顾刚", "姚磊", "傅静", "于平", "萧娜", "陆秀英", "马涛", "韩敏", "杨杰",
  "顾秀兰", "彭勇", "吴明", "熊洋", "方刚", "任勇", "姜刚", "戴涛", "尹强", "金涛", "袁磊", "方艳", "文艳",
  "丁敏", "秦刚", "郑秀兰", "彭明", "陈敏", "杜敏", "阎明", "张娟", "吕平", "吴艳", "苏强", "周明", "毛娟",
  "龚平", "傅秀兰", "尹军", "易艳", "何磊", "侯桂英", "袁霞", "史杰", "杨明", "谭芳", "史超", "卢霞", "贺平",
  "雷杰", "金秀英", "谢芳", "顾磊", "郭勇", "沈洋", "徐刚", "侯芳", "尹杰", "范艳","仇哈哈哈","长沙"
];

var result = Sort(array,null,{
  EnglishBeforeChinese:false,
  EnglishUp:true,
});

console.log(result)
