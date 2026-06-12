export const overviewKpi = {
  totalConsistency: 96.2,
  totalItems: 660,
  deviationItems: 12,
  qualifiedDomains: 4,
  totalDomains: 5,
  trend: 2.1
}

export const domainSummaries = [
  {
    id: 'blt',
    name: 'BLT系统',
    consistency: 98.7,
    totalItems: 156,
    deviationItems: 2,
    trend: 0.8,
    threshold: 93,
    levelConsistency: { system: 98.7, module: 98.5, component: 98.9, material: 99.1 }
  },
  {
    id: 'highspeed',
    name: '高速信号',
    consistency: 94.2,
    totalItems: 203,
    deviationItems: 4,
    trend: 1.2,
    threshold: 93,
    levelConsistency: { system: 94.2, module: 93.8, component: 94.5, material: 95.0 }
  },
  {
    id: 'thermal',
    name: '散热',
    consistency: 96.8,
    totalItems: 89,
    deviationItems: 1,
    trend: 0.5,
    threshold: 93,
    levelConsistency: { system: 96.8, module: 97.2, component: 96.5, material: 96.0 }
  },
  {
    id: 'power',
    name: '供电',
    consistency: 91.5,
    totalItems: 134,
    deviationItems: 4,
    trend: -1.8,
    threshold: 93,
    levelConsistency: { system: 91.5, module: 92.0, component: 90.8, material: 89.5 }
  },
  {
    id: 'pi',
    name: 'PI (电源完整性)',
    consistency: 97.3,
    totalItems: 78,
    deviationItems: 1,
    trend: 0.3,
    threshold: 93,
    levelConsistency: { system: 97.3, module: 97.5, component: 97.1, material: 96.8 }
  }
]

function makeRecords(prefix, unit, count) {
  const scenarios = ['场景1: 常温常压', '场景2: 高温老化', '场景3: 温度循环']
  const records = []
  for (let i = 1; i <= count; i++) {
    const batch = `${prefix}-2026-B${String(i).padStart(3, '0')}`
    const scenario = scenarios[i % 3]
    const simVal = Math.round((0.8 + Math.random() * 0.12) * 1000) / 1000
    const testVal = Math.round((simVal - Math.random() * 0.06) * 1000) / 1000
    const deviation = Math.round((testVal - simVal) * 1000) / 1000
    const consistency = Math.round((1 - Math.abs(deviation) / simVal) * 1000) / 10
    let status = 'pass'
    if (consistency < 93) status = 'fail'
    else if (consistency < 97) status = 'warn'

    records.push({
      id: `${prefix}-${i}`,
      batchNumber: batch,
      scenario,
      simulationValue: `${simVal} ${unit}`,
      testValue: `${testVal} ${unit}`,
      consistency,
      deviation,
      status
    })
  }
  return records
}

