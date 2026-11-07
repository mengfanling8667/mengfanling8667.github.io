// Original interactive adaptations. Source mappings and limits: ../docs/outside-audit.json
export const LEGACY_OUTSIDE_EVENTS = [
  {
    "id": "lg-o-bank",
    "title": "失去意义的钞票",
    "text": "银行的点钞机旁堆着钞票，职员柜台下面却压着紧急储物箱。现金和箱子的重量差不多，该带走哪一种东西？",
    "scene": "outside",
    "choices": [
      {
        "label": "撬开职员储物箱",
        "result": "压住箱子的钢架松开了，里面的食品包装仍然完整。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "canned": 3
        },
        "chance": 0.65,
        "chanceByItem": {
          "crowbar": 0.25,
          "tools": 0.15
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "钢架压得太紧，你只好在手受伤前退开。"
      },
      {
        "label": "清空台面的手提箱",
        "result": "纸钞被留在风里，结实的箱子终于能装一些真正有用的东西。",
        "effects": {},
        "items": {
          "suitcase": 1,
          "padlock": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-bar",
    "title": "霓虹还亮着",
    "text": "酒吧里最后一截霓虹照着牌桌。吧台后的液体标签模糊，桌上的游戏却还没有结束。",
    "scene": "outside",
    "choices": [
      {
        "label": "搜索吧台的密封食品",
        "result": "没有找到期待中的酒水，储物柜里的食物倒还值得带回去。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "canned": 1,
          "dirty_water": 1
        }
      },
      {
        "label": "收好牌桌上的游戏",
        "result": "纸牌和棋子回到了盒子里，它们也许能救救地下室里漫长的夜。",
        "effects": {
          "mood": 1
        },
        "items": {
          "cards": 1,
          "checkers": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-bowling",
    "title": "球道尽头的瓶子",
    "text": "熟悉的保龄球馆里，瓶子取代了球道尽头的球瓶。员工室的门敞着，门前横着倾倒的计分架。",
    "scene": "outside",
    "choices": [
      {
        "label": "沿球道走到尽头",
        "result": "那些瓶子并不是恶作剧，里面的水仍然封得好好的。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 2
        }
      },
      {
        "label": "越过计分架检查员工室",
        "result": "桌上的收音机被软垫护住，你把它从沉默里抱了出来。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "radio": 1
        },
        "chance": 0.6,
        "chanceByItem": {
          "flashlight": 0.15,
          "scout_book": 0.1
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failItems": {
          "checkers": 1
        },
        "failResult": "架子挡住了去路，只能拿走休息区边缘的一盒棋。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-bus-station",
    "title": "没有终点的行李",
    "text": "长途车站的候车厅堆着没人认领的行李。运动队的饮水箱贴着褪色名单，一叠旅行包堵住了疏散出口。",
    "scene": "outside",
    "choices": [
      {
        "label": "从饮水箱取补给",
        "result": "瓶盖的封条还在，名单却再也找不到自己的主人。",
        "effects": {
          "mood": -1
        },
        "items": {
          "water": 2,
          "energy_bar": 1
        }
      },
      {
        "label": "重新整理行李通道",
        "result": "你先让出口恢复通行，随后从遗留的小箱子里找到了可以带走的东西。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "suitcase": 1,
          "map": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-church",
    "title": "钟楼里的危险圣物",
    "text": "教堂里的人围着钟楼下的奇怪金属残骸举行仪式。他们不愿离开，却把普通的罐头推到一边。",
    "scene": "outside",
    "choices": [
      {
        "label": "只在门边交换罐头",
        "result": "你没有走近残骸，几瓶水换来了他们不想再吃的食物。",
        "effects": {
          "mood": -1
        },
        "items": {
          "water": -1,
          "canned": 2
        }
      },
      {
        "label": "劝大家远离钟楼",
        "result": "有人肯跟着挪到侧门，还把用于照路的手电交给了你。",
        "effects": {
          "stamina": -1,
          "mood": 1
        },
        "items": {
          "flashlight": 1
        },
        "chance": 0.6,
        "failEffects": {
          "mood": -2
        },
        "failResult": "劝说淹没在仪式的喊声里，你只能先离开。"
      }
    ],
    "cooldown": 13,
    "types": [
      "nuclear"
    ]
  },
  {
    "id": "lg-o-cinema",
    "title": "末场电影",
    "text": "影院顶棚塌了一角，最后一排座位下面露出装饮料的袋子。售票室只剩门框，上面的锁却还插着钥匙。",
    "scene": "outside",
    "choices": [
      {
        "label": "照着过道寻找完整的瓶子",
        "result": "你跨过碎椅子，把没有开封的饮水从黑暗里拿了出来。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 2,
          "cards": 1
        },
        "chance": 0.75,
        "chanceByItem": {
          "flashlight": 0.2
        },
        "failEffects": {
          "health": -1,
          "stamina": -1
        },
        "failItems": {
          "water": 1
        },
        "failResult": "脚踝被椅脚绊了一下，只来得及拿走最外侧的一瓶。"
      },
      {
        "label": "拆下售票室的完整门锁",
        "result": "门后的岗位已经消失，这把锁还能守住别的家。",
        "effects": {},
        "items": {
          "padlock": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-city-hall",
    "title": "半座市政厅",
    "text": "市政厅一半是空洞，一半仍保持办公时的模样。秘书室传来收音机的沙沙声，楼上的急救标记就在裂缝另一端。",
    "scene": "outside",
    "choices": [
      {
        "label": "先到秘书室取收音机",
        "result": "桌面上的灰尘被手掌擦开，收音机终于有了新的听众。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "radio": 1
        }
      },
      {
        "label": "沿牢固墙边去找急救用品",
        "result": "急救箱还放在办公桌上，你用绳索固定住晃动的扶栏再返回。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "medkit": 1
        },
        "chance": 0.55,
        "chanceByItem": {
          "rope": 0.25,
          "helmet": 0.15
        },
        "failEffects": {
          "health": -2,
          "stamina": -2
        },
        "failResult": "楼板突然沉了一下，你赶在裂缝扩大前退出楼梯间。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-docks",
    "title": "潮水退过的货仓",
    "text": "海水在仓库墙上留下一条黑线。高层货架的食品箱还干燥，低处的金属箱则有一半浸在水里。",
    "scene": "outside",
    "choices": [
      {
        "label": "只搬走高处的食品箱",
        "result": "外箱被盐水泡皱了，里面的罐头却仍密封着。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "canned": 3
        }
      },
      {
        "label": "用绳索拖出低处的金属箱",
        "result": "箱子里是封好的弹药，绳索也让你不必踏进看不见底的水里。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "ammo": 1
        },
        "requiresItem": "rope",
        "chance": 0.8,
        "failEffects": {
          "temp": -2,
          "stamina": -2
        },
        "failResult": "箱子卡住了，你收回绳子，尽量让衣服保持干燥。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-ethan",
    "title": "没来得及道歉的门口",
    "text": "这户人家的孩子曾与阿野闹过别扭。约好的家长见面被灾难打断，门口至今没有回应，餐厅里却还摆着没收好的东西。",
    "scene": "outside",
    "choices": [
      {
        "label": "留下道歉纸条，再清点可带走的补给",
        "result": "字条被压在门缝里，你只拿了已经散落在过道的食物。",
        "effects": {
          "mood": 1,
          "stamina": -1
        },
        "items": {
          "canned": 1,
          "water": 1
        },
        "requiresItem": "notebook"
      },
      {
        "label": "先整理孩子们的游戏角",
        "result": "成套的小棋子被重新装好，你希望有一天能亲手还给这里的主人。",
        "effects": {
          "mood": -1
        },
        "items": {
          "checkers": 1,
          "cards": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-fire-station",
    "title": "改过徽记的消防站",
    "text": "消防站仍有人值班，头盔却被涂上陌生的图案。他们急着赶你离开，车库水管旁和正门工具架都还留着装备。",
    "scene": "outside",
    "choices": [
      {
        "label": "请他们帮忙接一些水",
        "result": "对方不愿解释站里发生了什么，但准许你在水管边装好几瓶水。",
        "effects": {},
        "items": {
          "water": 3
        },
        "flag": "lg_fireStationSeen"
      },
      {
        "label": "询问能否带走门旁的旧斧头",
        "result": "那把斧头被当成了多余的摆设，你带着它离开，没再追问墙上的标语。",
        "effects": {
          "mood": -1
        },
        "items": {
          "axe": 1
        },
        "flag": "lg_fireStationSeen"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-gas-station",
    "title": "加油站第二次爆炸以后",
    "text": "油泵和地面都变了形，现金亭却奇迹般卡在两辆车之间。远处的配送车上还看得出食品公司的图案。",
    "scene": "outside",
    "choices": [
      {
        "label": "从侧面打开配送车",
        "result": "车厢没有剩下多少东西，几只罐头仍被固定在车角。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "canned": 2
        },
        "chance": 0.6,
        "chanceByItem": {
          "crowbar": 0.25
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "车门被撞进框里，你放弃了继续用力。"
      },
      {
        "label": "查看现金亭的抽屉",
        "result": "纸币已经没用了，抽屉里的牌和折叠地图倒还可以带回去。",
        "effects": {},
        "items": {
          "map": 1,
          "cards": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-hospital",
    "title": "撤离后的住院部",
    "text": "大部分病房已经撤空，急救柜上仍挂着完整的封签。走廊尽头的防护面具被压在一架倾倒的床下。",
    "scene": "outside",
    "choices": [
      {
        "label": "小心取下急救柜",
        "result": "你把完整封装与破损药品分开，只带走了能确认完好的部分。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "medkit": 1,
          "bandage": 1
        }
      },
      {
        "label": "抬起床架找防护装备",
        "result": "面具脱离了床架，消毒用品也从床侧袋里掉了出来。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "mask": 1,
          "antiseptic": 1
        },
        "chance": 0.6,
        "chanceByItem": {
          "tools": 0.15,
          "helmet": 0.1
        },
        "failEffects": {
          "health": -2,
          "stamina": -2
        },
        "failItems": {
          "bandage": 1
        },
        "failResult": "床轮突然滑动，手臂被擦伤，只能带走外侧的一卷绷带。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-hotel",
    "title": "旅馆里未退的房间",
    "text": "旅馆大厅散着不同城市的行李牌。幸存客房里有人安静地下棋，大堂角落则躺着一只装满手电的旅行包。",
    "scene": "outside",
    "choices": [
      {
        "label": "礼貌问候下棋的人",
        "result": "他们说自己还有别的棋局，愿意把多出的一套留给你。",
        "effects": {
          "mood": 1
        },
        "items": {
          "checkers": 1
        }
      },
      {
        "label": "逐一检查旅行包里的手电",
        "result": "多数开关只带来沉默，终于有一束光亮在墙上。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "flashlight": 1,
          "water": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-library",
    "title": "比小说更实用的一本书",
    "text": "图书馆只剩下几排结实的木架。服务台后放着午餐盒，户外知识书架被塌下的天花板遮住一角。",
    "scene": "outside",
    "choices": [
      {
        "label": "把实用手册从书架里抽出来",
        "result": "几页边角已经焦黑，关键的图解仍然清楚。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "scout_book": 1
        }
      },
      {
        "label": "先清理服务台的储物区",
        "result": "午餐和备用饮水都还在，不必再翻动摇摇欲坠的书架。",
        "effects": {},
        "items": {
          "canned": 1,
          "water": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-home",
    "title": "自家花园的残骸",
    "text": "你终于有机会看看避难所上方的家。花园工具房只剩一扇门，野餐桌下面露出家人熟悉的包装袋。",
    "scene": "outside",
    "choices": [
      {
        "label": "绕到工具房门背后",
        "result": "原来挂在门后的工具躲过了冲击，你握住木柄时想起一个普通的周末。",
        "effects": {
          "mood": -1
        },
        "items": {
          "axe": 1
        }
      },
      {
        "label": "收拾野餐桌下的旧物",
        "result": "泥土被一点点拨开，留下的食品和手册比回忆更沉。",
        "effects": {
          "stamina": -1,
          "mood": -1
        },
        "items": {
          "scout_book": 1,
          "canned": 1,
          "water": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-metro",
    "title": "用子弹标价的地铁站",
    "text": "地下站台住着一群不肯多说话的人。他们把子弹当作交易凭据，准许来客购买物资，却不许碰挡住入口的行李墙。",
    "scene": "outside",
    "choices": [
      {
        "label": "按他们的规矩交易",
        "result": "几盒封好的食品和水被推过柜台，双方都没有多问。",
        "effects": {},
        "items": {
          "ammo": -1,
          "canned": 2,
          "water": 2
        }
      },
      {
        "label": "帮忙整理堵住通道的行李",
        "result": "你没有擅自取东西，站台的人便把腾出来的一只空手提箱送给了你。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "suitcase": 1
        },
        "chance": 0.7,
        "chanceByItem": {
          "flashlight": 0.1
        },
        "failEffects": {
          "stamina": -2,
          "mood": -1
        },
        "failResult": "行李墙太容易松动，他们挥手让你停下，仍准许你离开。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-monkey",
    "title": "带路的陌生小动物",
    "text": "一只灵巧的小动物始终走在你前面。每当你停下，它就回过头等候；小路尽头似乎埋着一扇旧地下室门。",
    "scene": "outside",
    "choices": [
      {
        "label": "保持距离跟着它走",
        "result": "门后有一只保存完好的急救箱，小动物已经悄悄离开。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "medkit": 1
        },
        "chance": 0.65,
        "chanceByItem": {
          "scout_book": 0.15
        },
        "chanceByFlag": {
          "lg_dog": 0.1
        },
        "failEffects": {
          "stamina": -2,
          "mood": -1
        },
        "failResult": "你绕回了原来的路口，已经分不清它去了哪个方向。"
      },
      {
        "label": "在路口停下，不再追赶",
        "result": "你记住了地形，没有继续偏离原来的返程路。",
        "effects": {
          "stamina": -1
        },
        "items": {}
      }
    ],
    "cooldown": 13,
    "types": [
      "nuclear"
    ]
  },
  {
    "id": "lg-o-museum",
    "title": "展柜背后的应急柜",
    "text": "博物馆的展签都蒙着灰，一间完整展厅后还留着防护装备和维修柜。墙上那些旧画暂时不能解决眼前的问题。",
    "scene": "outside",
    "choices": [
      {
        "label": "按疏散图寻找应急储备",
        "result": "逃生标记把你引到员工区，里面的饮水和面具还没有被翻动。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "mask": 1,
          "water": 1
        },
        "chance": 0.75,
        "chanceByItem": {
          "map": 0.1,
          "flashlight": 0.1
        },
        "failEffects": {
          "stamina": -2
        },
        "failItems": {
          "water": 1
        },
        "failResult": "塌墙挡住了最后一段路，只在外侧找到一瓶水。"
      },
      {
        "label": "整理展厅外散落的小物件",
        "result": "一把小锁和封好的弹药落在维修柜旁，来处已经无从追问。",
        "effects": {},
        "items": {
          "padlock": 1,
          "ammo": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-neighbourhood",
    "title": "仍会发光的冰箱",
    "text": "旧街区的庆典彩带还挂在残墙上。一只冰箱横在邻居的草地里，门缝有微弱亮光，像仍在等谁回来开门。",
    "scene": "outside",
    "choices": [
      {
        "label": "先检查插线，再打开冰箱",
        "result": "古怪的光来自一支照明棒，里层罐头的封口仍然完好。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "canned": 2,
          "candles": 1
        },
        "requiresItem": "screwdriver"
      },
      {
        "label": "只搜索门前没被压住的物资",
        "result": "外廊里的食品袋与饮水被雨棚挡住，你不必靠近那扇发亮的门。",
        "effects": {},
        "items": {
          "canned": 1,
          "water": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-parking",
    "title": "停车场上的野餐桌",
    "text": "停车场像一座金属坟场。烧黑的野餐桌下有封装饮水，远处车尾厢里露出旅行箱的皮角。",
    "scene": "outside",
    "choices": [
      {
        "label": "拿走野餐桌下的完整补给",
        "result": "桌板虽然烧坏，下面的水和食物仍有几份完好。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 1,
          "canned": 1
        }
      },
      {
        "label": "打开变形的车尾厢",
        "result": "你从夹缝中拖出一只空箱和驾驶员留下的工具。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "suitcase": 1,
          "axe": 1
        },
        "chance": 0.55,
        "chanceByItem": {
          "crowbar": 0.25
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "弹回的尾门差点夹住手，只好在取出东西之前退开。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-police",
    "title": "自称仍在值班的人",
    "text": "警局里的人展示着制服与徽章，墙上的地图却满是争夺其他营地的箭头。他们突然争执起来，把一件装备扔到了门外。",
    "scene": "outside",
    "choices": [
      {
        "label": "只询问可安全通行的街道",
        "result": "对方不耐烦地递来地图和少量水，像是希望你赶快离开。",
        "effects": {
          "mood": -1
        },
        "items": {
          "map": 1,
          "water": 1
        },
        "flag": "lg_policeStationSeen"
      },
      {
        "label": "捡起被扔到门外的旧步枪",
        "result": "你没有加入争论，趁他们无暇看门时收起武器并退出街口。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "rifle": 1
        },
        "chance": 0.65,
        "flag": "lg_policeStationSeen",
        "failEffects": {
          "stamina": -2,
          "mood": -1
        },
        "failResult": "门里的人注意到了动静，你只能不带武器离开。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-scavenger-bag",
    "title": "别人放下的背包",
    "text": "另一群搜集者正在废墟里分头工作，他们的备用背包堆在你途经的墙边。没有人正在看守。",
    "scene": "outside",
    "choices": [
      {
        "label": "趁他们背过身拿走一只包",
        "result": "包里的食品和急救用品很实用，回去的路却让你不敢回头。",
        "effects": {
          "mood": -2,
          "stamina": -1
        },
        "items": {
          "canned": 1,
          "bandage": 1
        },
        "chance": 0.65,
        "chanceByFlag": {
          "lg_dog": 0.1
        },
        "failEffects": {
          "health": -1,
          "stamina": -2,
          "mood": -2
        },
        "failResult": "对方发现你伸手，只能空手跑出他们的街区。",
        "setFlags": [
          "lg_stoleFromScavengers"
        ]
      },
      {
        "label": "出声询问能否交易",
        "result": "他们紧绷的肩膀慢慢放松，愿意用水换一份食物。",
        "effects": {
          "mood": 1
        },
        "items": {
          "canned": -1,
          "water": 2
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-school",
    "title": "童军教室",
    "text": "学校地下室的门牌还写着社团名称。地理教室散着地图，体育办公室的玻璃后则挂着老式防护面具。",
    "scene": "outside",
    "choices": [
      {
        "label": "到社团教室取实用手册",
        "result": "成箱的手册被搬得七零八落，但仍有一本书页齐全。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "scout_book": 1,
          "map": 1
        }
      },
      {
        "label": "查看体育办公室的防护装备",
        "result": "你避开倒下的器材，拿到了仍能合紧的面具。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "mask": 1
        },
        "chance": 0.7,
        "chanceByItem": {
          "flashlight": 0.15
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "器材把门堵住了，只好回到走廊。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-spaceship",
    "title": "从天上落下的货舱",
    "text": "一团金属残骸压在刚找到的小店上方。你看不懂舱体的标记，空头盔和软包装却把一些补给护在了碎片之间。",
    "scene": "outside",
    "choices": [
      {
        "label": "用工具拨开逐渐冷却的外壳",
        "result": "食品被软包装牢牢裹住，一只小玩具也被完整地保护下来。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "canned": 1,
          "water": 1,
          "teddy": 1
        },
        "requiresItem": "tools",
        "chance": 0.8,
        "failEffects": {
          "health": -2,
          "stamina": -2
        },
        "failResult": "一片外壳突然滑动，你不得不先收手。"
      },
      {
        "label": "只取散在边缘的容器",
        "result": "你没有靠近冒烟的接缝，仍从空头盔内找到了一点饮水。",
        "effects": {},
        "items": {
          "water": 1,
          "socks": 1
        }
      }
    ],
    "cooldown": 13,
    "types": [
      "nuclear"
    ]
  },
  {
    "id": "lg-o-store",
    "title": "商店里最后一个商品架",
    "text": "常去的商店只剩一段商品架，食物区已经空了。货架后方的应急药柜和角落的纸箱都还没有完全露出来。",
    "scene": "outside",
    "choices": [
      {
        "label": "先检查急救柜",
        "result": "你把碎包装清到一边，药柜里的基础用品还能使用。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "medkit": 1
        }
      },
      {
        "label": "翻找没有被雨淋湿的纸箱",
        "result": "纸箱里没有想象中的大餐，却有一把手电和一小盒驱虫用品。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "flashlight": 1,
          "bug_spray": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-supermarket",
    "title": "被占据的超市",
    "text": "超市门口挂着掠夺者的标记。大部分人刚离开，饮水区和员工储藏室之间却只有一条暴露在哨位下的通道。",
    "scene": "outside",
    "choices": [
      {
        "label": "沿货架阴影去取饮水",
        "result": "你装好了水，并在脚步声接近前退回侧门。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "water": 3
        },
        "chance": 0.5,
        "chanceByItem": {
          "map": 0.1,
          "rifle": 0.2,
          "axe": 0.14
        },
        "chanceByFlag": {
          "lg_dog": 0.15
        },
        "failEffects": {
          "health": -2,
          "stamina": -2
        },
        "failResult": "哨位有人回头，你只好丢下刚找到的补给。"
      },
      {
        "label": "从后墙检查员工储藏室",
        "result": "储藏室里有被遗忘的收音机，你从破洞把它拖了出来。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "radio": 1
        },
        "requiresItem": "crowbar",
        "chance": 0.75,
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "砖墙松动得太响，你只能停止撬动。"
      },
      {
        "label": "记住哨位，立刻离开",
        "result": "今天带走的是他们的巡逻规律，而不是货架上的物资。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "intel": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-airdrop",
    "title": "刚落下的补给箱",
    "text": "几只降落伞挂在断墙上，补给箱散落在两群互相提防的人之间。没人愿意先背对对方。",
    "scene": "outside",
    "choices": [
      {
        "label": "提出每边取一箱",
        "result": "人群终于慢慢分开，你带着分到的急救箱退出空地。",
        "effects": {
          "mood": 1,
          "stamina": -1
        },
        "items": {
          "medkit": 1,
          "water": 1
        },
        "chance": 0.65,
        "chanceByItem": {
          "radio": 0.15
        },
        "failEffects": {
          "mood": -1,
          "stamina": -1
        },
        "failResult": "双方不肯让步，你放弃介入他们的争抢。"
      },
      {
        "label": "只开外围没人看管的小箱",
        "result": "箱中的防护面具和斧头足够有用，不必继续往人群里挤。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "mask": 1,
          "axe": 1
        },
        "chance": 0.6,
        "chanceByFlag": {
          "lg_dog": 0.1
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failResult": "有人也盯上了这个箱子，你赶在争夺升级前松手。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-theater",
    "title": "道具间的真东西",
    "text": "剧院道具箱里挤着布景和旧戏服。应急斧仍在入口玻璃柜里，舞台上的饮料瓶却分不清哪些只是道具。",
    "scene": "outside",
    "choices": [
      {
        "label": "先打开入口的应急柜",
        "result": "玻璃门被稳稳撑住，消防斧终于等到了真正的紧急情况。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "axe": 1
        },
        "chance": 0.7,
        "chanceByItem": {
          "gloves": 0.2
        },
        "failEffects": {
          "health": -1,
          "stamina": -1
        },
        "failResult": "碎玻璃划破手背，只好先处理伤口。"
      },
      {
        "label": "整理道具箱的锁与旅行箱",
        "result": "大部分布景只能留下，两件结实的小物却还能为新的旅程服务。",
        "effects": {},
        "items": {
          "suitcase": 1,
          "padlock": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-trash",
    "title": "没有来收的垃圾",
    "text": "垃圾车始终没有驶来。袋子外侧已经发臭，最上层却夹着还没拆封的食品包装和一只硬壳药盒。",
    "scene": "outside",
    "choices": [
      {
        "label": "戴好防护，检查密封物品",
        "result": "你将污袋剥开，把确实没有漏损的物品另外包好。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "canned": 1,
          "bandage": 1
        },
        "requiresAnyItem": [
          "gloves",
          "mask",
          "sanitizer"
        ],
        "chance": 0.8,
        "failEffects": {
          "health": -1
        },
        "failResult": "包装下有破口，你把刚拿起的东西全部放了回去。"
      },
      {
        "label": "只取干净外层的包装材料",
        "result": "不必把手伸进异味里，外层布料和胶带仍有用。",
        "effects": {},
        "items": {
          "duct_tape": 1,
          "tarp": 1
        }
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-wizards",
    "title": "把旧物当成宝的人",
    "text": "一群披着长袍的旅行者把旧瓶盖叫作护符。他们带着食物和收音机，真正想换的却是普通得不能再普通的东西。",
    "scene": "outside",
    "choices": [
      {
        "label": "用一双干袜子换饮水",
        "result": "他们仔细包起袜子，郑重得像接过一件古物。",
        "effects": {
          "mood": 1
        },
        "items": {
          "socks": -1,
          "water": 3
        }
      },
      {
        "label": "把小镜子换成收音机",
        "result": "他们对镜子里的自己赞叹不已，你则小心试了试收音机的旋钮。",
        "effects": {},
        "items": {
          "mirror": -1,
          "radio": 1
        }
      },
      {
        "label": "友善道别，不作交易",
        "result": "你听完了他们旅途上的怪故事，没有把别人的信念当作玩笑。",
        "effects": {
          "mood": 1
        },
        "items": {}
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-yacht",
    "title": "停在路口的游艇",
    "text": "那艘游艇本应在海面上，如今却斜停在路口。船舱的地图柜还没打开，饮水被固定在后舱的卡架上。",
    "scene": "outside",
    "choices": [
      {
        "label": "先解开后舱饮水固定带",
        "result": "船身虽不再浮动，主人准备的饮水仍在原来的位置。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 2
        }
      },
      {
        "label": "沿船舱找导航用品",
        "result": "你在散乱的海图中辨认出城区图，还找到了一架可以接收陆地信号的收音机。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "map": 1,
          "radio": 1
        },
        "chance": 0.65,
        "chanceByItem": {
          "rope": 0.15,
          "flashlight": 0.1
        },
        "failEffects": {
          "health": -1,
          "stamina": -2
        },
        "failItems": {
          "map": 1
        },
        "failResult": "倾斜的船身让脚下一滑，你只来得及收好最外层的一张图。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-o-zoo",
    "title": "围栏另一边的新住客",
    "text": "动物园里不少围栏已经打开，曾经熟悉的动物也变得难以辨认。饲养员休息室和倒下的水族馆控制室都还有东西可找。",
    "scene": "outside",
    "choices": [
      {
        "label": "等动物离开再查休息室",
        "result": "你没有惊动新住客，从外侧柜子带走了饲养员留下的补给。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "canned": 1,
          "scout_book": 1
        },
        "chance": 0.65,
        "chanceByItem": {
          "binoculars": 0.2
        },
        "chanceByFlag": {
          "lg_dog": 0.1
        },
        "failEffects": {
          "stamina": -2,
          "mood": -1
        },
        "failResult": "它们始终没有离开，你放弃了继续靠近。"
      },
      {
        "label": "沿服务走廊找控制室",
        "result": "控制室的柜门护住了一点饮水，路边还有能继续用的工具。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 1,
          "rope": 1
        },
        "requiresItem": "map"
      }
    ],
    "cooldown": 13,
    "types": [
      "nuclear"
    ]
  },
  {
    "id": "lg-o-nothing",
    "title": "已经被搜过的街区",
    "text": "每扇门后都是空架子，风把翻过的纸页吹得哗哗响。日头正在移动，你还没有找到值得带走的东西。",
    "scene": "outside",
    "choices": [
      {
        "label": "接受空手而归，保存力气",
        "result": "你记住了这个街区的空屋，回程时没有再多绕路。",
        "effects": {
          "stamina": 1
        },
        "items": {}
      },
      {
        "label": "再清点最后一条小巷",
        "result": "没有留下补给，却找到一段可以挽回这趟路程的绳子。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "rope": 1
        },
        "chance": 0.35,
        "chanceByItem": {
          "scout_book": 0.15
        },
        "failEffects": {
          "stamina": -2
        },
        "failResult": "最后一条巷子也只剩空箱，你终于转身回家。"
      }
    ],
    "cooldown": 13
  },
  {
    "id": "lg-s-phone",
    "title": "街口响起的电话",
    "text": "电话铃声从街角持续传来。你们已经很久没有听见过这种声音，但要接起它，就得有人走出舱门。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人去接电话",
        "result": "代表记住了电话亭的位置，准备在街角看看是谁还在拨号。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "intel": 1
          },
          "returnEffects": {
            "stamina": -1
          },
          "result": "线路只保持了一会儿，另一端的幸存者留下了下次会面的暗号。"
        },
        "setFlags": [
          "lg_phoneAnswered"
        ],
        "followUp": {
          "eventId": "lg-s-new-hope",
          "delay": 2,
          "chainId": "lg-twins-phone"
        }
      },
      {
        "label": "不派人，等铃声停下",
        "result": "铃声终于停了，没人再说刚才是否应该试一试。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "requiresNoExpedition": true,
    "minDay": 4,
    "route": true,
    "minHome": 1,
    "forbidsFlags": [
      "lg_phoneAnswered",
      "lg_robbedInnocent"
    ]
  },
  {
    "id": "lg-s-new-hope",
    "title": "要求空手赴约的纸条",
    "text": "新的纸条与电话里的暗号相同。附近幸存者希望派一位代表赴约，特别强调不要携带武器。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人空手赴约",
        "result": "你们决定让一位代表带着暗号前往。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {},
          "returnEffects": {
            "stamina": -1,
            "mood": 1
          },
          "result": "来接应的是一对兄妹。他们正在组织营地，愿意与这扇舱门保持联络。"
        },
        "setFlags": [
          "lg_campStarted",
          "lg_campMet"
        ],
        "flag": "siblingsHelped"
      },
      {
        "label": "暂时不赴约",
        "result": "你们留下了没有承诺的答复，先把这次见面记在纸上。",
        "effects": {
          "mood": -1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresNoExpedition": true,
    "requiresFlag": "lg_phoneAnswered",
    "route": true,
    "minHome": 1,
    "forbidsFlags": [
      "lg_campMet",
      "lg_robbedInnocent"
    ]
  },
  {
    "id": "lg-s-military-interview",
    "title": "巡逻队的会面通知",
    "text": "收音机里传来熟悉呼号，巡逻队要求各避难所派代表报告人员和街区情况。他们将在附近路口短暂停留。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选代表带着真实情况前往",
        "result": "代表整理好需要核实的消息，沿约定路线出发。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {},
          "returnEffects": {
            "stamina": -1
          },
          "result": "巡逻员记录了人口和补给状况，并约定后续接应时使用的口令。"
        },
        "flag": "militaryHonest",
        "setFlags": [
          "militaryVisited"
        ]
      },
      {
        "label": "这次不派代表",
        "result": "对方没有继续催促，收音机又只剩下断续的噪声。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "radio",
    "requiresFlag": "intel",
    "requiresNoExpedition": true,
    "route": true,
    "minDay": 8,
    "minHome": 1,
    "forbidsFlags": [
      "militaryHonest"
    ]
  },
  {
    "id": "lg-s-coffee",
    "title": "想喝一杯真正的咖啡",
    "text": "夏晴记起几条街外的小餐馆。那里也许还留着咖啡壶，哪怕已经凉透，也比反复想象它的味道好受一些。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人去餐馆看看",
        "result": "代表记住餐馆的位置，承诺不会为了咖啡冒无谓的险。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "coffee": 2
          },
          "returnEffects": {
            "stamina": -1,
            "mood": 1
          },
          "chance": 0.7,
          "failEffects": {
            "stamina": -2
          },
          "result": "餐馆后厨保住了一点速溶咖啡，苦香终于能回到餐桌上。",
          "failResult": "旧餐馆只剩一片散着座椅的空地，没有留下能装进杯子的东西。"
        }
      },
      {
        "label": "把这趟路留给更要紧的事",
        "result": "大家聊了聊从前常点的早餐，随后继续清点物资。",
        "effects": {
          "mood": -1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "mother"
    ],
    "requiresNoExpedition": true,
    "once": true,
    "minDay": 6,
    "minHome": 1
  },
  {
    "id": "lg-s-hunt",
    "title": "头顶经过的兽群",
    "text": "一阵沉重蹄声从舱门上方经过。家里的步枪还在，兽群后面似乎拖着一些像驮包的东西。要不要派人追踪？",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人带步枪去追踪",
        "result": "代表带走步枪，准备先看清兽群再决定是否靠近。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "canned": 2
          },
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.65,
          "failItems": {},
          "failEffects": {
            "health": -3,
            "stamina": -2
          },
          "result": "它们比想象中难接近，好在掉落的驮包里还有食物，不必再追。",
          "failResult": "兽群突然折返。代表逃回约定路口，却带着伤没能找到补给。",
          "pack": {
            "rifle": 1
          }
        }
      },
      {
        "label": "不出去，等声音远去",
        "result": "你们没有打开舱门，陌生兽群的脚步声渐渐消失。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "rifle",
    "requiresNoExpedition": true,
    "once": true,
    "types": [
      "nuclear"
    ],
    "minHome": 1
  },
  {
    "id": "lg-s-graffiti",
    "title": "墙上的方向箭头",
    "text": "上次外出时有人记住了一串墙上记号。几个箭头连向同一块缺口，尽头画着一个不太像玩笑的叉。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人带地图核对箭头",
        "result": "代表把街角记号与地图仔细对上，再推开舱门。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "canned": 2,
            "parts": 1
          },
          "returnEffects": {
            "stamina": -1
          },
          "chance": 0.8,
          "failItems": {},
          "failEffects": {
            "stamina": -2
          },
          "result": "记号指向一面松砖墙，里面确实藏着别人没有找到的小包。",
          "failResult": "沿线只找到一只空盒，代表收好地图返程。",
          "pack": {
            "map": 1
          }
        }
      },
      {
        "label": "选人只凭记住的地标去找",
        "result": "代表把箭头的样子重新画在记忆里，决定试一试。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "canned": 1,
            "parts": 1
          },
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.5,
          "failEffects": {
            "stamina": -2
          },
          "result": "绕了几条巷子后，终于在记号尽头发现了一点补给。",
          "failResult": "记号中断在塌墙旁，已无法辨认下一段方向。"
        }
      },
      {
        "label": "不追随陌生人的记号",
        "result": "你们把记号留在日记里，没有立刻派人。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresFlag": "expeditions",
    "requiresNoExpedition": true,
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-s-safe",
    "title": "邻居藏起来的保险箱",
    "text": "大家都记得那位不愿让人靠近客厅的邻居。他曾炫耀过一只保险箱，如今门牌还在，却再也听不见屋里的声音。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人带面具检查保险箱",
        "result": "代表带走面具，打算先检查箱口是否有异常装置。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "parts": 2,
            "water": 1
          },
          "returnEffects": {
            "stamina": -1
          },
          "chance": 0.8,
          "failItems": {
            "parts": 1
          },
          "failEffects": {
            "health": -1,
            "stamina": -2
          },
          "result": "箱盖早已裂开，遮住口鼻后搬走了还能使用的小件。",
          "failResult": "箱口冒出呛人的烟，代表及时退开，只带回一点边缘零件。",
          "pack": {
            "mask": 1
          }
        }
      },
      {
        "label": "选人徒手去看看",
        "result": "代表说自己只看一眼，其他人却谁也没有接这句话。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "parts": 2,
            "water": 1
          },
          "returnEffects": {
            "stamina": -1
          },
          "chance": 0.55,
          "failItems": {
            "parts": 1
          },
          "failEffects": {
            "health": -2,
            "stamina": -2
          },
          "result": "保险箱被塌墙震开了，里面还留着少量实用物品。",
          "failResult": "一打开箱盖就被烟呛住，只能带着咳嗽回到舱门前。"
        }
      },
      {
        "label": "不去动邻居的东西",
        "result": "有关保险箱的猜测终于停下了。",
        "effects": {
          "mood": 1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresNoExpedition": true,
    "once": true,
    "minDay": 7,
    "minHome": 1
  },
  {
    "id": "lg-s-lab-rats",
    "title": "研究车里的志愿者",
    "text": "与猫有关的那位研究者送来邀请。他需要有人在实验车里住几天，协助测试废墟环境的影响，却不能保证过程舒适。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人参加观察实验",
        "result": "志愿者带着约定的归来日期，走向停在远处的研究车。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 4,
          "returnItems": {},
          "returnEffects": {
            "health": -2,
            "stamina": -2,
            "mood": -3
          },
          "result": "观察结束了。归来的家人显得疲惫而混乱，研究者则坚持说记录非常重要。"
        },
        "setFlags": [
          "lg_labVolunteerSent"
        ],
        "followUp": {
          "eventId": "lg-s-lab-results",
          "delay": 5,
          "chainId": "lg-lab"
        }
      },
      {
        "label": "拒绝让家人充当试验对象",
        "result": "你们没有打开舱门，研究者留下失望的答复。",
        "effects": {},
        "items": {},
        "setFlags": [
          "lg_labDeclined"
        ]
      }
    ],
    "cooldown": 15,
    "requiresFlag": "lg_catScientist",
    "forbidsFlags": [
      "lg_labDeclined",
      "lg_labVolunteerSent"
    ],
    "requiresNoExpedition": true,
    "once": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-s-recon",
    "title": "特工交来的空白街区图",
    "text": "那两位神秘来客带来一张缺了大片标注的街区图。他们希望派人查看几个路口，回来后交付记录，作为信任的证明。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人执行侦察任务",
        "result": "代表记住了观察位置，准备避开正面冲突。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 2,
          "returnItems": {
            "intel": 1
          },
          "returnEffects": {
            "health": -1,
            "stamina": -2
          },
          "result": "记录带了回来。几个路口并不安全，家人也为赶路付出了代价。"
        },
        "setFlags": [
          "lg_reconSent"
        ],
        "followUp": {
          "eventId": "lg-s-recon-delivery",
          "delay": 3,
          "chainId": "lg-agent-recon"
        }
      },
      {
        "label": "暂时不答应这项任务",
        "result": "来客收回地图，说会去找别的人选。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "followUp": {
          "eventId": "lg-s-recon-reminder",
          "delay": 4,
          "chainId": "lg-agent-recon-offer"
        }
      }
    ],
    "cooldown": 15,
    "requiresFlag": "lg_agentsMet",
    "forbidsFlags": [
      "lg_reconSent"
    ],
    "requiresNoExpedition": true,
    "once": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-s-reunited",
    "title": "兄妹中少了一个人",
    "text": "营地来客这次独自站在门外。另一位在侦察掠夺者据点时被困住，同行者已经在附近等候，只差有人帮忙接应。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人带消防斧参与接应",
        "result": "代表取走斧头，约好只负责打开撤离通道。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "bandage": 1
          },
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.85,
          "failItems": {},
          "failEffects": {
            "health": -2,
            "stamina": -2
          },
          "result": "木栅被劈开，被困者沿接应通道跑了出来，兄妹终于重逢。",
          "failResult": "据点临时换了守卫，接应被迫中止，代表带伤回到约定地点。",
          "pack": {
            "axe": 1
          }
        },
        "flag": "siblingsHelped",
        "setFlags": [
          "lg_campRescueHelped"
        ]
      },
      {
        "label": "选人空手参与外围接应",
        "result": "代表决定与其他人分工，先把能走的路指清楚。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {},
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.65,
          "failEffects": {
            "health": -2,
            "stamina": -2
          },
          "result": "外围接应的人手足够了，被困者趁守卫转身时成功离开。",
          "failResult": "据点外的路线被堵住，代表不得不先撤回。"
        },
        "flag": "siblingsHelped",
        "setFlags": [
          "lg_campRescueHelped"
        ]
      },
      {
        "label": "不加入营救",
        "result": "来客没有责怪你们，只把后面的请求咽了回去。",
        "effects": {
          "mood": -1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresFlag": "lg_campStarted",
    "forbidsFlags": [
      "lg_campRescueHelped"
    ],
    "requiresNoExpedition": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-s-strong-bonds",
    "title": "要不要让一个人离开",
    "text": "口粮或饮水已经少得令人沉默。有人提出让一位家人另寻生路，把现有物资留给其他人。这个决定无法轻易收回。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选定一个人，让他另寻生路",
        "result": "舱门关上后，原来的座位被空了出来。",
        "effects": {
          "mood": -2
        },
        "items": {},
        "choosePerson": true,
        "losePerson": true
      },
      {
        "label": "谁也不赶走，继续一起想办法",
        "result": "没有多出食物，但这一晚的名字仍完整写在值守表上。",
        "effects": {
          "mood": 2
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "minHome": 3,
    "maxSupply": {
      "food": 2,
      "drink": 2
    },
    "once": true,
    "minDay": 10
  },
  {
    "id": "lg-s-tank",
    "title": "上次见到的废弃装甲车",
    "text": "上次外出者记住了一辆卡在碎石里的装甲车。外壳烧黑，储物格可能还完整，也可能留下不该触碰的危险。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人带工具检查外部储物格",
        "result": "代表带走工具，约好不碰驾驶舱里看不懂的装置。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "mask": 1,
            "water": 1
          },
          "returnEffects": {
            "stamina": -1
          },
          "chance": 0.8,
          "failItems": {},
          "failEffects": {
            "health": -2,
            "stamina": -2
          },
          "result": "防护面具和一瓶水被护在侧面储物格里，工具也顺利带了回来。",
          "failResult": "储物格的支架突然崩开，只能提前停止检查。",
          "pack": {
            "tools": 1
          }
        }
      },
      {
        "label": "选人从打开的舱口查看",
        "result": "代表打算从远处先确认车体是否稳定，再靠近舱口。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "radio": 1,
            "canned": 1
          },
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.55,
          "failEffects": {
            "health": -3,
            "stamina": -2
          },
          "result": "车载收音机还可以拆下，旁边还有被遗忘的口粮。",
          "failResult": "舱内有未燃尽的危险物，急着后退时被边缘铁片划伤。"
        }
      },
      {
        "label": "放弃检查装甲车",
        "result": "你们没有把家人的性命压在一具看不懂的残骸上。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresFlag": "expeditions",
    "requiresNoExpedition": true,
    "once": true,
    "minDay": 8,
    "minHome": 1
  },
  {
    "id": "lg-s-treasure",
    "title": "地图边角的额外记号",
    "text": "城区地图的边角有一套后来写上的符号。把它们对照起来，终点像是某棵老树，也可能只是孩子当年的游戏。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人带地图寻找终点",
        "result": "代表把地图折到能看清记号的位置，沿旧地标出发。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 1,
          "returnItems": {
            "canned": 2,
            "flashlight": 1
          },
          "returnEffects": {
            "stamina": -2
          },
          "chance": 0.65,
          "failItems": {},
          "failEffects": {
            "stamina": -2
          },
          "result": "树洞里确实藏着小箱，食物和照明工具还在里面。",
          "failResult": "最后一个记号已经找不到对应的地标，代表收好地图回来了。",
          "pack": {
            "map": 1
          }
        }
      },
      {
        "label": "不为记号安排一趟远行",
        "result": "地图被折回原样，大家先继续眼前的工作。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "map",
    "requiresNoExpedition": true,
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-ant-farm",
    "title": "口袋里发亮的小蚂蚁",
    "text": "阿野从口袋里倒出几只发亮的蚂蚁，坚持要养成一座小农场。夏晴看着它们爬向食品架，马上表示反对。",
    "scene": "shelter",
    "choices": [
      {
        "label": "让阿野用封闭盒子观察",
        "result": "阿野把观察盒放得很远，却不得不拿食物去安顿这些新住客。",
        "effects": {
          "mood": 2
        },
        "items": {
          "canned": -1
        },
        "targetId": "son",
        "personEffects": {
          "mother": {
            "mood": -1
          }
        }
      },
      {
        "label": "支持夏晴，把它们带离营地",
        "result": "盒子终于不再靠近食品，阿野却不肯再谈刚才的计划。",
        "effects": {
          "mood": 1
        },
        "items": {},
        "targetId": "mother",
        "personEffects": {
          "son": {
            "mood": -2
          }
        }
      },
      {
        "label": "先不站队，盯住食品架",
        "result": "几只小蚂蚁溜进了缝隙，争论暂时停下。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "targetId": "son",
        "chance": 0.7,
        "failEffects": {
          "health": -1,
          "mood": -1
        },
        "failResult": "收回蚂蚁时阿野被咬了一下，观察计划只能结束。"
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "son",
      "mother"
    ],
    "once": true,
    "types": [
      "nuclear"
    ],
    "minHome": 1
  },
  {
    "id": "lg-c-kids-fight",
    "title": "两个孩子的秘密争执",
    "text": "小禾与阿野越吵越凶，谁也不肯说最初是为了什么。桌下露出一小截陌生物品，像是有人偷偷藏着东西。",
    "scene": "shelter",
    "choices": [
      {
        "label": "先听阿野说完",
        "result": "争吵的缘由终于说清：原来藏起来的是一件小乐器。",
        "effects": {
          "mood": 1
        },
        "items": {
          "harmonica": 1
        },
        "targetId": "son",
        "personEffects": {
          "daughter": {
            "mood": -1
          }
        }
      },
      {
        "label": "先听小禾说完",
        "result": "小禾放低声音，阿野也终于愿意把藏着的食物拿到桌上。",
        "effects": {
          "mood": 1
        },
        "items": {
          "canned": 1
        },
        "targetId": "daughter",
        "personEffects": {
          "son": {
            "mood": -1
          }
        }
      },
      {
        "label": "谁也不偏袒，让两人一起说明",
        "result": "等他们自己说到一半，争执突然变成了笑话。",
        "effects": {
          "mood": 1
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "son",
      "daughter"
    ],
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-maestro",
    "title": "谁来吹这段旋律",
    "text": "口琴躺在餐桌中间。大家都想让地下室里多一点音乐，但每个人对自己会不会吹这件事，都有不同的说法。",
    "scene": "shelter",
    "choices": [
      {
        "label": "请陆远来一段",
        "result": "陆远慢慢找到节拍，简单的旋律终于连了起来。",
        "effects": {
          "mood": 2
        },
        "items": {},
        "targetId": "father",
        "all": true
      },
      {
        "label": "请夏晴试一试",
        "result": "夏晴认真学着吹出几个音，大家努力跟上节奏。",
        "effects": {
          "mood": 1
        },
        "items": {},
        "targetId": "mother",
        "all": true,
        "chance": 0.45,
        "failEffects": {
          "health": -1,
          "mood": -1
        },
        "failResult": "尖利的声音在墙间反复回荡，大家只好提前结束这场演出。"
      },
      {
        "label": "请小禾把记得的旋律写下来",
        "result": "旋律被一行行记好，小禾却已经累得不想再吹。",
        "effects": {
          "mood": 1,
          "stamina": -1
        },
        "items": {},
        "targetId": "daughter"
      },
      {
        "label": "让阿野试着起个头",
        "result": "阿野刚吹出两声就不好意思地收起口琴，今天先到这里。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "targetId": "son"
      },
      {
        "label": "今天谁也不演奏",
        "result": "口琴被放回架上，安静仍然占着大半个屋子。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "requiresItem": "harmonica",
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-movie-debate",
    "title": "末日前的英雄谁会赢",
    "text": "陆远和小禾争论起旧电影里的英雄，话题很快变成谁能在如今的街道上走得更远。双方都希望有人作最后裁判。",
    "scene": "shelter",
    "choices": [
      {
        "label": "支持陆远的论点",
        "result": "陆远的论据终于让小禾停下来思考，她把拿来当赌注的罐头放回桌上。",
        "effects": {
          "mood": 1
        },
        "items": {
          "canned": 1
        },
        "targetId": "father",
        "personEffects": {
          "daughter": {
            "mood": -1
          }
        }
      },
      {
        "label": "支持小禾的论点",
        "result": "小禾用口袋里的零碎画出示意图，其中竟混着一小包弹药。",
        "effects": {
          "mood": 1
        },
        "items": {
          "ammo": 1
        },
        "targetId": "daughter",
        "personEffects": {
          "father": {
            "mood": -1
          }
        }
      },
      {
        "label": "不裁判，让两人把故事讲完",
        "result": "等争论变成共同回忆，输赢终于没有那么重要。",
        "effects": {},
        "items": {},
        "personEffects": {
          "father": {
            "mood": 1
          },
          "daughter": {
            "mood": 1
          }
        }
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "father",
      "daughter"
    ],
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-mystery-vehicle",
    "title": "街尾那辆古怪的车",
    "text": "几次外出都有人提起街尾的车辆。它被遮住大半，成年人说像装甲车，孩子们却坚持看见过售卖窗口。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一位成年人去确认",
        "result": "成年人带着记录本出门，准备近看它的轮廓。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "people": [
          "father",
          "mother"
        ],
        "sendPerson": {
          "days": 1,
          "returnItems": {},
          "returnEffects": {
            "stamina": -1
          },
          "result": "那是一辆残缺的装甲车。它暂时不能开走，轮廓却被认真画回了日记。"
        },
        "setFlags": [
          "lg_tankFound"
        ]
      },
      {
        "label": "选一位孩子去辨认招牌",
        "result": "孩子指着记住的街角，答应只在安全的距离观察。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "people": [
          "daughter",
          "son"
        ],
        "sendPerson": {
          "days": 1,
          "returnItems": {},
          "returnEffects": {
            "stamina": -1
          },
          "result": "那是一辆旧冰淇淋车。窗口已经空了，车身图案仍让人记起从前的夏天。"
        },
        "setFlags": [
          "lg_iceCreamVanFound"
        ]
      },
      {
        "label": "暂时不检查那辆车",
        "result": "车辆的样子留在想象里，你们先等待更明确的消息。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresFlag": "expeditions",
    "requiresNoExpedition": true,
    "once": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-c-soup-thief",
    "title": "被误算还是被藏起的一罐",
    "text": "清点罐头时，大家发现数量似乎对不上。昨天是谁最后碰过储物架？没有证据，名字却已经在每个人嘴边打转。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选一个人单独询问",
        "result": "被问到的人很难过，最后你们在架后找回了那只罐头。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "choosePerson": true,
        "chance": 0.6,
        "failEffects": {
          "mood": -2
        },
        "failItems": {
          "canned": -1
        },
        "failResult": "追问没有找回食物，反而让被怀疑的家人更加沉默。"
      },
      {
        "label": "不指责任何人，一起重新清点",
        "result": "没人被单独留下，大家把盒子重新摆好，尽量不让猜疑变成事实。",
        "effects": {
          "mood": 1
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "requiresItem": "canned",
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-bucket",
    "title": "谁去倒掉墙角的桶",
    "text": "墙角的桶快满了。陆远和夏晴都说不是自己的轮次，再拖下去，整个地下室都会记住这次争论。",
    "scene": "shelter",
    "choices": [
      {
        "label": "请陆远先去处理",
        "result": "陆远接过桶时还在念叨排班表，好在总算处理妥当。",
        "effects": {
          "stamina": -1
        },
        "items": {},
        "targetId": "father",
        "personEffects": {
          "mother": {
            "mood": 1
          }
        },
        "chance": 0.6,
        "failEffects": {
          "health": -2,
          "stamina": -1
        },
        "failResult": "提起桶时脚下一滑，陆远的后背磕在台阶上。"
      },
      {
        "label": "请夏晴先去处理",
        "result": "夏晴清开舱口时发现一点被压住的物资，也顺手把桶处理了。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "parts": 1
        },
        "targetId": "mother",
        "chance": 0.6,
        "failEffects": {
          "mood": -1,
          "stamina": -1
        },
        "failRemoveItems": [
          "soap"
        ],
        "failResult": "两人挤在舱口互相帮忙，最后反而把清洁用品弄坏了一件。"
      },
      {
        "label": "继续争论，今天谁也不去",
        "result": "气味没有听从任何人的道理，所有人都越来越烦躁。",
        "effects": {
          "mood": -1,
          "health": -1
        },
        "items": {},
        "all": true
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "father",
      "mother"
    ],
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-c-anniversary",
    "title": "仍然记得的纪念日",
    "text": "陆远与夏晴竟然都记得今天是什么日子。两人各有一份藏了许久的小礼物，却谁都不好意思先拿出来。",
    "scene": "shelter",
    "choices": [
      {
        "label": "先请陆远打开礼物",
        "result": "一只特意留好的罐头摆到桌上，墙边也多了两人认真画下的小记号。",
        "effects": {
          "mood": 1
        },
        "items": {
          "canned": 1
        },
        "targetId": "father",
        "personEffects": {
          "mother": {
            "mood": 1
          }
        },
        "setFlags": [
          "lg_anniversaryMark"
        ]
      },
      {
        "label": "先请夏晴打开礼物",
        "result": "礼物是一副细心擦过的面具。夏晴摸着干净镜片，终于轻轻笑了。",
        "effects": {
          "mood": 1
        },
        "items": {
          "mask": 1
        },
        "targetId": "mother",
        "personEffects": {
          "father": {
            "mood": 1
          }
        }
      },
      {
        "label": "把庆祝留到以后",
        "result": "两份礼物重新收好，屋里又只听见日常的交谈。",
        "effects": {},
        "items": {},
        "personEffects": {
          "father": {
            "mood": -1
          },
          "mother": {
            "mood": -1
          }
        }
      }
    ],
    "cooldown": 15,
    "requiresPeople": [
      "father",
      "mother"
    ],
    "once": true,
    "minHome": 1
  },
  {
    "id": "lg-s-lab-results",
    "title": "实验结束后的记录",
    "text": "研究者送来一张已经整理好的观察记录。他希望你们继续保持联系，家人现在最需要的却是休息。",
    "scene": "shelter",
    "choices": [
      {
        "label": "记下记录，让归来的人休息",
        "result": "你们收起报告，把最安静的一段时间留给刚回家的家人。",
        "effects": {
          "stamina": 2,
          "mood": 1
        },
        "items": {},
        "setFlags": [
          "lg_labCompleted"
        ]
      }
    ],
    "cooldown": 15,
    "scheduledOnly": true,
    "requiresNoExpedition": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-s-recon-delivery",
    "title": "把侦察图交回去",
    "text": "特工按约定来取街区记录。他们在危险路口作了新标注，并确认会把这次协助记下来。",
    "scene": "shelter",
    "choices": [
      {
        "label": "交出如实记录的情况",
        "result": "来客确认了地标和方向，随后把报告装进自己的文件袋。",
        "effects": {
          "mood": 1
        },
        "items": {},
        "setFlags": [
          "lg_agentReconDone"
        ]
      }
    ],
    "cooldown": 15,
    "scheduledOnly": true,
    "requiresNoExpedition": true,
    "route": true,
    "minHome": 1
  },
  {
    "id": "lg-o-cards-rest",
    "title": "路边的一小局纸牌",
    "text": "你取出随身纸牌稍作休息，一位躲在断墙后的人看见了牌面。他问能不能坐下来，也愿意谈谈附近哪条路还能走。",
    "scene": "outside",
    "choices": [
      {
        "label": "一起打一局，交换沿途消息",
        "result": "牌局不长，对方却把一张折好的地图留给了你。",
        "effects": {
          "mood": 1,
          "stamina": 1
        },
        "items": {
          "map": 1
        },
        "chance": 0.75,
        "failEffects": {
          "mood": 1
        },
        "failResult": "对方没有多余地图，但一小局牌仍让你喘了口气。"
      },
      {
        "label": "先用纸牌独自理清思绪",
        "result": "牌被一张张收好，你重新有了出发的力气。",
        "effects": {
          "stamina": 1,
          "mood": 1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "cards"
  },
  {
    "id": "lg-o-checkers-vending",
    "title": "没有硬币的旧机器",
    "text": "酒吧外的旧售货机仍卡着几只罐头。你摸到随身的棋子，大小看起来和投币口接近。",
    "scene": "outside",
    "choices": [
      {
        "label": "拿一枚棋子试试机械卡口",
        "result": "机簧终于松开，罐头顺着倾斜货槽滚到取物口。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "canned": 2
        },
        "chance": 0.6,
        "chanceByItem": {
          "screwdriver": 0.2
        },
        "failEffects": {
          "stamina": -1
        },
        "failResult": "棋子卡在外侧，你取回剩下的棋具，没能打开机器。"
      },
      {
        "label": "保留棋具，只看机器外的东西",
        "result": "机脚旁有一小包掉落的弹药，不用让棋子冒险也能带走。",
        "effects": {},
        "items": {
          "ammo": 1
        }
      }
    ],
    "cooldown": 15,
    "requiresItem": "checkers"
  },
  {
    "id": "lg-o-harmonica-song",
    "title": "一段让人走近的旋律",
    "text": "随身口琴的声音让路口的陌生人停下脚步。他们没有立即走近，只在另一侧跟着打起拍子。",
    "scene": "outside",
    "choices": [
      {
        "label": "吹完旋律，慢慢向他们问候",
        "result": "人群围成一个松散的小圈，分别时有人把自己的饮水分给了你。",
        "effects": {
          "mood": 2
        },
        "items": {
          "water": 1
        },
        "chance": 0.75,
        "failEffects": {
          "mood": 1
        },
        "failResult": "对方听完便挥手离开，音乐仍让这段路显得没那么长。"
      },
      {
        "label": "收好口琴，继续原来的路线",
        "result": "你向他们点头，随后把不熟悉的来客留在身后。",
        "effects": {
          "mood": 1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "harmonica"
  },
  {
    "id": "lg-o-padlock-cache",
    "title": "不方便一次搬走的水",
    "text": "开着口的小型储物箱里有几瓶水。这里离返程路很近，带着的挂锁恰好可以先把箱盖锁住。",
    "scene": "outside",
    "choices": [
      {
        "label": "先用挂锁固定，回程再来取",
        "result": "挂锁让物资没有在这段时间被挪走，你带着水重新上路。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "water": 2
        },
        "chance": 0.85,
        "failEffects": {
          "stamina": -1
        },
        "failResult": "回程时道路塌了，你只能远远记下储物箱的位置。"
      },
      {
        "label": "现在只拿能顺手带走的水",
        "result": "你不再绕回同一个街角，把眼前的一瓶先收进包里。",
        "effects": {},
        "items": {
          "water": 1
        }
      }
    ],
    "cooldown": 15,
    "requiresItem": "padlock"
  },
  {
    "id": "lg-o-radio-contact",
    "title": "路上的短波呼号",
    "text": "带在身上的收音机突然接到很近的呼叫。对方说自己缺少饮水，愿意拿医用品交换，地点就在路旁旧棚屋。",
    "scene": "outside",
    "choices": [
      {
        "label": "按呼号约定交换物资",
        "result": "对方先把药箱放在门边，交换完成后双方各自退开。",
        "effects": {},
        "items": {
          "water": -1,
          "medkit": 1
        }
      },
      {
        "label": "保持距离，只互报可通行路段",
        "result": "你们没有碰面，却都少走了一段看起来危险的路。",
        "effects": {
          "stamina": 1
        },
        "items": {
          "intel": 1
        }
      }
    ],
    "cooldown": 15,
    "requiresItem": "radio"
  },
  {
    "id": "lg-o-spray-stash",
    "title": "物资下面的鼠群",
    "text": "旧橱柜后藏着一个密封包，一群小动物却在周围钻来钻去。你正好带着驱虫用品，可以试着让它们先离开。",
    "scene": "outside",
    "choices": [
      {
        "label": "用一点喷剂清出取物空间",
        "result": "小动物退进墙缝，你从干净的包里取出了食品和地图。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "bug_spray": -1,
          "canned": 2,
          "map": 1
        },
        "chance": 0.8,
        "failEffects": {
          "health": -1,
          "stamina": -1
        },
        "failItems": {
          "bug_spray": -1
        },
        "failResult": "喷雾反而让它们四处乱窜，你只得先退出橱柜旁。"
      },
      {
        "label": "不惊动它们，继续找别的地方",
        "result": "你没有把手伸进黑暗的柜底，沿墙退回了外侧。",
        "effects": {
          "stamina": -1
        },
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "bug_spray"
  },
  {
    "id": "lg-o-ammo-pharmacy",
    "title": "药房里最后一只金属柜",
    "text": "药房柜子外壳已经变形，锁芯却还完整。随身弹药能做一次危险的尝试，小工具或许可以让事情安静些。",
    "scene": "outside",
    "choices": [
      {
        "label": "用小工具慢慢拆下锁芯",
        "result": "锁芯终于从变形的柜门中脱开，急救用品仍保持密封。",
        "effects": {
          "stamina": -2
        },
        "items": {
          "medkit": 1
        },
        "requiresAnyItem": [
          "screwdriver",
          "tools"
        ],
        "chance": 0.85,
        "failEffects": {
          "stamina": -2
        },
        "failResult": "锁芯卡在破损外壳里，努力后仍没有打开。"
      },
      {
        "label": "用少量弹药震开柜口",
        "result": "柜口松开了，药箱也终于可以拿出来。",
        "effects": {
          "stamina": -1
        },
        "items": {
          "ammo": -1,
          "medkit": 1
        },
        "chance": 0.6,
        "failEffects": {
          "health": -2,
          "stamina": -2
        },
        "failItems": {
          "ammo": -1
        },
        "failResult": "冲击让柜体歪倒，巨响迫使你放弃继续搜寻。"
      },
      {
        "label": "不冒险开柜",
        "result": "你记下位置，决定以后有更合适的工具再来。",
        "effects": {},
        "items": {}
      }
    ],
    "cooldown": 15,
    "requiresItem": "ammo"
  },
  {
    "id": "lg-s-recon-reminder",
    "title": "再次送来的街区图",
    "text": "神秘来客重新把空白街区图放到桌上。他们愿意再等一次，希望这回能有人把几个危险路口的情况带回来。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人执行侦察任务",
        "result": "代表记住了观察位置，准备避开正面冲突。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 2,
          "returnItems": {
            "intel": 1
          },
          "returnEffects": {
            "health": -1,
            "stamina": -2
          },
          "result": "记录带了回来。几个路口并不安全，家人也为赶路付出了代价。"
        },
        "setFlags": [
          "lg_reconSent"
        ],
        "followUp": {
          "eventId": "lg-s-recon-delivery",
          "delay": 3,
          "chainId": "lg-agent-recon"
        }
      },
      {
        "label": "暂时不答应这项任务",
        "result": "来客收回地图，说会去找别的人选。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "followUp": {
          "eventId": "lg-s-recon-final",
          "delay": 4,
          "chainId": "lg-agent-recon-offer"
        }
      }
    ],
    "cooldown": 15,
    "requiresFlag": "lg_agentsMet",
    "forbidsFlags": [
      "lg_reconSent"
    ],
    "requiresNoExpedition": true,
    "once": true,
    "route": true,
    "minHome": 1,
    "scheduledOnly": true
  },
  {
    "id": "lg-s-recon-final",
    "title": "侦察任务的最后期限",
    "text": "来客说这是最后一次邀请。接应安排不能一直等待，如果仍不愿执行侦察，他们就要收回这张图了。",
    "scene": "shelter",
    "choices": [
      {
        "label": "选人执行侦察任务",
        "result": "代表记住了观察位置，准备避开正面冲突。",
        "effects": {},
        "items": {},
        "choosePerson": true,
        "sendPerson": {
          "days": 2,
          "returnItems": {
            "intel": 1
          },
          "returnEffects": {
            "health": -1,
            "stamina": -2
          },
          "result": "记录带了回来。几个路口并不安全，家人也为赶路付出了代价。"
        },
        "setFlags": [
          "lg_reconSent"
        ],
        "followUp": {
          "eventId": "lg-s-recon-delivery",
          "delay": 3,
          "chainId": "lg-agent-recon"
        }
      },
      {
        "label": "暂时不答应这项任务",
        "result": "地图被折好带走，这条联络线路暂时不再向你们开放。",
        "effects": {
          "mood": -1
        },
        "items": {},
        "setFlags": [
          "lg_agentsReconDeclined"
        ]
      }
    ],
    "cooldown": 15,
    "requiresFlag": "lg_agentsMet",
    "forbidsFlags": [
      "lg_reconSent"
    ],
    "requiresNoExpedition": true,
    "once": true,
    "route": true,
    "minHome": 1,
    "scheduledOnly": true
  }
];
