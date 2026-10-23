// Incremental annotations; original destination records/windows are unchanged.
export const SEASON_REFERENCE_DATE='2026-10-21';
const extra={
 'kyoto-autumn':{kind:'一般季节参考',conditional:false,url:'https://www.japan.travel/en/guide/november/',publisher:'日本国家旅游局 JNTO',published:null,note:'一般指南支持京都十一月中下旬秋色。日期窗口沿用原产品，不是当年红叶预报；开放与预约仍需核对。'},
 'beijing-autumn':{kind:'2026 年资料',conditional:false,url:'https://english.beijing.gov.cn/travellinginbeijing/events/202610/t20261016_4904599.html',publisher:'北京市政府英文门户',published:'2026-10-16',note:'不同公园观赏期不同；原产品的参考窗口不是全城每天的秋色保证。跨年使用时属于历史参考。'},
 harbin:{kind:'2025–2026 历史冬季资料',conditional:true,url:'https://www.hlj.gov.cn/hlj/c107858/202511/c00_31886374.shtml',publisher:'黑龙江省政府门户',published:'2025-11-06',note:'历史资料不能确认所选未来冬季的开园、冰雪、天气或节庆运营，包括 2026–2027 和之后冬季。'}
};
export function seasonalEvidence(destination,start,end){
 const item=extra[destination.id],nextYear=item&&destination.id==='beijing-autumn'&&!start.startsWith('2026-');
 return {kind:item?.kind||'沿用原公开旅行目录',conditional:!!(item?.conditional||nextYear),publisher:item?.publisher||'原目的地来源',url:item?.url||destination.seasonSource||null,published:item?.published||null,checkedAt:item?SEASON_REFERENCE_DATE:null,window:destination.windows,season:destination.season,note:nextYear?'复用 2026 年资料；所选年份情况未确认。'+item.note:item?.note||'未在本次参赛增量中逐条重新核实。沿用原产品季节规则，具体天气、开放和预约需要另查。',interval:{start,end},rule:'沿用原筛选：至少 min(3,总天数) 天落在参考窗口内，并满足最短天数；不是整段天气保证。'};
}

export const hasSeasonAnnotation=id=>Object.hasOwn(extra,id);
