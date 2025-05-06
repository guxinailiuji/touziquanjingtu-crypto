const companies = [
    // 公链 - Layer1
    { 
        id: 'bitcoin', 
        name: '比特币', 
        code: 'BTC', 
        sectorId: 'layer1',
        subsector: '比特币',
        marketCap: 1200,
        desc: '第一个也是最大的加密货币，作为数字黄金和价值存储的标准。',
        website: 'https://bitcoin.org'
    },
    { 
        id: 'ethereum', 
        name: '以太坊', 
        code: 'ETH', 
        sectorId: 'layer1',
        subsector: '以太坊',
        marketCap: 800,
        desc: '最大的智能合约平台，支持去中心化应用开发和DeFi生态。',
        website: 'https://ethereum.org'
    },
    { 
        id: 'solana', 
        name: 'Solana', 
        code: 'SOL', 
        sectorId: 'layer1',
        subsector: 'Solana',
        marketCap: 300,
        desc: '高性能公链，以其高吞吐量和低费用著称，支持DeFi和NFT生态。'
    },
    { 
        id: 'avalanche', 
        name: 'Avalanche', 
        code: 'AVAX', 
        sectorId: 'layer1',
        subsector: 'Avalanche',
        marketCap: 45,
        desc: '快速、低成本的智能合约平台，支持子网络创建。'
    },
    { 
        id: 'polygon', 
        name: 'Polygon', 
        code: 'MATIC', 
        sectorId: 'layer1',
        subsector: 'Layer2',
        marketCap: 40,
        desc: '以太坊扩展解决方案，提供更快速和低成本的交易。'
    },

    // DeFi项目
    { 
        id: 'uniswap', 
        name: 'Uniswap', 
        code: 'UNI', 
        sectorId: 'defi',
        subsector: 'DEX',
        marketCap: 35,
        desc: '最大的去中心化交易所，创新的AMM模型。'
    },
    { 
        id: 'aave', 
        name: 'Aave', 
        code: 'AAVE', 
        sectorId: 'defi',
        subsector: '借贷协议',
        marketCap: 25,
        desc: '领先的去中心化借贷协议，支持多种资产的借贷。'
    },
    { 
        id: 'curve', 
        name: 'Curve', 
        code: 'CRV', 
        sectorId: 'defi',
        subsector: 'DEX',
        marketCap: 20,
        desc: '专注于稳定币交易的DEX，提供高效的流动性。'
    },
    { 
        id: 'maker', 
        name: 'MakerDAO', 
        code: 'MKR', 
        sectorId: 'defi',
        subsector: '借贷协议',
        marketCap: 30,
        desc: '去中心化稳定币DAI的发行者，最早的DeFi项目之一。'
    },

    // GameFi项目
    { 
        id: 'axie', 
        name: 'Axie Infinity', 
        code: 'AXS', 
        sectorId: 'gamefi',
        subsector: 'P2E游戏',
        marketCap: 15,
        desc: '最成功的区块链游戏之一，开创P2E模式。'
    },
    { 
        id: 'sandbox', 
        name: 'The Sandbox', 
        code: 'SAND', 
        sectorId: 'gamefi',
        subsector: '虚拟世界',
        marketCap: 12,
        desc: '元宇宙游戏平台，允许用户创建和交易虚拟资产。'
    },
    { 
        id: 'gala', 
        name: 'Gala Games', 
        code: 'GALA', 
        sectorId: 'gamefi',
        subsector: 'P2E游戏',
        marketCap: 8,
        desc: '区块链游戏发行平台，拥有多个游戏项目。'
    },

    // MEME币
    { 
        id: 'doge', 
        name: '狗狗币', 
        code: 'DOGE', 
        sectorId: 'meme',
        subsector: '狗狗币生态',
        marketCap: 25,
        desc: '最早的迷因币，有着庞大的社区支持。'
    },
    { 
        id: 'shib', 
        name: 'Shiba Inu', 
        code: 'SHIB', 
        sectorId: 'meme',
        subsector: '狗狗币生态',
        marketCap: 20,
        desc: '狗狗币生态中的重要代币，拥有自己的DEX。'
    },
    { 
        id: 'trump', 
        name: 'Trump', 
        code: 'TRUMP', 
        sectorId: 'meme',
        subsector: '网红币',
        marketCap: 8,
        desc: '基于特朗普形象的迷因币，具有强大的社区效应。'
    },
    { 
        id: 'pepe', 
        name: 'Pepe', 
        code: 'PEPE', 
        sectorId: 'meme',
        subsector: '网红币',
        marketCap: 15,
        desc: '基于玛特福瑞漫画形象的迷因币，具有强大的社区效应。'
    },
    { 
        id: 'brett', 
        name: 'Brett', 
        code: 'BRETT', 
        sectorId: 'pepe', 
        subsector: '网红币',
        marketCap: 8,
        desc: '玛特福瑞漫画中的Brett形象，是Pepe的好朋友。'
    },
    { 
        id: 'landwolf', 
        name: 'Landwolf', 
        code: 'LAND', 
        sectorId: 'pepe', 
        subsector: '网红币',
        marketCap: 6,
        desc: '玛特福瑞漫画中的Landwolf形象，是Pepe的另一个朋友。'
    },
    { 
        id: 'andy', 
        name: 'Andy', 
        code: 'ANDY', 
        sectorId: 'pepe', 
        subsector: '网红币',
        marketCap: 5,
        desc: '玛特福瑞漫画中的Andy形象，是Pepe的室友。'
    },

    // 基建项目
    { 
        id: 'chainlink', 
        name: 'Chainlink', 
        code: 'LINK', 
        sectorId: 'infra',
        subsector: '预言机',
        marketCap: 40,
        desc: '最大的去中心化预言机网络，为智能合约提供外部数据。'
    },
    { 
        id: 'graph', 
        name: 'The Graph', 
        code: 'GRT', 
        sectorId: 'infra',
        subsector: '数据分析',
        marketCap: 15,
        desc: '区块链数据索引协议，为DApp提供查询服务。'
    },
    { 
        id: 'metamask', 
        name: 'MetaMask', 
        code: '', 
        sectorId: 'infra',
        subsector: '钱包',
        marketCap: 0,
        desc: '最流行的以太坊钱包，提供DApp浏览器功能。'
    },

    // AI项目
    { 
        id: 'ocean', 
        name: 'Ocean Protocol', 
        code: 'OCEAN', 
        sectorId: 'ai',
        subsector: 'AI数据',
        marketCap: 8,
        desc: '去中心化数据交易协议，支持AI训练数据集交易。'
    },
    { 
        id: 'fetch', 
        name: 'Fetch.ai', 
        code: 'FET', 
        sectorId: 'ai',
        subsector: 'AI交易',
        marketCap: 7,
        desc: '人工智能和机器学习驱动的去中心化数字经济网络。'
    },
    { 
        id: 'singularity', 
        name: 'SingularityNET', 
        code: 'AGIX', 
        sectorId: 'ai',
        subsector: 'AI服务',
        marketCap: 6,
        desc: '去中心化AI服务市场，支持AI模型交易和使用。'
    }
];