export const domainDetails = {
  blt: {
    id: 'blt',
    name: 'BLT系统',
    consistency: 98.7,
    totalItems: 156,
    deviationItems: 2,
    trend: 0.8,
    tree: [
      {
        id: 'blt-pcba',
        label: 'PCBA部件',
        level: 'component',
        testCount: 120,
        children: [
          {
            id: 'blt-pcb',
            label: 'PCB',
            level: 'material',
            testCount: 72,
            children: [
              { id: 'blt-pcb-dielectric', label: '叠层介质', level: 'material', testCount: 36 },
              { id: 'blt-pcb-copper', label: '铜箔', level: 'material', testCount: 36 }
            ]
          },
          {
            id: 'blt-chip',
            label: '芯片',
            level: 'material',
            testCount: 48,
            children: [
              { id: 'blt-chip-die', label: 'Die', level: 'material', testCount: 24 },
              { id: 'blt-chip-substrate', label: '基板', level: 'material', testCount: 24 }
            ]
          }
        ]
      },
      {
        id: 'blt-module',
        label: '模组',
        level: 'module',
        testCount: 36,
        children: []
      }
    ],
    records: {
      'blt-pcb': makeRecords('BLT-PCB', 'mm', 24),
      'blt-pcb-dielectric': makeRecords('BLT-DIEL', 'mm', 12),
      'blt-pcb-copper': makeRecords('BLT-CU', 'mm', 12),
      'blt-chip': makeRecords('BLT-CHIP', 'mm', 18),
      'blt-chip-die': makeRecords('BLT-DIE', 'μm', 10),
      'blt-chip-substrate': makeRecords('BLT-SUB', 'mm', 10),
      'blt-module': makeRecords('BLT-MOD', 'mm', 8)
    }
  },
  highspeed: {
    id: 'highspeed',
    name: '高速信号',
    consistency: 94.2,
    totalItems: 203,
    deviationItems: 4,
    trend: 1.2,
    tree: [
      {
        id: 'hs-pcba',
        label: 'PCBA部件',
        level: 'component',
        testCount: 160,
        children: [
          {
            id: 'hs-pcb',
            label: 'PCB',
            level: 'material',
            testCount: 80,
            children: [
              { id: 'hs-pcb-trace', label: '信号走线', level: 'material', testCount: 40 },
              { id: 'hs-pcb-via', label: '过孔', level: 'material', testCount: 40 }
            ]
          },
          {
            id: 'hs-connector',
            label: '连接器',
            level: 'material',
            testCount: 80,
            children: [
              { id: 'hs-conn-pin', label: '引脚', level: 'material', testCount: 40 },
              { id: 'hs-conn-housing', label: '外壳', level: 'material', testCount: 40 }
            ]
          }
        ]
      },
      {
        id: 'hs-module',
        label: '模组',
        level: 'module',
        testCount: 43,
        children: []
      }
    ],
    records: {
      'hs-pcb-trace': makeRecords('HS-TRACE', 'Ω', 15),
      'hs-pcb-via': makeRecords('HS-VIA', 'Ω', 12),
      'hs-conn-pin': makeRecords('HS-PIN', 'GHz', 10),
      'hs-conn-housing': makeRecords('HS-HOUS', 'mm', 8),
      'hs-module': makeRecords('HS-MOD', 'Gbps', 10)
    }
  },
  thermal: {
    id: 'thermal',
    name: '散热',
    consistency: 96.8,
    totalItems: 89,
    deviationItems: 1,
    trend: 0.5,
    tree: [
      {
        id: 'th-pcba',
        label: 'PCBA部件',
        level: 'component',
        testCount: 60,
        children: [
          {
            id: 'th-heatsink',
            label: '散热器',
            level: 'material',
            testCount: 30,
            children: [
              { id: 'th-hs-fin', label: '鳍片', level: 'material', testCount: 15 },
              { id: 'th-hs-base', label: '底座', level: 'material', testCount: 15 }
            ]
          },
          {
            id: 'th-tim',
            label: '导热界面材料',
            level: 'material',
            testCount: 30,
            children: [
              { id: 'th-tim-pad', label: '导热垫', level: 'material', testCount: 15 },
              { id: 'th-tim-paste', label: '导热膏', level: 'material', testCount: 15 }
            ]
          }
        ]
      },
      {
        id: 'th-module',
        label: '模组',
        level: 'module',
        testCount: 29,
        children: []
      }
    ],
    records: {
      'th-hs-fin': makeRecords('TH-FIN', '°C/W', 8),
      'th-hs-base': makeRecords('TH-BASE', '°C/W', 8),
      'th-tim-pad': makeRecords('TH-PAD', 'W/mK', 8),
      'th-tim-paste': makeRecords('TH-PASTE', 'W/mK', 8),
      'th-module': makeRecords('TH-MOD', '°C', 8)
    }
  },
  power: {
    id: 'power',
    name: '供电',
    consistency: 91.5,
    totalItems: 134,
    deviationItems: 4,
    trend: -1.8,
    tree: [
      {
        id: 'pw-pcba',
        label: 'PCBA部件',
        level: 'component',
        testCount: 100,
        children: [
          {
            id: 'pw-vrm',
            label: 'VRM模块',
            level: 'material',
            testCount: 50,
            children: [
              { id: 'pw-vrm-mosfet', label: 'MOSFET', level: 'material', testCount: 25 },
              { id: 'pw-vrm-inductor', label: '电感', level: 'material', testCount: 25 }
            ]
          },
          {
            id: 'pw-pcb',
            label: 'PCB走线',
            level: 'material',
            testCount: 50,
            children: [
              { id: 'pw-pcb-power', label: '电源平面', level: 'material', testCount: 25 },
              { id: 'pw-pcb-ground', label: '地平面', level: 'material', testCount: 25 }
            ]
          }
        ]
      },
      {
        id: 'pw-module',
        label: '模组',
        level: 'module',
        testCount: 34,
        children: []
      }
    ],
    records: {
      'pw-vrm-mosfet': makeRecords('PW-MOS', 'V', 10),
      'pw-vrm-inductor': makeRecords('PW-IND', 'A', 10),
      'pw-pcb-power': makeRecords('PW-PWR', 'mΩ', 10),
      'pw-pcb-ground': makeRecords('PW-GND', 'mΩ', 10),
      'pw-module': makeRecords('PW-MOD', 'W', 8)
    }
  },
  pi: {
    id: 'pi',
    name: 'PI (电源完整性)',
    consistency: 97.3,
    totalItems: 78,
    deviationItems: 1,
    trend: 0.3,
    tree: [
      {
        id: 'pi-pcba',
        label: 'PCBA部件',
        level: 'component',
        testCount: 50,
        children: [
          {
            id: 'pi-pdn',
            label: 'PDN网络',
            level: 'material',
            testCount: 25,
            children: [
              { id: 'pi-pdn-cap', label: '去耦电容', level: 'material', testCount: 13 },
              { id: 'pi-pdn-plane', label: '电源地平面', level: 'material', testCount: 12 }
            ]
          },
          {
            id: 'pi-measure',
            label: '测量点',
            level: 'material',
            testCount: 25,
            children: [
              { id: 'pi-meas-vrm', label: 'VRM输出端', level: 'material', testCount: 13 },
              { id: 'pi-meas-load', label: '负载端', level: 'material', testCount: 12 }
            ]
          }
        ]
      },
      {
        id: 'pi-module',
        label: '模组',
        level: 'module',
        testCount: 28,
        children: []
      }
    ],
    records: {
      'pi-pdn-cap': makeRecords('PI-CAP', 'μF', 8),
      'pi-pdn-plane': makeRecords('PI-PLANE', 'mΩ', 8),
      'pi-meas-vrm': makeRecords('PI-VRM', 'mV', 8),
      'pi-meas-load': makeRecords('PI-LOAD', 'mV', 8),
      'pi-module': makeRecords('PI-MOD', 'mV', 8)
    }
  }
}
