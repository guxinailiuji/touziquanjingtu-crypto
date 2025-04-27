const sectors = [
    {
        id: 'layer1',
        name: '公链',
        desc: '公链是加密货币生态系统的基础设施，包括比特币、以太坊、Solana等主流公链。它们为整个加密货币市场提供基础设施支持，是DeFi、GameFi等应用的底层平台。',
        importance: 10,
        subsectors: ['比特币', '以太坊', 'Solana', 'Avalanche', 'Polygon', 'Layer2']
    },
    {
        id: 'defi',
        name: 'DeFi',
        desc: 'DeFi（去中心化金融）是加密货币最重要的应用场景之一，包括去中心化交易所、借贷协议、流动性挖矿等多个细分领域。',
        importance: 9,
        subsectors: ['DEX', '借贷协议', '跨链桥', '衍生品', '收益聚合器']
    },
    {
        id: 'gamefi',
        name: 'GameFi',
        desc: 'GameFi结合了区块链游戏和金融元素，创造了"玩赚"(Play-to-Earn)模式，包括虚拟世界、NFT游戏等多个领域。',
        importance: 7,
        subsectors: ['P2E游戏', '虚拟世界', 'NFT交易', '游戏公会']
    },
    {
        id: 'meme',
        name: 'MEME币',
        desc: 'MEME币是加密货币市场中具有社交属性和文化现象的代币，虽然大多缺乏实际应用价值，但往往能引发巨大的社区效应。',
        importance: 6,
        subsectors: ['狗狗币生态', '社区代币', '网红币']
    },
    {
        id: 'infra',
        name: '基建',
        desc: '加密货币基建包括钱包、预言机、数据分析等基础设施，为整个加密生态的发展提供必要的工具和服务支持。',
        importance: 8.5,
        subsectors: ['钱包', '预言机', '数据分析', '托管服务']
    },
    {
        id: 'ai',
        name: 'AI',
        desc: 'AI在加密货币领域的应用正在快速发展，包括AI交易、市场分析、内容生成等多个方向，是新兴的重要赛道。',
        importance: 8,
        subsectors: ['AI交易', '市场预测', 'AI内容', '智能合约优化']
    }
];

// Define relationships between sectors
const sectorRelationships = [
    { source: 'layer1', target: 'defi', strength: 0.9, desc: '公链为DeFi应用提供基础设施支持' },
    { source: 'layer1', target: 'gamefi', strength: 0.8, desc: '公链性能直接影响GameFi的用户体验' },
    { source: 'layer1', target: 'infra', strength: 0.7, desc: '基础设施需要与公链紧密配合' },
    { source: 'defi', target: 'gamefi', strength: 0.6, desc: 'GameFi项目常常需要DeFi功能支持' },
    { source: 'defi', target: 'ai', strength: 0.7, desc: 'AI技术在DeFi交易和风控中的应用' },
    { source: 'gamefi', target: 'meme', strength: 0.5, desc: 'MEME文化与GameFi项目的社区互动' },
    { source: 'infra', target: 'ai', strength: 0.8, desc: 'AI需要基础设施的数据支持' },
    { source: 'infra', target: 'defi', strength: 0.8, desc: '基建为DeFi提供必要的工具支持' },
    { source: 'meme', target: 'defi', strength: 0.4, desc: 'MEME币常在DEX上进行交易' },
    { source: 'ai', target: 'meme', strength: 0.3, desc: 'AI技术用于MEME币市场分析' }
];