// Define relationships between companies
const companyRelationships = [
    { source: 'ethereum', target: 'uniswap', strength: 0.9, desc: 'Uniswap是以太坊上最大的DEX' },
    { source: 'ethereum', target: 'aave', strength: 0.8, desc: 'Aave是以太坊上主要的借贷协议' },
    { source: 'ethereum', target: 'chainlink', strength: 0.8, desc: 'Chainlink为以太坊智能合约提供数据' },
    { source: 'solana', target: 'axie', strength: 0.6, desc: 'Axie在Solana上发展新版本' },
    { source: 'polygon', target: 'sandbox', strength: 0.7, desc: 'Sandbox在Polygon上运行以降低费用' },
    { source: 'bitcoin', target: 'doge', strength: 0.4, desc: 'DOGE受比特币价格影响显著' },
    { source: 'ethereum', target: 'metamask', strength: 0.9, desc: 'MetaMask是主要的以太坊钱包' },
    { source: 'chainlink', target: 'aave', strength: 0.7, desc: 'Aave使用Chainlink预言机服务' },
    { source: 'uniswap', target: 'curve', strength: 0.6, desc: 'DEX领域的竞争关系' },
    { source: 'ocean', target: 'singularity', strength: 0.5, desc: 'AI数据和服务的协同' },
    { source: 'pepe', target: 'brett', strength: 0.8, desc: 'Brett是Pepe的好朋友' },
    { source: 'pepe', target: 'andy', strength: 0.8, desc: 'Andy是Pepe的室友' },
    { source: 'pepe', target: 'landwolf', strength: 0.8, desc: 'Landwolf是Pepe的另一个朋友' }
];
